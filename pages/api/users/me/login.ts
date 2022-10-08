import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";

export interface NextResponseProps {
    ok : boolean;
    [key : string] : any;
}

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {body : {LoginId,password}} = req; 
    const user  = await client.user.upsert({
        where : {
            LoginId,
        },
        create : {
            LoginId,
            name : "익명의 사용자",
            introduce : "자기소개",
            password,
            avatar : null,
        },
        update : {},
    })
    req.session.user = {
        id : user.id
    }
    await req.session.save();
    return res.json({
        ok : true,
        user,
    })
}
export default ApiSesstion(WithHandler(["POST"],Handler));