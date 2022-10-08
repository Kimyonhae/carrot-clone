import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "pages/api/users/me/login";
import Id from "./[id]";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {session : {user}} = req;
    if(req.method === "GET"){
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
                id : user.id,
            },
            select : {
                id : true,
                name : true,
                avatar : true,
            }
        })
        return res.json({
            ok : true,
            productsChat,
            currentUser,
        })
    }
}
export default ApiSesstion(WithHandler(["GET","POST"],Handler));