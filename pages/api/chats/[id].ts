import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "pages/api/users/me/login";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {query : {id},body : {message},session : {user}} = req;
    if(req.method === "POST"){
        const chat = await client.chats.create({
            data : {
                message : message.message,
                user : {
                    connect : {
                        id : user?.id,
                    }
                },
                product : {
                    connect : {
                        id : +id!.toString(),
                    }
                },
            }
        })
        return res.json({
            ok : true,
            chat,
        })
    }
    if(req.method === "GET"){
        const chats = await client.chats.findMany({
            where : {
                productId : +id!.toString(),
            }
        })
        const productUser = await client.product.findFirst({
            where : {
                id : +id!.toString(),
            },
            select : {
                id : true,
                userId : true,
                user : {
                    select : {
                        name : true,
                        avatar : true,
                        id : true,
                    }
                }
            },
        })
        return res.json({
            ok : true,
            chats,
            productUser
        })
    }
}
export default ApiSesstion(WithHandler(["GET","POST"],Handler));