import api from "../services/axios";


export interface Feature {
    id: string;
    feature_name: string;
    display_name: string;
}


export const getFeatures = async (): Promise<Feature[]> => {

    const response = await api.get<Feature[]>(
        "/features"
    );

    return response.data;
};