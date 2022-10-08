import { Back } from "@components/back";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import {  Product } from "prisma/prisma-client";
import Uservertify from "@components/useUser";
import Image from "next/image";
import UseMutation from "@components/useMutation";
import Cls from "@components/Cls";
import { GetStaticProps, NextPage, NextPageContext } from "next";
import client from "@libs/client/client";

interface ProductWithUser extends Product{
    user : {
        id : number;
        name : string;
        avatar : string | null;
    }
}

export interface ProductSWRProps {
    isliked? : boolean;
    ok? : boolean;
    product : ProductWithUser;
}



const Foods : NextPage<ProductSWRProps> = ({product}) => {
    const {user} = Uservertify();
    const router = useRouter();
    const [favFn] = UseMutation(`/api/products/${router.query.id}/fav`);
    const {data,mutate} = useSWR<ProductSWRProps>(router.query.id ? `/api/products/${router.query.id}` : null);
    const fetchingEvent = async() => {
        const checking = confirm("채팅 하시겠습니까?");
        if(checking){
            router.push(`/chats/${router.query.id ? `${router.query.id}` : null}`);
        }
    }
    const FavClickEvent = () => {
                mutate({...data!,isliked : !data?.isliked} as any,false);
                favFn({});
    }
    if(router.isFallback){
        return( 
        <div className="h-screen bg-gradient-to-r flex items-center justify-center from-pink-400 to-purple-400">
            <h1 className="text-2xl font-bold text-white">loading...</h1>
        </div>
        );
    }
    console.log(data?.isliked);
    return(
        <div className="h-screen bg-black">
            <Back back title={product.storeName}/>
            <div className="max-w-2xl mx-auto">
                <div className="pt-14">
                    {product?.fileUrl ? 
                    <div className="relative h-[400px]">
                        <Image layout="fill" src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${product.fileUrl}/public`} className="object-fill rounded-md shadow-sm bg-white"/>
                    </div>
                    : <div className="aspect-video rounded-md shadow-sm bg-white"/>}
                </div>
                <div className="flex justify-between items-center">
                <div className="text-white flex items-center py-4 pl-2">
                    {product?.user.avatar ?  
                        <Image width={80} height={80} src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${product.user.avatar}/public`} className="bg-white aspect-square w-20 rounded-full mr-2"/>
                        : <div className="bg-white aspect-square w-20 rounded-full mr-2"/>}
                    <div className="flex flex-col justify-center ml-2">
                        <span className="font-bold text-md">{product.user.name}</span>
                        <span>{`10점 만점의 ${product.flavor}점`}</span>
                    </div>
                </div>
                <button onClick={FavClickEvent} className="mr-2">
                <svg 
                className={Cls("w-10 border rounded-md p-2",data?.isliked ? "text-red-500" : "text-white")}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path 
                    width={30}
                    fill="currentColor"
                    d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/>
                    </svg>
                </button>
                </div>
                <p className=" mt-4 px-1 rounded-md shadow-sm mb-6 bg-white overflow-hidden h-[300px]">
                {product.review}
                </p>
                    {user?.id !== product.userId  ? <button onClick={fetchingEvent} className="w-full  bg-white h-14 rounded-md shadow-sm font-semibold">
                        Chating
                    </button> : 
                    <button className="w-full  bg-white h-14 rounded-md shadow-sm font-semibold">
                    넌 못들어간다..
                    </button>
                }
            </div>
        </div>
    );
}
export async function getStaticPaths() {
    return{
        paths : [],
        fallback : true,
    }
}
export const getStaticProps:GetStaticProps = async(ctx)  => {
    if(!ctx.params?.id){
        return{
            props : {},
        }
    }
    const product = await client.product.findUnique({
        where : {
            id : +ctx.params?.id.toString(),
        },
        include : {
            user : {
                select : {
                    id : true,
                    name : true,
                    avatar : true,
                }
            },
        }
    })
    return{
        props : {
            product : JSON.parse(JSON.stringify(product)),
        },
    }
}
export default Foods;