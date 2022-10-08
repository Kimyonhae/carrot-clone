import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import Uservertify from '@components/useUser';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{fetcher : (url : string) => 
      fetch(url).then((response) => response.json())
    }}>
    <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
