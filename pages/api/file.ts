import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiRequest, NextApiResponse } from "next";

export interface NextResponseProps {
    ok : boolean;
    [key : string] : any;
}

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const response = await(await fetch(`
    https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/images/v2/direct_upload
    `,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${process.env.API_TOKEN}`
        }
    })).json();
    console.log(response);
    return res.json({
        ok : true,
        ...response.result,
    })
}
export default ApiSesstion(WithHandler(["GET"],Handler))