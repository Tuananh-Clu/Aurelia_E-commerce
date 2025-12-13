import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Author";

type AuthorForAdminType = {
    Login: (Email:string,Password:string) => Promise<void>;
    errorMessages: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    isAdminSigned?:boolean;
    adminData?:any;
}
export const AuthorForAdminContext = createContext<AuthorForAdminType>({
    Login: async() => { },
    errorMessages: "",
    setErrorMessage: () => {},
    isAdminSigned: false,
    adminData: null,
});
export const AuthorForAdminProvider = ({children}:{children:React.ReactNode}) => {
    const navigate=useNavigate();
    const [errorMessages,setErrorMessage]=useState<string>("");
    const [isAdminSigned,setIsAdminSigned]=useState<boolean>(false);
    const {fetchData}=useContext(AuthContext);
    const [adminData, setAdminData] = useState<any>(null);
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
        const data = fetchData({type: "admin"});
        setAdminData(data);
        if(data as object !== null){
            setIsAdminSigned(true);
        }
    }, [navigate]);
    return (
        <AuthorForAdminContext.Provider value={{Login,errorMessages,setErrorMessage ,isAdminSigned,adminData}}>
            {children}
        </AuthorForAdminContext.Provider>
    );
}