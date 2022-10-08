import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";

export interface NextResponseProps {
    ok : boolean;
    [key : string] : any;
}

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {session : {user}} = req;
    const foods = await client.product.findMany({
        where : {
            userId : user?.id,
        },
        select : {
            id : true,
            storeName : true,
            adress : true,
            fileUrl : true,
            flavor : true,
            _count : {
                select : {
                    Favs : true,
                }
            }
        }
    })
    return res.json({
        ok : true,
        foods,
    })  
}
export default ApiSesstion(WithHandler(["GET"],Handler));