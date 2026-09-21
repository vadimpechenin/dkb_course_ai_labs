export interface DashboardStatistics {
    datasets_count: number;
    experiments_count: number;
    signal_samples_count: number;
    feature_vectors_count: number;
    features_count: number;
    ml_models_count: number;
    training_runs_count: number;
    predictions_count: number;
}

export interface DashboardModel {
    id: string;
    name: string;
    model_type: string;
    framework?: string;
    task_type?: string;
    active: boolean;
}

export interface DashboardLastTraining {
    id: string;
    model_name: string;
    dataset_id: string;
    dataset_size: number;

    accuracy?: number;
    f1_weighted?: number;
    precision_weighted?: number;
    recall_weighted?: number;
    cv_score?: number;

    training_time?: number;
    created_at?: string;
}

export interface Dashboard {
    statistics: DashboardStatistics;
    active_models: DashboardModel[];
    last_training?: DashboardLastTraining | null;
}