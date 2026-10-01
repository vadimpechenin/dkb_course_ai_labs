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

export interface Sample {
    id: string;
    sample_number?: number | null;
    tool_id: string;
}

export interface SampleSelectorProps {
    samples: Sample[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}