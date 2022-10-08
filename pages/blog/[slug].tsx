import { Back } from "@components/back";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post:NextPage<{post : string,data : any}> = ({post,data}) => {
    return(
        <>
        <Back title={data ?  data?.title : "작가 미상"} back/>
        <div className="h-screen bg-gradient-to-r from-purple-400 to-pink-400">
            <div className="flex flex-col absolute top-[120px] text-indigo-200 text-lg left-[60px]">
                <span>{`category : ${data?.date}`}</span>
                <span>{`날짜 : ${data?.date}`}</span>
            </div>
        <div
        className="max-w-xl px-2 mx-auto blog-post-content text-indigo-200
        bg-gradient-to-r from-purple-400 to-pink-400 
        font-semibold pt-5 h-[800px] overflow-scroll flex items-center mt-10 flex-col 
        space-y-6 rounded-md shadow-xl"
        dangerouslySetInnerHTML={{__html : post}}/>
        </div>
        </>
        );
}

export function getStaticPaths(){
    return{
        paths : [],
        fallback : "blocking",
    }
}
export const getStaticProps : GetStaticProps = async(ctx : any) => {
    const {content,data} = matter.read(`./posts/${ctx.params.slug}.md`);
    const {value} = await unified().use(remarkParse).use(remarkHtml).process(content);
    return{
        props : {
            post : JSON.parse(JSON.stringify(value)),
            data,
        }
    }
}

export default Post;