export interface Prediction {

    id: string;

    training_run_id: string;

    forecast: number;

    std: number;

    created_at: string;
}


export interface PredictionHistory {

    items: Prediction[];

    total: number;

    page?: number;

    size?: number;
}