import api from "../services/axios";

export interface MLModel {
    id: string;
    name: string;
    description?: string;
    framework?: string;
    active?: boolean;
}

export async function getModels(): Promise<MLModel[]> {

    const response = await api.get<MLModel[]>("/models");

    return response.data;
}