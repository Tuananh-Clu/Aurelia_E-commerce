import axios from "axios";
import { createContext } from "react";
import { api_Config, UseApiUrl } from "../types/api";
 
type AuthorForAdminType = {
    Login: (Email:string,Password:string) => Promise<void>;
}
export const AuthorForAdminContext = createContext<AuthorForAdminType>({
    Login: async() => { },
});
export const AuthorForAdminProvider = ({children}:{children:React.ReactNode}) => {
    const Login=async(Email:string,Password:string)=>{
        try {
            const reponse=await axios.post(UseApiUrl(api_Config.Admin.LoginAdmin),{
                Email,Password
            },{headers:{"Content-Type":"application/json"}});
            localStorage.setItem("AdminToken",reponse.data.token);
            
            
        } catch (error) {
            
        }

    }
    return (
        <AuthorForAdminContext.Provider value={{Login}}>
            {children}
        </AuthorForAdminContext.Provider>
    );
}