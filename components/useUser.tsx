import { useRouter } from "next/router";
import { User } from "prisma/prisma-client";
import { useEffect } from "react";
import useSWR from "swr";

interface SWRProps {
    ok : boolean;
    profile : User
}


export default function Uservertify(){
    const {data,error} = useSWR<SWRProps>(`/api/profile/`);
    const router = useRouter();
    useEffect(() => {
        if(data && !data.ok){
            router.replace("/auth");
        }
    },[data,router])
    return {user : data?.profile,loading : !error && !data};
}