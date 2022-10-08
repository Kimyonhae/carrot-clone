import { Back } from "@components/back";
import Cls from "@components/Cls";
import { TabBar } from "@components/tabBar";
import TabMenu from "@components/tabMenu";
import UseMutation from "@components/useMutation";
import Uservertify from "@components/useUser";
import client from "@libs/client/client";
import { ServerSideSesstion } from "@libs/server/withIronSesstion";
import { NextPage, NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { User } from "prisma/prisma-client";
import { SWRConfig } from "swr";

const Profile : NextPage = () => {
    const {user} = Uservertify();    
    return(
        <>
            <Back title="내 정보" back={false} horizen/>
            <div className="h-screen mx-2">
                <div className="mt-20 flex items-center justify-between">
                    <div className="flex items-center">
                    {user?.avatar ? <Image src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${user.avatar}/public`} width={80} height={80} className="bg-black aspect-square w-20 rounded-full mr-2"/> 
                    : <div className="bg-black aspect-square w-20 rounded-full mr-2"/>}
                        <div className="ml-2 font-semibold">
                            <h3>{user !==undefined ? user?.name : "loading..."}</h3>
                            <Link href={"/profile/edit"}>
                                <a>
                                    edit profile &gt;
                                </a>
                            </Link>
                        </div>
                    </div>
                    <button 
                    className="bg-black w-16 h-16 mr-2 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2">
                        <TabBar path="/auth" viewBox="0 0 512 512" d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/>
                    </button>
                </div>
                <div className="h-24 mt-8 flex justify-around items-center">
                        <button className={Cls("bg-red-500 w-16 h-16 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2")}>
                            <TabBar path="/profile/food" viewBox="0 0 448 512" d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                        </button>
                        <button className="bg-blue-500 w-16 h-16 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2">
                            <TabBar path="/profile/heart" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" viewBox="0 0 512 512"/>
                        </button>
                        <button className="bg-green-500 w-16 h-16 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2">
                            <TabBar path="/profile/toDoList/" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" viewBox="0 0 512 512"/>
                        </button>       
                    </div>
                <p className="overflow-scroll border-2 border-blue-300 rounded-md shadow-md mt-10 w-full h-[50vh] px-2">
                    {user !== undefined ? user?.introduce : "loading..."}
                </p>
            </div>
            <TabMenu />
        </>
    );
}
const Page : NextPage<{profile : User}> = ({profile}) => {
    return(
        <SWRConfig value={{
            fallback : {
                "/api/profile/" : {
                    ok : true,
                    profile,
                }
            }
        }}>
            <Profile/>
        </SWRConfig>
    );
}
export const getServerSideProps = ServerSideSesstion(async function(ctx : NextPageContext){
    const profile = await client.user.findUnique({
        where : {
            id : ctx.req?.session.user?.id,
        }
    })
    return{
        props : {
            profile : JSON.parse(JSON.stringify(profile)),
        }
    }
})
export default Page