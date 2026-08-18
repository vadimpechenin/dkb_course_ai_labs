import api from "../services/axios";

export interface Feature {
    id: string;
    feature_name: string;
    display_name?: string;
    enabled: boolean;
    feature_order?: number;
}

export async function getFeatures(): Promise<Feature[]> {

    const response =
        await api.get<Feature[]>("/dataset/features");

    return response.data;
}