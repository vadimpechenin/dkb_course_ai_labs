import api from "../services/axios";

import type {
    PredictionBatch,
    DeleteTrainingRunsResponse, PredictionHistoryItem, PredictionHistoryResponse
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

export async function deleteTrainingRuns(
    trainingRunIds: string[]
): Promise<DeleteTrainingRunsResponse> {

    const response =
        await api.delete<DeleteTrainingRunsResponse>(
            "/predictions/training-runs",
            {
                data: {
                    training_run_ids:
                    trainingRunIds
                }
            }
        );

    return response.data;
}

export async function getPredictionHistory(
    trainingRunIds: string[] = []
): Promise<PredictionHistoryItem[]> {
    console.log("Отправка запроса на историю")
    //console.log(JSON.stringify(response.data, null, 2));
    const params = new URLSearchParams();

    for (
        const trainingRunId
        of trainingRunIds
        ) {
        params.append(
            "training_run_ids",
            trainingRunId
        );
    }
    console.log(params)
    const response =
        await api.get<PredictionHistoryResponse>(
            "/predictions/history",
            {
                params
            }
        );

    return response.data.items;
}

export async function getPredictionHistoryItem(
    batchId: string
): Promise<PredictionBatch> {

    const response =
        await api.get<PredictionBatch>(
            `/predictions/history/${batchId}`
        );

    return response.data;
}

export async function deletePredictionHistoryItem(
    batchId: string
): Promise<void> {

    await api.delete(
        `/predictions/history/${batchId}`
    );
}