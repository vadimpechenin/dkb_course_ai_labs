import api from "../services/axios";


import type {
    Feature,
    FeaturesResponse
} from "../types/Feature";


export const getFeatures = async (): Promise<Feature[]> => {

    const response = await api.get<FeaturesResponse>(
        "/features"
    );

    return response.data.features;
};

export const getFeature = async (
    featureId: string
): Promise<Feature> => {

    const response =
        await api.get<Feature>(
            `/features/${featureId}`
        );

    return response.data;
};