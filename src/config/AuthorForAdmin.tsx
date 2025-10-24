import axios from "axios";
import { createContext } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";
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
            toast.success(reponse.data.message);
            localStorage.setItem("AdminToken",reponse.data.token);
            console.log(reponse.data);
            
        } catch (error) {
            console.log("Lỗi đăng nhập admin:", error);
        }

    }
    return (
        <AuthorForAdminContext.Provider value={{Login}}>
            {children}
        </AuthorForAdminContext.Provider>
    );
}