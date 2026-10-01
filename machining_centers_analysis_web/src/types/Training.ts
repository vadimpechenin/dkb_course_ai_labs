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


export interface TrainingRunDetail {
    id: string;

    model_id: string;
    model_name?: string | null;

    dataset_id: string;
    dataset_name?: string | null;

    dataset_size: number;

    accuracy?: number | null;
    precision_weighted?: number | null;
    recall_weighted?: number | null;
    f1_weighted?: number | null;
    cv_score?: number | null;

    training_time?: number | null;

    is_active: boolean;

    training_config: Record<string, unknown>;

    model_files: ModelFileInfo[];

    created_at?: string | null;
}


export interface ModelFileInfo {
    id: string;
    model_id: string;
    version?: string | null;

    has_weights: boolean;
    has_scaler: boolean;
    has_feature_list: boolean;
    has_metadata: boolean;

    created_at?: string | null;
}

export interface TrainingRunListItem {
    id: string;
    model_id: string;
    model_name?: string | null;
    dataset_id: string;
    dataset_name?: string | null;
    dataset_size: number;

    accuracy?: number | null;
    precision_weighted?: number | null;
    recall_weighted?: number | null;
    f1_weighted?: number | null;

    training_time?: number | null;
    created_at?: string | null;
}

export interface TrainingRunSelectorProps {
    trainingRuns: TrainingRunListItem[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}