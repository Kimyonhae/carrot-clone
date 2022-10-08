import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";
import { NextResponseProps } from "../users/me/login";

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const { body : {storeName,adress,flavor,review,fileUrl},session : {user} } = req; 
    if(req.method === "GET"){
        const products = await client.product.findMany({
            include : {
                user : {
                    select : {
                        name : true,
                        avatar : true,
                    }
                },
                _count : {
                    select : {
                        Favs : true
                    }      
                }
            }
        })
        return res.json({
            ok : true,
            products,
        })
    }
    if(req.method === "POST"){
        if(fileUrl){
            const product = await client.product.create({
                data : {
                    storeName,
                    adress,
                    flavor,
                    review,
                    fileUrl,
                    user : {
                        connect : {
                            id : user?.id,
                        }
                    }
                }
            })
            return res.json({
                ok : true,
                product,
            })
        }else {
            const product = await client.product.create({
                data : {
                    storeName,
                    adress,
                    flavor,
                    review,
                    fileUrl : null,
                    user : {
                        connect : {
                            id : user?.id,
                        }
                    }
                }
            })
            return res.json({
                ok : true,
                product,
            })
        }
        
    }
}
export default ApiSesstion(WithHandler(["GET","POST"],Handler));