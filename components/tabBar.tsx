import Link from "next/link";

interface TabBarProps{
    viewBox : string;
    d : string;
    path : string;
}

export function TabBar({viewBox,d,path} : TabBarProps){
    return(
        <Link href={path}>
            <div className="p-4">
                <svg className='text-white' width={30} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
                <path fill='currentColor' d={d}/>
                </svg>
            </div>
        </Link>
    );
}