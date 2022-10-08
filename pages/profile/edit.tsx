import { Back } from "@components/back";
import { Input } from "@components/input";
import TabMenu from "@components/tabMenu";
import UseMutation from "@components/useMutation";
import Uservertify from "@components/useUser";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { User } from "prisma/prisma-client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SWRConfig } from "swr";


interface EditProps {
    name : string;
    introduce : string;
    avatar? : FileList;
}
interface editProfileProps {
    ok : boolean;
    editUser : User;
}
export default function Edit(){
    const {register,handleSubmit,reset,watch} = useForm<EditProps>();
    const router = useRouter();
    const {user} = Uservertify();
    const [preViewImage,SetpreViewImage] = useState("");
    const [editFn,{data,loading}] = UseMutation<editProfileProps>(`/api/users/me/edit`);
    const onValid = async({name,introduce,avatar} : EditProps) => {
        if(avatar && avatar.length > 0 && user?.id){
            const {uploadURL} = await (await fetch(`/api/file`)).json()
            const form = new FormData();
            form.append("file",avatar[0],user?.id + "");
            const {result : {id}} =  await ( await fetch(uploadURL,{
                method : "POST",
                body : form,
            })).json();
            editFn({
                name,
                introduce,
                avatar : id,
            });
        }else{
            editFn({
                name,
                introduce,
            });
            }
    }
    useEffect(() => {
        if(data && data.ok && user){
            router.push("/profile")
        }
    },[data,router,user])
    const avatar = watch("avatar");
    useEffect(() => {
        if(avatar && avatar.length > 0){
            const file = avatar[0];
            SetpreViewImage( URL.createObjectURL(file));
        }
    },[avatar])
    console.log(user,preViewImage);
    //preview 가 있을때 없을때
    //avatar가 있을때 없을때..
    return(
    <>
        <Back title="Edit" back/>
        <div className="bg-black pt-[200px] h-screen p-10">
            <div className="max-w-2xl mx-auto">
                <h3 className="text-center text-3xl text-white font-bold">Profile Edit</h3>
                <form onSubmit={handleSubmit(onValid)} className="mt-8 space-y-10">
                    <div className="flex items-center justify-start">
                        {preViewImage ? 
                        <img src={preViewImage} className = "bg-white aspect-square rounded-full w-20"/>
                        :user?.avatar ? <img src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${user?.avatar}/public`} 
                        className = "bg-white aspect-square rounded-full w-20"/> 
                        : <div className = "bg-white aspect-square rounded-full w-20"/>}
                        <label htmlFor="picture" className="py-2 ml-2 px-4 bg-white hover:transition-colors hover:border-white hover:border hover:text-white hover:bg-black rounded-md">
                        <input 
                        {...register("avatar")} 
                        type="file" 
                        id="picture" 
                        accept="image/*"
                        className="hidden"/>
                        <div className="font-semibold">업로드</div>
                        </label>
                    </div>
                    <Input value={user?.name} register={register("name",{required : true})} name="이름" labelId="Name"/>
                    <div className="space-y-2">
                    <label htmlFor="description" className="text-white font-bold">
                        자기 소개
                    </label>
                    <textarea 
                    {...register("introduce",{required : true})} 
                    id="description" 
                    defaultValue={user?.introduce}
                    className="w-full text-lg p-2 max-h-[300px] focus:outline-none rounded-md shadow-sm h-[100px]"/>
                    </div>
                    <button className="w-full bg-white h-[50px] 
                    rounded-md focus:border-blue-500 focus:ring-2 focus:ring-offset-2
                    hover:bg-white-400">
                        <span className="text-black font-semibold">{loading ? "Edit" : "loading..."}</span>
                    </button>
                </form>
            </div>
        </div>
        <TabMenu/>
    </>
    );
}
