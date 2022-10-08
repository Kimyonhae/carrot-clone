import client from "@libs/client/client";
import WithHandler from "@libs/server/withHandler";
import { ApiSesstion } from "@libs/server/withIronSesstion";
import { NextApiResponse , NextApiRequest } from "next";

export interface NextResponseProps {
    ok : boolean;
    [key : string] : any;
}

async function Handler(req : NextApiRequest,res : NextApiResponse<NextResponseProps>){
    const {body : {todo,ctxId},session : {user}} = req;
    if(req.method === "POST"){
        if(!ctxId && todo){
            const todos = await client.todos.create({
                data : {
                    user : {
                        connect : {
                            id : user.id,
                        }
                    },
                    todo,
                }
            })
            return res.json({
                ok : true,
                todos,
            })
        }else{
            const deleteTodo = await client.todos.delete({
                where : {
                    id : ctxId,
                }
            });
            return res.json({
                ok : true,
                deleteTodo,
            })
        }
    }
    if(req.method === "GET"){
        const todos = await client.todos.findMany({
            select : {
                id : true,
                todo : true,
                createAt : true,
            }
        });
        return res.json({
            ok : true,
            todos,
        })
    }
}
export default ApiSesstion(WithHandler(["POST","GET"],Handler));