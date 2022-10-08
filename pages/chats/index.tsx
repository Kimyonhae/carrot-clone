import TabMenu from "@components/tabMenu";
import Uservertify from "@components/useUser";
import client from "@libs/client/client";
import { ServerSideSesstion } from "@libs/server/withIronSesstion";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Chats } from "prisma/prisma-client";
import useSWR, { SWRConfig } from "swr";



interface productChatProps {
    id : number;
    createAt : string;
    user : {
        name : string;
        avatar : string;
        id : number;
    };
    Chats : Chats[];
}

interface ChatSWRProps {
    ok : boolean;
    productsChat : productChatProps[];
    currentUser : {
        avatar : string;
        id : number;
        name : string;
    }
}

function ChatsCenter(){
    const {user} = Uservertify();
    const {data} = useSWR<ChatSWRProps>(`/api/chats/`);
    return(
        <div>
            {data?.productsChat ? <div className="overflow-scroll h-[93vh]">
            {data?.productsChat.map((chats) => (
                <Link key={chats.id} href={`/chats/${chats.id}`}>
                <div key={chats.id} className="w-full p-4 cursor-pointer bg-gray-300 flex items-center border-b-2">
                        <div className="flex justify-between w-full items-center">
                        <div className="flex items-center space-x-2">
                            {chats.user ? 
                            <Image width={40} height={40} src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${chats.user.avatar}/public`} className="bg-gray-400 aspect-square w-10 rounded-full mx-2"/>  
                            : <div className="bg-gray-400 aspect-square w-10 rounded-full mx-2"/>} 
                            <span>{ chats.user.name }</span>
                        </div>
                        <div className="mt-2 font-medium">
                            <div className="font-thin">
                                {chats.createAt}
                            </div>
                        </div>
                        </div>
                    </div>
                </Link>
            ))}
            </div>  
                : 
            <div className="h-screen flex justify-center items-center">
                <h1 className="text-lg font-bold">{`사용자님.. 채팅이 없어요..`}</h1>
            </div>
            }
            <TabMenu/>
        </div>
    );
}
export const Page : NextPage<{productsChat : productChatProps, currentUser : any}> = ({productsChat,currentUser}) => {
    return(
        <SWRConfig value={{
            fallback : {
                "/api/chats/" : {
                    ok : true,
                    productsChat,
                    currentUser
                }
            }
        }}>
            <ChatsCenter/>
        </SWRConfig>
    );
}
export const getServerSideProps  = ServerSideSesstion(async function ({req} : NextPageContext){
    const productsChat = await client.product.findMany({
        select : {
            id : true,
            createAt : true,
            user : {
                select : {
                    name : true,
                    avatar : true,
                    id : true,
                }
            },
            Chats : true,
        }
    }) 
    const currentUser = await client.user.findUnique({
        where : {
            id : req?.session.user?.id,
        },
        select : {
            id : true,
            name : true,
            avatar : true,
        }
    })
    return {
        props : {
            productsChat : JSON.parse(JSON.stringify(productsChat)),
            currentUser : JSON.parse(JSON.stringify(currentUser)),
        }
    }
})

export default Page;


