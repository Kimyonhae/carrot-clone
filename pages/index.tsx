import Link from 'next/link'
import { TabBar } from '@components/tabBar'
import TabMenu from '@components/tabMenu'
import Uservertify from '@components/useUser'
import useSWR, { SWRConfig } from 'swr';
import { Product } from 'prisma/prisma-client';
import Cls from '@components/Cls';
import Image from 'next/image';
import Head from 'next/head';
import client from '@libs/client/client';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ProductsWithUser extends Product{
  user : {
    name : string;
    avatar : string;
  };
  _count : {
    Favs : number;
  };
}

interface SWRProductsProps {
  ok : boolean;
  products : ProductsWithUser[];
}
const Home : NextPage = () => {
  const {user} = Uservertify();
  const {data} = useSWR<SWRProductsProps>(`/api/products/`);
  const router = useRouter();
  useEffect(() => {
    if(!data && !user)
    {
      router.replace("/auth");
    }
  },[data,router])
  return (
    <>
    <div>
      <Head>
        <title>Home</title>
      </Head>
    </div>
      <div className='object-contain mb-20'>
        <header className="flex rounded-b-md shadow-md h-20 text-white px-6 bg-black justify-between items-center">
          <div>
            <Link href='/'>
            <svg className='text-white w-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path fill='currentColor' width={30} d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8V128h-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48V352h28.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM96 128H0V352c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V128zM48 352c-8.8 0-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16zM544 128V352c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V128H544zm64 208c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16z"/>
              </svg>
            </Link>
          </div>
          <div>
            <Link href={"/blog"}>
              Blog
            </Link>
          </div>
        </header>
        <div className='mx-2 lg:grid lg:grid-cols-2 lg:gap-x-2'>
          {data?.products?.map((product) => (
            <Link href={`/food/${product.id}`} key={product.id}>
            <div 
            className=' mt-2 bg-black relative px-4 flex justify-around items-center sm:aspect-video' 
            key={product.id}>
                {product.fileUrl ? 
                <img src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${product.fileUrl}/public`} className='bg-white w-[50%] rounded-md shadow-sm aspect-square'/> 
                : <div className='bg-white w-[50%] rounded-md shadow-sm aspect-square'/>}
                <div className='bg-white ml-2 w-[50%] rounded-md shadow-sm aspect-square'>
                  {product.user.avatar ? 
                  <div className='h-12 w-12 bg-black absolute top-5 right-0 rounded-full'>
                    <Image layout='fill' className='rounded-full' src={`https://imagedelivery.net/OhOI4KRqTO8dfof0tI_e9Q/${product.user.avatar}/public`} 
                    />
                  </div> 
                  : <div className='h-12 w-12 bg-black absolute top-5 right-0 rounded-full'/>}
                  <div className='flex pl-4 lg:pl-8 lg:spave-y-10 flex-col font-semibold 2xl:space-y-16 sm:space-y-8 md:space-y-10 h-full justify-center'>
                    <h3>가게 이름 : {product.storeName}</h3>
                    <span>평가 : {`10점 만점의 ${product.flavor}점`}</span>
                    <p>주소 : {product.adress}</p>
                    <span className='font-light'>{product.createAt.toString()}</span>
                    <div className='flex items-center justify-between'>
                      <span>
                          {`작성자 : ${product.user.name}`}
                      </span>
                    <div className='flex items-center mr-2'>
                      <svg 
                      className={Cls("w-10 rounded-md p-2 text-red-500")}
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path 
                      width={30}
                      fill="currentColor"
                      d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/>
                      </svg>
                      <span className='text-black'>{product._count.Favs}</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
      <TabMenu/>
        <div className='w-[48px] h-[48px] cursor-pointer rounded-full bg-black fixed bottom-40 flex items-center justify-center right-5'>
          <TabBar path='/food/upload' viewBox='0 0 512 512' d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z'/>
        </div>
  </>
  )
}
export const Page : NextPage<{products : ProductsWithUser[]}> = ({products}) => {
  return(
    <SWRConfig value={{
      fallback : {
        "api/products/" : {
          ok : true,
          products,
        }
      }
    }}>
        <Home />
    </SWRConfig>
  );
}
export async function getServerSideProps(){
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
  return{
      props : {
        products : JSON.parse(JSON.stringify(products)),
      },
    }
}
export default Page;