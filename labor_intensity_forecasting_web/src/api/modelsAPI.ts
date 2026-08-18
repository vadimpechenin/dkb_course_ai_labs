import api from "../services/axios";

import type {
    MLModel,
    TrainingRun,
    Experiment
} from "../types/Models";


/**
 * GET /models
 */
export async function getModels(): Promise<MLModel[]> {

    const response =
        await api.get<MLModel[]>(
            "/models"
        );

    return response.data;
}


/**
 * GET /models/active
 */
export async function getActiveModel(): Promise<MLModel> {

    const response =
        await api.get<MLModel>(
            "/models/active"
        );

    return response.data;
}


/**
 * POST /models/{model_id}/activate
 */
export async function activateModel(
    modelId: string
): Promise<boolean> {

    const response =
        await api.post<boolean>(
            `/models/${modelId}/activate`
        );

    return response.data;
}


/**
 * GET /models/training-runs
 */
export async function getTrainingRuns(): Promise<TrainingRun[]> {

    const response =
        await api.get<TrainingRun[]>(
            "/models/training-runs"
        );

    return response.data;
}


/**
 * GET /models/experiments/{training_run_id}
 */
export async function getExperiment(
    trainingRunId: string
): Promise<Experiment> {

    const response =
        await api.get<Experiment>(
            `/models/experiments/${trainingRunId}`
        );

    return response.data;
}