import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "../users/me/login";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const { session : {user} } = req; 
    if(req.method === "GET"){
        const profile = await client.user.findFirst({
            where : {
                id : user?.id,
            },
        })
        return res.json({
            ok : true,
            profile,
        })
    }
}
export default ApiSesstion(WithHandler(["GET"],Handler));