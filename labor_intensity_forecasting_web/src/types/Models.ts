export interface MLModel {

    id: string;

    name: string;

    description: string | null;

    framework: string | null;

    active: boolean;
}


export interface TrainingRun {

    id: string;

    model_id: string;

    model_name?: string;

    dataset_size: number;

    training_config: Record<string, unknown>;

    mae: number | null;

    rmse: number | null;

    r2: number | null;

    training_time: number | null;

    is_active: boolean;

    created_at: string;
}


export interface Experiment {

    id: string;

    model_id: string;

    model_name?: string;

    dataset_size: number;

    training_config: Record<string, unknown>;

    mae: number | null;

    rmse: number | null;

    r2: number | null;

    training_time: number | null;

    is_active: boolean;

    created_at: string;

    model_files?: ModelFile[];
}


export interface ModelFile {

    id: string;

    training_run_id: string;

    model_id: string;

    version: string | null;

    weights_path: string | null;

    scaler_path: string | null;

    encoder_path: string | null;

    feature_list_path: string | null;

    created_at: string;
}