import { Back } from "@components/back";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface PostsProps {
    title : string;
    category : string;
    date : string;
    slug : string;
}

const Blog : NextPage<{posts : PostsProps[]}> = ({posts}) => {
    return(
        <>
        <Back back title="Blog"/>
        <div className="mx-2 grid grid-flow-col 2xl:px-14 overflow-scroll gap-4">
        {posts?.map((post,index) => 
            <Link key={index} href={`/blog/${post.slug}`}>
                <div key={index} className="hover:bg-blue-200 hover:transition-colors border-2 font-semibold overflow-scroll border-blue-400 p-4 rounded-md shadow-sm flex flex-col mb-2">
                    <div className="font-blod text-xl">{index + 1}</div>
                    <span>title : {post.title}</span>
                    <span>
                        {`날짜/종류 : ${post.date} / ${post.category}`}
                    </span>
                </div> 
            </Link>   
        )}
        </div>
        </>
    );
}
export async function getStaticProps(){
    const blogPosts = readdirSync("./posts").map((file) => {
        const content = readFileSync(`./posts/${file}`,"utf-8");
        const [slug,_] = file.split(".");
        return {...matter(content).data, slug}
    });
    return{
        props : {
            posts : JSON.parse(JSON.stringify(blogPosts)),
        }
    }
}
export default Blog;
