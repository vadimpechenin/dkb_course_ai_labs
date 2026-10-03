export interface PredictionItem {

    id: string;

    training_run_id: string;

    model_name?: string | null;

    sample_id: string;

    actual_wear?: number | null;

    actual_class?: string | null;

    predicted_class?: string | null;

    confidence?: number | null;

    probabilities?:
        Record<string, number>
        | null;
}


export interface PredictionBatch {

    id: string;

    created_at?: string | null;

    training_run_ids: string[];

    sample_ids: string[];

    predictions: PredictionItem[];
}

export interface PredictionTableProps {
    predictions: PredictionItem[];
    sampleIds: string[];
}

export interface ModelRow {
    trainingRunId: string;
    modelName: string;
    predictions: Record<
        string,
        PredictionItem
    >;
}

export interface DeleteTrainingRunsResponse {
    deleted_training_run_ids: string[];
    deleted_model_files: number;
    deleted_model_directories: string[];
    file_errors: {
        directory: string;
        error: string;
    }[];
}

export interface PredictionHistoryItem {
    id: string;
    created_at: string | null;
    training_run_ids: string[];
    model_names: string[];
    sample_count: number;
}

export interface PredictionHistoryResponse {
    items: PredictionHistoryItem[];
}