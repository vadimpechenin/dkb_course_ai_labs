export interface Dataset {
    id: string;
    name: string;
    description?: string | null;
    source_type?: string | null;
    source_name?: string | null;
    samples_count: number;
    tools_count: number;
}


export interface DatasetsResponse {
    datasets: Dataset[];
}