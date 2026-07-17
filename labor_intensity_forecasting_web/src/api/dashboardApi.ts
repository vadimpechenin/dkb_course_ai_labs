import api from "../services/axios";
import type {Dashboard} from "../types/Dashboard";

export const getDashboard=async()=>{

    const response=await api.get<Dashboard>("/dashboard");

    return response.data;

}