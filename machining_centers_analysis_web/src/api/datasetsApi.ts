import api from "../services/axios";

export interface Dataset {
    id: string;
    name: string;
}


export const getDatasets = async (): Promise<Dataset[]> => {

    const response = await api.get<Dataset[]>(
        "/datasets"
    );

    return response.data;
};