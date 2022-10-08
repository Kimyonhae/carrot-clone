import { NextApiRequest, NextApiResponse } from "next";
import { userAgent } from "next/server";

type method = "POST" | "GET" | "DELETE";
export default function WithHandler
        (
                methods : method[],
                handler : (req : NextApiRequest,res : NextApiResponse) => void,
        )
    {
    return async function (req : NextApiRequest,res : NextApiResponse) : Promise<any> {
        if(req.method && !methods.includes(req.method as any)){
            res.status(405).end();
        }
        try {
            await handler(req,res);
        }catch(error){
            console.log(error);
        }
    }
}