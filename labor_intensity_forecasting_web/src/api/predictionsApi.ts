import api from "../services/axios";

import type {
    Prediction,
    PredictionHistory
} from "../types/Prediction";


/**
 * Получение истории прогнозов.
 */
export async function getPredictionHistory():
    Promise<Prediction[]> {

    const response =
        await api.get<
            Prediction[] |
            PredictionHistory
            >(
            "/predictions/history"
        );

    console.log(
        "GET /predictions/history:",
        response.data
    );

    /*
     * Поддерживаем оба варианта ответа:
     *
     * 1. [
     *      {...},
     *      {...}
     *    ]
     *
     * 2. {
     *      items: [...]
     *    }
     */

    if (Array.isArray(response.data)) {

        return response.data;

    }

    return response.data.items;
}


/**
 * Экспорт истории прогнозов.
 *
 * POST /predictions/dump
 */
export async function dumpPredictions():
    Promise<Blob> {

    const response =
        await api.post(
            "/predictions/dump",
            null,
            {
                responseType: "blob"
            }
        );

    return response.data;
}