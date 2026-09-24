import api from "../services/axios";


export interface Prediction {
    id: string;
    predicted_class: number;
}


export const getPredictions = async (): Promise<Prediction[]> => {

    const response = await api.get<Prediction[]>(
        "/predictions"
    );

    return response.data;
};