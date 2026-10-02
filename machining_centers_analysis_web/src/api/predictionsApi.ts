import api from "../services/axios";

import type {
    PredictionBatch
} from "../types/Prediction";


export async function createPredictions(
    trainingRunIds: string[],
    file: File
): Promise<PredictionBatch> {

    const formData = new FormData();

    for (
        const trainingRunId
        of trainingRunIds
    ) {

        formData.append(
            "training_run_ids",
            trainingRunId
        );
    }

    formData.append(
        "file",
        file
    );

    const response =
        await api.post<PredictionBatch>(
            "/predictions",
            formData
        );

    return response.data;
}


export async function getPredictions(
    predictionId: string
): Promise<PredictionBatch> {

    const response =
        await api.get<PredictionBatch>(
            `/predictions/${predictionId}`
        );

    return response.data;
}