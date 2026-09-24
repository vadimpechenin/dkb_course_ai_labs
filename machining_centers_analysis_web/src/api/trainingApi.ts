import api from "../services/axios";


export interface TrainingPageData {
    datasets: unknown[];
    features: unknown[];
    models: unknown[];
}


export const getTraining = async (): Promise<TrainingPageData> => {

    const response = await api.get<TrainingPageData>(
        "/training"
    );

    return response.data;
};