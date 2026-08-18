export interface DatasetInfo {
    dataset_size: number;
    features_count?: number;
    enabled_features_count: number;
    target_column?: string;
}

export interface Feature {
    id: string;
    feature_name: string;
    display_name: string;
    enabled: boolean;
    feature_order: number;
}

export interface Operation {
    id: string;

    nomenclature: string | null;
    work_center: string | null;
    operation: string | null;
    material: string | null;

    detail_mass: number | null;
    blank_length: number | null;

    note: string | null;

    user_name: string | null;

    fill_date: string | null;

    row_number: number | null;

    target_hours: number | null;
}

export interface OperationsResponse {
    items: Operation[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface SaveFeaturesRequest {
    features: string[];
}

export interface SaveFeaturesResponse {
    success: boolean;
    message?: string;
}