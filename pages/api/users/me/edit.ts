import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";

export interface NextResponseProps {
    ok : boolean;
    [key : string] : any;
}

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {session : {user},body : {name,introduce,avatar}} = req;
    if(req.method === "POST"){
        if(avatar){
            const editUser  = await client.user.update({
                where : {
                    id : user?.id,
                },
                data : {
                    name,
                    introduce,
                    avatar,
                }
            })
            return res.json({
                ok : true,
                editUser,
            })
        }else {
            const editUser  = await client.user.update({
            where : {
                id : user?.id,
            },
            data : {
                name,
                introduce,
            }
        })
        return res.json({
            ok : true,
            editUser,
        })
        }
    }
    
}
export default ApiSesstion(WithHandler(["POST"],Handler));