import api from "../services/axios";


import type {
    PredictionBatch,
    PredictionRequest
} from "../types/Prediction";
import type {TrainingResponse, TrainingRunDetail} from "../types/Training.ts";


export async function createPredictions(
    request: PredictionRequest
): Promise<PredictionBatch> {

    const response = await api.post<PredictionBatch>(
        "/predictions",
        request
    );

    return response.data;
}


export async function getPredictions(
    predictionId: string
): Promise<PredictionBatch> {

    const response = await api.get<PredictionBatch>(
        `/predictions/${predictionId}`
    );

    return response.data;
}