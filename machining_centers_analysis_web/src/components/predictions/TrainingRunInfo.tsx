import type { TrainingRunDetail } from "../../api/training";

interface TrainingRunInfoProps {
    trainingRun: TrainingRunDetail;
}

function formatPercent(
    value: number | null | undefined
): string {
    if (value === null || value === undefined) {
        return "—";
    }

    return `${(value * 100).toFixed(2)} %`;
}

function formatTime(
    value: number | null | undefined
): string {
    if (value === null || value === undefined) {
        return "—";
    }

    return `${value.toFixed(3)} с`;
}

export default function TrainingRunInfo({
    trainingRun
}: TrainingRunInfoProps) {

    return (
        <div>
            <h2>Обученная модель</h2>

            <div>
                <strong>Модель:</strong>{" "}
                {trainingRun.model_name ?? trainingRun.model_id}
            </div>

            <div>
                <strong>Датасет:</strong>{" "}
                {trainingRun.dataset_name ?? trainingRun.dataset_id}
            </div>

            <div>
                <strong>Размер датасета:</strong>{" "}
                {trainingRun.dataset_size}
            </div>

            <div>
                <strong>Дата обучения:</strong>{" "}
                {trainingRun.created_at
                    ? new Date(
                        trainingRun.created_at
                    ).toLocaleString("ru-RU")
                    : "—"}
            </div>

            <h3>Качество на тесте</h3>

            <table>
                <thead>
                    <tr>
                        <th>Метрика</th>
                        <th>Значение</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Accuracy</td>
                        <td>
                            {formatPercent(
                                trainingRun.accuracy
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Precision</td>
                        <td>
                            {formatPercent(
                                trainingRun.precision_weighted
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Recall</td>
                        <td>
                            {formatPercent(
                                trainingRun.recall_weighted
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>F1</td>
                        <td>
                            {formatPercent(
                                trainingRun.f1_weighted
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>CV score</td>
                        <td>
                            {formatPercent(
                                trainingRun.cv_score
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Время обучения</td>
                        <td>
                            {formatTime(
                                trainingRun.training_time
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Конфигурация обучения</h3>

            <pre>
                {JSON.stringify(
                    trainingRun.training_config,
                    null,
                    2
                )}
            </pre>

            <h3>Файлы модели</h3>

            {(trainingRun.model_files ?? []).map(
                (file) => (
                    <div key={file.id}>
                        <strong>
                            Версия:
                        </strong>{" "}
                        {file.version ?? "—"}

                        <div>
                            Веса:{" "}
                            {file.has_weights
                                ? "✓"
                                : "—"}
                        </div>

                        <div>
                            Scaler:{" "}
                            {file.has_scaler
                                ? "✓"
                                : "—"}
                        </div>

                        <div>
                            Список признаков:{" "}
                            {file.has_feature_list
                                ? "✓"
                                : "—"}
                        </div>

                        <div>
                            Metadata:{" "}
                            {file.has_metadata
                                ? "✓"
                                : "—"}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}