import { Back } from "@components/back";
import { Input } from "@components/input";
import UseMutation from "@components/useMutation";
import Uservertify from "@components/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import { Product } from "prisma/prisma-client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UploadFormProps {
    storeName : string;
    adress : string;
    flavor : number;
    fileUrl? : FileList | any;
    review : string;
}
interface ProductProps {
    ok : boolean;
    product : Product;
}
export default function UploadFood(){
    const {register,handleSubmit,watch} = useForm<UploadFormProps>();
    const {user} = Uservertify();
    const [uploadFn,{data,loading}] = UseMutation<ProductProps>(`/api/products/`);
    const router = useRouter();
    const [uploadView,SetuploadView] = useState(""); 
    const onvalid = async({storeName,adress,flavor,fileUrl,review} : UploadFormProps) => {
        if(file && file.length > 0 && user){
            const {
                id,
                uploadURL
            } = await (await fetch(`/api/file`)).json();
            const form = new FormData();
            form.append("file",file[0],user.id + "");
            await (await fetch(uploadURL,{
                method : "POST",
                body : form,
            })).json();
            uploadFn({
                storeName,
                adress,
                flavor,
                fileUrl : id,
                review,
            })
        }else {
            uploadFn({
                storeName,
                adress,
                flavor,
                review,
            })
        }
    }
    useEffect(() => {
        if(data && data.ok){
            router.push(`/food/${data.product.id}`)
        }
    },[data,router])
    const file = watch("fileUrl");
    useEffect(() => {
        if(file && file.length > 0){
            const fileUrl = file[0];
            SetuploadView(URL.createObjectURL(fileUrl));
        }
    },[file])
    return(
        <>
        <Back title="upload" back/>
        <div className="bg-black h-[120vh] pt-16 md:h-[130vh] lg:h-[140vh]  2xl:h-screen">
            <form onSubmit={handleSubmit(onvalid)} className="mx-4 2xl:grid 2xl:grid-cols-2 2xl:mt-10">
                {uploadView ? 
                <img src={uploadView} className="aspect-video border-4 2xl:w-[80%] mx-auto max-h-[400px] 2xl:mt-28 rounded-md"/>
                : <div className="aspect-video border-4 2xl:w-[80%] 2xl:mx-auto 2xl:mt-28 rounded-md border-dotted">
                    <label className="py-40 cursor-pointer w-full aspect-video flex justify-center items-center">
                    <svg 
                    className="text-white" 
                    width={50}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"
                    >
                    <path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"/>
                    </svg>
                    <input 
                    {...register("fileUrl")}
                    type="file" 
                    accept="image/*" 
                    className="hidden"/>
                    </label>
                </div>}
                <div className="pt-14 space-y-10 2xl:px-4">
                    <Input register={register("storeName",{required : true,})} name="가게 이름" labelId="Name"/>
                    <Input register={register("adress",{required : true})} name="주소" labelId="adress"/>
                    <Input register={register("flavor",{required : true})} name="맛 평가" type="number" labelId="taste"/>
                    <textarea {...register("review",{required : true})} className="w-full px-2 pt-1 rounded-md min-h-[100px]"/>
                    <button className="w-full bg-white h-14 rounded-md shadow-sm font-semibold">
                        {loading ? "upload" : "loading..."}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}