import { useState } from "react"

interface MutationProps<T>{
    loading? : boolean;
    data? : T;
    error? : object;
}
type MutationPropsResult<T> = [(formData : any) => void,MutationProps<T>];

export default function UseMutation<T = any>(url : string):MutationPropsResult<T> {
    const [state,SetState] = useState<MutationProps<T>>({
        loading : true,
        data :  undefined,
        error : undefined
    });
    async function Mutation(formData : any){
        SetState((prev) => ({...prev,loading : false}));
        fetch(url,{
            method : "POST",
            body : JSON.stringify(formData),
            headers : {
                "content-Type" : "application/json",
            }
        }).then(response => response.json().catch(() => {}))
        .then((data) => SetState((prev) => ({...prev,data})))
        .catch((error) => SetState((prev) => ({...prev,error})))
        .finally(() => SetState((prev) => ({...prev,loading : true})))
    }
    return [Mutation,{...state}];
}