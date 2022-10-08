import { useRouter } from "next/router";
import Cls from "./Cls";

interface BackProps {
    back : boolean;
    title : string;
    horizen? : boolean;
}


export function Back({title, back,horizen} : BackProps){
    const router = useRouter();
    const backEvent = () => {
        router.back();
    }
    return(
        <div className="relative mb-14">
        <div className="bg-white h-14 fixed top-0 w-full flex items-center rounded-b-md">
            <div className={Cls("flex w-full justify-center rounded-b-md items-center relative",horizen ? "border-b-2 pb-2 mx-3 shadow-sm" : "")}>
            {back ? 
            <div onClick={backEvent} className="absolute top-0 left-3">
                <svg 
                className="text-black w-[30px] cursor-pointer aspect-square" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512">
                <path fill="currentColor" d="M177.5 98c-8.8-3.8-19-2-26 4.6l-144 136C2.7 243.1 0 249.4 0 256s2.7 12.9 7.5 17.4l144 136c7 6.6 17.2 8.4 26 4.6s14.5-12.5 14.5-22l0-88 288 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-288 0 0-88c0-9.6-5.7-18.2-14.5-22z"/>
                </svg>
            </div> : null}
            <h2 className="font-bold text-lg">{title}</h2>
            </div>
        </div>
        </div>
    );
}