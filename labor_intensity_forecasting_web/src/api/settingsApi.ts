import api from "../services/axios";

import type {
    Settings,
    HealthStatus
} from "../types/Settings";


/**
 * Получить настройки приложения.
 *
 * GET /settings
 */
export async function getSettings(): Promise<Settings> {

    const response = await api.get<Settings>("/settings");

    return response.data;
}


/**
 * Проверить состояние сервиса.
 *
 * GET /settings/health
 */
export async function getHealth(): Promise<HealthStatus> {

    const response = await api.get<HealthStatus>(
        "/settings/health"
    );

    return response.data;
}