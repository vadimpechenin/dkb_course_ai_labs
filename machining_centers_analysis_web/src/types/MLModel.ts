export interface MLModel {

    id: string;

    name: string;

    description?: string | null;

    framework?: string | null;

    model_type?: string | null;

    task_type?: string | null;

    active: boolean;
}