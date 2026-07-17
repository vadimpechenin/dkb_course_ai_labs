import api from "../services/axios";
import type {Dashboard} from "../types/Dashboard";

export const getDashboard=async()=>{
    //console.log("Отправлен запрос")
    const response=await api.get<Dashboard>("/dashboard");
    //console.log("Получен ответ")
    //console.log(JSON.stringify(response.data, null, 2));
    return response.data;

}