import { Back } from "@components/back";
import Cls from "@components/Cls";
import client from "@libs/client/client";
import { ServerSideSesstion } from "@libs/server/withIronSesstion";
import { NextPage, NextPageContext } from "next";
import { Fav, Product } from "prisma/prisma-client";
import useSWR, { SWRConfig } from "swr";
interface ProductWithCountProps extends Product{
    _count : {
        Favs : number;
    }
}

interface ProductWithFavProps extends Fav{
    product : ProductWithCountProps;
}

interface SWRHeartsProps {
    ok : boolean;
    hearts:ProductWithFavProps[]; 
}

export function Heart(){
    const {data} = useSWR<SWRHeartsProps>(`/api/users/heart`);
    console.log(data);
    return(
        <>
        <Back title="찜한 가게" back/>
        {data?.hearts.map((heart) => (
            <div key={heart.id} className="py-5 flex items-center justify-between pl-2 border-b-2">
            <div className="flex items-center">
            {heart.product.fileUrl ?  
            <img src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${heart?.product.fileUrl}/public`}
            className="aspect-square w-[100px] rounded-md shadow-sm bg-black"/>
            : <div className="aspect-square w-[100px] rounded-md shadow-sm bg-black"/>}
            <div className="flex flex-col items-start ml-5">
                <span className="mb-2">{`가게 이름 : ${heart.product.storeName}`}</span>
                <span>{`맛 평가 : ${heart.product.flavor} 점`}</span>
            </div>
            </div>
            <div className="mr-5 flex items-center">
                <svg 
                className={Cls("w-10 rounded-md p-2 text-red-500")}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path 
                width={30}
                fill="currentColor"
                d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/>
                </svg>
                <span>{heart.product._count.Favs}</span>
            </div>
        </div>
        ))}
    </>
    )
}
const Page : NextPage<{hearts : ProductWithFavProps}> = ({hearts}) => {
    return(
        <SWRConfig value={{
            fallback : {
                "api/users/heart" : {
                    ok : true,
                    hearts,
                }
            }
        }}>
            <Heart/>
        </SWRConfig>
    );
}
export const getServerSideProps = ServerSideSesstion(async function({req} : NextPageContext){
    const hearts = await client.fav.findMany({
        where : {
            userId : req?.session.user.id,
        },
        include : {
            product : {
                select : {
                    storeName : true,
                    review : true,
                    fileUrl : true,
                    flavor : true,
                    _count : {
                        select : {
                            Favs : true,
                        }
                    }
                },
            },
        }
    })
    return{
        props : {
            hearts : JSON.parse(JSON.stringify(hearts)),
        }
    }
})
export default Page;

