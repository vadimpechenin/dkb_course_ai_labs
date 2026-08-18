export interface TrainingRequest {
    model_id: string;
    train_percent: number;
    test_percent: number;
    dataset_size: number;

    features: string[];

    model_params: Record<string, any>;
}


export interface TrainingResponse {

    success: boolean;

    message?: string;

    training_run_id: string;

    metrics?: {

        mae?: number;

        rmse?: number;

        r2?: number;

    };

}