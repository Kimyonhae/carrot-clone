import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "../../users/me/login";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const { query : {id},session : {user}} = req; 
    const alreadyExits = await client.fav.findFirst({
        where : {
            userId : user.id,
            productId : +id!.toString(),
        }
    });
    if(alreadyExits){
        await client.fav.delete({
            where : {
                id : alreadyExits.id, 
            }
        })
    }
    else {
        await client.fav.create({
            data : {
                user : {
                    connect : {
                        id : user?.id,
                    }
                },
                product : {
                    connect : {
                        id : +id!.toString(),
                    }
                }
            }
        })
    }
    return res.json({
        ok : true,
    })
}
export default ApiSesstion(WithHandler(["POST"],Handler));