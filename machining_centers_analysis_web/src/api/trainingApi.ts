import api from "../services/axios";


import type {
    TrainingRequest,
    TrainingRun,
    TrainingResponse
} from "../types/Training";

export const startTraining = async (
    request: TrainingRequest
) => {

    const response =
        await api.post<TrainingResponse>(
            "/training",
            request
        );
    console.log("Получен ответ")
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
};


export const getTrainingRuns = async () => {

    const response =
        await api.get<TrainingResponse>(
            "/training"
        );

    return response.data.training_runs;
};


export const getTrainingRun = async (
    id: string
) => {

    const response =
        await api.get<TrainingRun>(
            `/training/${id}`
        );

    return response.data;
};