import { Input } from "@components/input";
import UseMutation from "@components/useMutation";
import Uservertify from "@components/useUser";
import { useRouter } from "next/router";
import { User } from "prisma/prisma-client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface loginFormProps {
    LoginId : string;
    password? : string;
    error? : string;
}
interface UserMutationProps {
    ok : boolean;
}
export default function Auth(){
    const router = useRouter();
    const {user,loading : userLoading} = Uservertify();
    const [loginFn,{data : LoginData,loading,error}] = UseMutation(`/api/users/me/login`);
    const [Login,SetLogin] = useState<loginFormProps>();
    const {register,
        handleSubmit,
        reset,
        formState : {errors
    }} = useForm<loginFormProps>({
        mode : "onChange"
    });
    const onValid = async(data : loginFormProps) => {
        if(data.LoginId === data.password){
            SetLogin(data);
            reset();
            return;
        }
        loginFn(data);
        reset();
    }
    useEffect(() => {
        if(LoginData){
            router.replace("/");
        }
    },[LoginData,router])
    return(
            <div className="bg-black pt-[280px] h-screen p-10">
                <div className="mx-w-2xl mx-auto w-[550px]">
                    <h3 className="text-center text-3xl text-white font-bold">Log in</h3>
                    <form onSubmit={handleSubmit(onValid)} className="mt-8 space-y-10">
                        <Input 
                        register={register("LoginId",
                        {required : true,
                        minLength : {
                            value : 6,
                            message : "아이디를 6글자 이상으로 해주세요.",
                        },
                        validate : {
                            Notemail : (value) => 
                            value.includes("@") ? "이메일 양식은 안됩니다." : undefined,
                        }
                        })}
                        name="아이디" 
                        labelId="loginId"/>
                        <div className="font-bold text-red-500">
                            {errors.LoginId?.message}
                        </div>
                        <Input 
                        register={register("password",
                        {required : true,
                        minLength : {
                            value : 6,
                            message : "비밀번호를 6글자 이상으로 해주세요"
                        }})}
                        name="비밀번호"
                        type="password" 
                        labelId="Password"/>
                        <div className="font-bold text-red-500">
                            {errors.password?.message}
                        </div>
                        <button className="w-full bg-white h-[50px] 
                        rounded-md focus:border-blue-500 focus:ring-2 focus:ring-offset-2
                        hover:bg-white-400">
                            <span className="text-black font-semibold">{loading ? "Login" : "loading..."}</span>
                        </button>
                        {errors.error?.message}
                    </form>
                        {Login !==undefined && 
                        <div className="font-bold text-center mt-10 text-red-500">
                                {Login.LoginId === Login.password && "아이디와 비밀번호는 같을수 없습니다."}
                        </div>}
                </div>
            </div>
    );
}