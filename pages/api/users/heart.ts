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
        const hearts = await client.fav.findMany({
            where : {
                userId : user.id,
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
        return res.json({
            ok : true,
            hearts,
        });
    
}
export default ApiSesstion(WithHandler(["GET"],Handler));