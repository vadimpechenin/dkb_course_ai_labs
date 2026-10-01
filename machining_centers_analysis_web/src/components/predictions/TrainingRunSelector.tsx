import type {
    TrainingRunSelectorProps
} from "../../types/Training";


export default function TrainingRunSelector({
    trainingRuns,
    selectedIds,
    onChange
}: TrainingRunSelectorProps) {

    function toggleTrainingRun(id: string) {

        if (selectedIds.includes(id)) {
            onChange(
                selectedIds.filter(
                    selectedId => selectedId !== id
                )
            );

            return;
        }

        onChange([
            ...selectedIds,
            id
        ]);
    }

    return (
        <div>
            <h2>Обученные модели</h2>

            {trainingRuns.length === 0 && (
                <div>
                    Нет обученных моделей
                </div>
            )}

            {trainingRuns.map(run => (
                <label
                    key={run.id}
                    style={{
                        display: "block",
                        marginBottom: "8px"
                    }}
                >
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(
                            run.id
                        )}
                        onChange={() =>
                            toggleTrainingRun(run.id)
                        }
                    />

                    {" "}

                    <strong>
                        {run.model_name ?? run.model_id}
                    </strong>

                    {" — "}

                    {run.dataset_name ?? run.dataset_id}

                    {" — Accuracy: "}

                    {run.accuracy !== null &&
                    run.accuracy !== undefined
                        ? `${(
                            run.accuracy * 100
                        ).toFixed(2)} %`
                        : "—"}

                    {" — "}

                    {run.created_at
                        ? new Date(
                            run.created_at
                        ).toLocaleString("ru-RU")
                        : "—"}
                </label>
            ))}
        </div>
    );
}