export interface ForecastInput {
    detail_mass: number | null;
    blank_length: number | null;

    work_center: string;
    operation: string;
    material: string;
    nomenclature: string;
    note: string;

    user_name: string;
    fill_date: string | null;

    row_number: number | null;
}

export interface ForecastResult {
    forecast: number;
    std: number;
}