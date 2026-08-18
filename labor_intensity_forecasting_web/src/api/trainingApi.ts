import api from "../services/axios";

import type {
    TrainingRequest,
    TrainingResponse
} from "../types/Training";


/**
 * Переобучение модели.
 *
 * POST /retrain
 */
export async function retrain(
    data: TrainingRequest
): Promise<TrainingResponse> {

    const response =
        await api.post<TrainingResponse>(
            "/retrain",
            data
        );

    return response.data;
}


/**
 * Возврат предыдущей версии модели.
 *
 * POST /rollback
 */
export async function rollback(): Promise<boolean> {

    const response =
        await api.post<boolean>(
            "/rollback"
        );

    return response.data;
}


/**
 * Экспорт модели.
 *
 * POST /export
 */
export async function exportModel(): Promise<Blob> {

    const response =
        await api.post(
            "/export",
            {},
            {
                responseType: "blob"
            }
        );

    return response.data;
}


/**
 * Импорт модели.
 *
 * POST /import
 */
export async function importModel(
    file: File
): Promise<boolean> {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await api.post<boolean>(
            "/import",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
}