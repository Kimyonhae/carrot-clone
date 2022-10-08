import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "../../users/me/login";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const { query : {id},session : {user}} = req; 
    if(req.method === "GET"){
        const product = await client.product.findUnique({
            where : {
                id : +id!.toString(),
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
        const isliked = Boolean(await client.fav.findFirst({
            where : {
                productId : product?.id,
                userId : user.id,
            },
            select : {
                id : true,
            }
        }));
        return res.json({
            ok : true,
            product,
            isliked,
        })
    }
}
export default ApiSesstion(WithHandler(["GET"],Handler));