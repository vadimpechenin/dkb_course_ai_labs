import api from "../services/axios";

import type {
    DatasetsResponse,
} from "../types/Dataset";


export const getDatasets = async (): Promise<DatasetsResponse> => {

    const response = await api.get<DatasetsResponse>(
        "/datasets"
    );
    //console.log("Получен ответ")
    //console.log(JSON.stringify(response.data, null, 2));
    return response.data;
};