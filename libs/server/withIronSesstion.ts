import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"

declare module "iron-session" {
    interface IronSessionData {
        user : {
            id : number;
        }
    }
}

const Cookies = {
    cookieName: "Seestion_cookies",
    password: process.env.IRON_SESSTION_TOKEN!,
}
export function ApiSesstion(handler : any){
    return withIronSessionApiRoute(handler,Cookies);
}
export function ServerSideSesstion(fn : any){
    return withIronSessionSsr(fn,Cookies);
}
