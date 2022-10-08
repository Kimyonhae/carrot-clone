import { Back } from "@components/back";
import UseMutation from "@components/useMutation";
import client from "@libs/client/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Todos } from "prisma/prisma-client";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";

interface FormTodoListProps {
    todo? : string;
}
interface SWRTodoListProps {
    ok : boolean;
    todos : Todos[];
}
const TodoList : NextPage<{todos : Todos[]}> = ({todos}) => {
    const {register,handleSubmit,reset} = useForm<FormTodoListProps>();
    const [todoFn] = UseMutation(`/api/users/todo`);
    const router = useRouter();
    const {data,mutate} = useSWR<SWRTodoListProps>(`/api/users/todo`);
    const onValid = (todo : any) => {
        todoFn(todo);
        reset();
        if(!data) return;
        mutate(prev => prev && {...prev,todos : [...prev.todos,todo]} as any,false)
    }
    const DeleteEvent = (ctx : any) => {
        const ctxId = Number(ctx.target.id);
        todoFn({ctxId});
        alert("삭제 되었습니다.");
    }
    return(
        <>
        <Back title="TodoList" back/>
        <div className="bg-black h-screen">
            <form onSubmit={handleSubmit(onValid)} className="pt-10 flex justify-center items-center border-b pb-5 mx-4">
                <input
                {...register("todo",{required : true})}
                className="w-[50%] max-w-2xl h-9 rounded-sm shadow-md pl-2" 
                type={"text"}/>
            </form>
            {data?.todos.map((todo,index) => (
                <div key={index} className="bg-white max-w-2xl mt-5 p-5 rounded-full mx-auto">
                    <div className="flex justify-between itmes-center px-3">
                        <span className="font-semibold max-w-md">{todo.todo}</span>
                        <div className="text-lg w-[60px] items-center flex justify-center">
                            <button id={todo.id + ""} onClick={DeleteEvent}>✖︎</button>
                        </div>
                    </div> 
                </div>
            ))}
        </div>
        </>
    )
}

export async function getStaticProps() {
        const todos = await client.todos.findMany({});
        return{
            props : {
                todos : JSON.parse(JSON.stringify(todos)),
            },
            revalidate : 5,
        }
}
export default TodoList;