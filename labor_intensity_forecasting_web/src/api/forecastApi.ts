import api from "../services/axios";

import type {
    ForecastInput,
    ForecastResult
} from "../types/Forecast";


/**
 * Расчет трудоемкости операций.
 *
 * POST /forecast
 */
export async function forecast(
    data: ForecastInput[]
): Promise<ForecastResult[]> {

    const response = await api.post<ForecastResult[]>(
        "/forecast",
        data
    );

    return response.data;
}