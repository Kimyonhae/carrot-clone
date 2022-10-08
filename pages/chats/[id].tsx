import { Back } from "@components/back";
import Cls from "@components/Cls";
import UseMutation from "@components/useMutation";
import Uservertify from "@components/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import { Chats, User } from "prisma/prisma-client";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface MsgProps {
    message : string;
}
interface SWRChatsProps {
    ok : boolean;
    chats : Chats[];
    productUser : {
        id : number;
        userId : number;
        user : User;
    }
}
export default function Chatting(){
    const {user} = Uservertify();
    const router = useRouter();
    const {register,handleSubmit,reset} = useForm<MsgProps>();
    const [chatFn,{data}] = UseMutation(router.query.id ?  `/api/chats/${router.query.id}` : "");
    const {data : chatsData,mutate} = useSWR<SWRChatsProps>(`/api/chats/${router.query.id}`);
    const onvalid = (message : MsgProps) => { 
        mutate(((prev : SWRChatsProps) => prev && {...prev,chats : [...prev.chats,{message : message.message,userId : user?.id}]})as any,false);
        chatFn({message});
        reset();
    }
    console.log(chatsData);
    return(
            <>
            <Back title="용해님과의 채팅방" back/>
            <div className="bg-black w-screen h-screen text-white">
            <div className="h-[85vh] overflow-scroll">
                    {chatsData?.chats.map((chat,index) => (
                        <div key={index} className={Cls("mt-2 mx-2 flex items-baseline",user?.id === chat.userId ? "flex-row-reverse" : "")}>
                        {user?.avatar ?  
                        <Image width={50} height={50} src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${user?.avatar}/public`} className="bg-gray-400 aspect-square w-10 rounded-full mx-2"/>  
                        : <Image width={50} height={50} src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${chatsData.productUser.user.avatar}/public`} className="bg-gray-400 aspect-square w-10 rounded-full mx-2"/>  
 
                        } 
                        <div className="bg-white mt-4 rounded-md shadow-sm p-2 max-w-md  mx-2 text-black">
                                {chat.message}
                        </div>
                    </div>
                    ))}
            </div>
            <form onSubmit={handleSubmit(onvalid)} className="w-full flex items-center justify-center">
            <input 
            type="text"
            {...register("message",{required : true})}
            className="fixed focus:outline-none focus:ring-white focus:ring-2 focus:ring-offset-2 foucs: ring-offset-black bottom-5 rounded-md w-[50%] h-9 pl-2 text-black"/>
            </form>
            </div>
        </>
    )
}