import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { useNavigate } from "react-router-dom";
 
type AuthorForAdminType = {
    Login: (Email:string,Password:string) => Promise<void>;
    errorMessages: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
export const AuthorForAdminContext = createContext<AuthorForAdminType>({
    Login: async() => { },
    errorMessages: "",
    setErrorMessage: () => {},
});
export const AuthorForAdminProvider = ({children}:{children:React.ReactNode}) => {
    const navigate=useNavigate();
    const [errorMessages,setErrorMessage]=useState<string>("");
    const Login=async(Email:string,Password:string)=>{
        try {
            const reponse=await axios.post(UseApiUrl(api_Config.Admin.LoginAdmin),{
                Email,Password
            },{headers:{"Content-Type":"application/json"}});
            localStorage.setItem("AdminToken",reponse.data.token);
            navigate("/Admin");
            Toaster.success("Đăng nhập thành công");
        } catch (error:any) {
              setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
        }

    }
    useEffect(() => {
        const token = localStorage.getItem("AdminToken");
        if (token) {
            navigate("/Admin");
        }
    }, [navigate]);
    return (
        <AuthorForAdminContext.Provider value={{Login,errorMessages,setErrorMessage}}>
            {children}
        </AuthorForAdminContext.Provider>
    );
}