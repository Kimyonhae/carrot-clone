import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
    name : string;
    labelId : string;
    type? : string;
    value? : string;
    register? : UseFormRegisterReturn;
}

export function Input({name,labelId ,type,register,value} : InputProps){
    return(
        <div className="flex flex-col space-y-2">
            <label className="font-bold text-lg text-white" htmlFor={labelId}>{name}</label>
            {type === "number" ?
            <input 
            className="w-fit pl-2 focus:outline-none rounded-md shadow-sm h-[45px]"
            {...register}
            min={1} 
            max={10} 
            defaultValue={1}
            type={type} 
            id={labelId}/>
                :             
            <input 
            className="w-full pl-2 focus:outline-none rounded-md shadow-sm h-[45px]" 
            type={type}
            defaultValue={value}
            {...register}
            id={labelId}/>
            }
        </div>
    );
}