import type {
    PredictionTableProps,
    ModelRow
} from "../../types/Prediction";


function formatConfidence(
    value: number | null | undefined
): string {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    return `${(
        value * 100
    ).toFixed(1)} %`;
}


export default function PredictionTable({
    predictions,
    sampleIds
}: PredictionTableProps) {

    const models = new Map<
        string,
        ModelRow
    >();

    for (const prediction of predictions) {

        let row = models.get(
            prediction.training_run_id
        );

        if (!row) {
            row = {
                trainingRunId:
                    prediction.training_run_id,

                modelName:
                    prediction.model_name ??
                    prediction.training_run_id,

                predictions: {}
            };

            models.set(
                prediction.training_run_id,
                row
            );
        }

        row.predictions[
            prediction.sample_id
        ] = prediction;
    }

    const rows = Array.from(
        models.values()
    );

    if (rows.length === 0) {
        return (
            <div>
                Нет результатов Prediction
            </div>
        );
    }

    return (
        <div style={{ overflowX: "auto" }}>

            <h2>Результаты предсказания</h2>

            <table>
                <thead>
                    <tr>
                        <th>Модель</th>

                        {sampleIds.map(
                            sampleId => (
                                <th
                                    key={sampleId}
                                >
                                    {sampleId}
                                </th>
                            )
                        )}
                    </tr>
                </thead>

                <tbody>

                    {rows.map(row => (
                        <tr
                            key={
                                row.trainingRunId
                            }
                        >

                            <td>
                                <strong>
                                    {row.modelName}
                                </strong>
                            </td>

                            {sampleIds.map(
                                sampleId => {

                                    const prediction =
                                        row.predictions[
                                            sampleId
                                        ];

                                    if (!prediction) {
                                        return (
                                            <td
                                                key={
                                                    sampleId
                                                }
                                            >
                                                —
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={
                                                sampleId
                                            }
                                        >
                                            <div>
                                                <strong>
                                                    {
                                                        prediction.predicted_class
                                                    }
                                                </strong>
                                            </div>

                                            <small>
                                                {formatConfidence(
                                                    prediction.confidence
                                                )}
                                            </small>
                                        </td>
                                    );
                                }
                            )}

                        </tr>
                    ))}

                </tbody>
            </table>

        </div>
    );
}