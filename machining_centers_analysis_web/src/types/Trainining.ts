export interface TrainingRequest {

    dataset_id: string;

    feature_ids: string[];

    model_ids: string[];

    test_size: number;

    random_state: number;

    scaler: string;
}


export interface TrainingRun {

    id: string;

    model_id: string;

    model_name: string;

    dataset_id: string;

    dataset_size: number;

    accuracy?: number | null;

    precision_weighted?: number | null;

    recall_weighted?: number | null;

    f1_weighted?: number | null;

    cv_score?: number | null;

    training_time?: number | null;

    created_at?: string | null;
}


export interface TrainingResponse {

    training_runs: TrainingRun[];
}
