export interface TrainingRequest {
    model_id: string;
    train_percent: number;
    test_percent: number;
}


export interface TrainingResponse {

    success: boolean;

    message?: string;

    training_run_id?: string;

    mae?: number;

    rmse?: number;

    r2?: number;
}