import axios from "axios";
export const api_Response=async<T>(url:string,method:'GET'|'POST'|'PUT'|'DELETE',data?:any,headers?:any):Promise<T>=>{
    try {
        let response;
        switch (method) {
            case 'GET':
                response=await axios.get(url,{headers,withCredentials:true});
                break;
            case 'POST':
                response=await axios.post(url,data,{headers,withCredentials:true});
                break;
            case 'PUT':
                response=await axios.put(url,data,{headers,withCredentials:true});
                break;
            case 'DELETE':
                response=await axios.delete(url,{headers,withCredentials:true});
                break;
        }
        return response.data;
    } catch (error) {
        throw error;
    }   
}