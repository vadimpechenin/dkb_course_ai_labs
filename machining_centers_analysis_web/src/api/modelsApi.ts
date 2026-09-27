import api from "../services/axios";


import type {
    MLModel
} from "../types/MLModel";


export interface ModelsResponse {

    models: MLModel[];
}


export const getModels = async () => {

    const response =
        await api.get<ModelsResponse>(
            "/models"
        );

    return response.data.models;
};


export const getModel = async (
    id: string
) => {

    const response =
        await api.get<MLModel>(
            `/models/${id}`
        );

    return response.data;
};