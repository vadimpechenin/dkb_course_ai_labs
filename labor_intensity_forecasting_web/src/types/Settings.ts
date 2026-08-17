export interface Settings {
    [key: string]: unknown;
}

export interface HealthStatus {
    status: string;
    database: string;
    message?: string;
}