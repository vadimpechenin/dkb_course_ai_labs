export interface Feature {

    id: string;

    feature_name: string;

    display_name?: string | null;

    description?: string | null;

    data_type?: string | null;

    enabled: boolean;

    feature_order?: number | null;

    channel?: string | null;

    unit?: string | null;
}


export interface FeaturesResponse {

    features: Feature[];
}