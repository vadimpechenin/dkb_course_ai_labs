import api from "../services/axios";

import type {
    DatasetInfo,
    Feature,
    OperationsResponse,
    SaveFeaturesRequest,
    SaveFeaturesResponse
} from "../types/Dataset";


/**
 * GET /dataset
 */
export async function getDataset(): Promise<DatasetInfo> {

    const response =
        await api.get<DatasetInfo>("/dataset");
    //console.log(response.data)
    return response.data;
}


/**
 * GET /dataset/features
 */
export async function getFeatures(): Promise<Feature[]> {

    const response =
        await api.get<Feature[]>("/dataset/features");

    return response.data;
}


/**
 * POST /dataset/features
 */
export async function saveFeatures(
    data: SaveFeaturesRequest
): Promise<SaveFeaturesResponse> {

    const response =
        await api.post<SaveFeaturesResponse>(
            "/dataset/features",
            data
        );

    return response.data;
}


/**
 * GET /dataset/operations
 */
export async function getOperations(
    page: number = 1,
    size: number = 20
): Promise<OperationsResponse> {

    const response =
        await api.get<OperationsResponse>(
            "/dataset/operations",
            {
                params: {
                    page,
                    size
                }
            }
        );

    return response.data;
}


/**
 * POST /dataset/operations/import-csv
 */
export async function importOperationsCsv(
    file: File
): Promise<boolean> {

    const formData = new FormData();

    formData.append("file", file);

    const response =
        await api.post<boolean>(
            "/dataset/operations/import-csv",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

    return response.data;
}