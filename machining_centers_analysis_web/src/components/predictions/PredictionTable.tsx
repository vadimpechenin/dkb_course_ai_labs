import type {
    PredictionItem
} from "../../types/Prediction";


interface PredictionTableProps {

    predictions: PredictionItem[];

    sampleIds: string[];
}


interface ModelInfo {

    trainingRunId: string;

    modelName: string;
}


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


function formatWear(
    value: number | null | undefined
): string {

    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    return value.toFixed(4);
}


export default function PredictionTable({
    predictions,
    sampleIds
}: PredictionTableProps) {


    /*
     * Список моделей.
     */
    const models =
        new Map<
            string,
            ModelInfo
        >();


    /*
     * predictionMap:
     *
     * sample_id
     *      ↓
     * training_run_id
     *      ↓
     * PredictionItem
     */
    const predictionMap =
        new Map<
            string,
            Map<
                string,
                PredictionItem
            >
        >();


    for (
        const prediction
        of predictions
    ) {


        /*
         * Добавляем модель.
         */
        if (
            !models.has(
                prediction.training_run_id
            )
        ) {

            models.set(
                prediction.training_run_id,
                {
                    trainingRunId:
                        prediction.training_run_id,

                    modelName:
                        prediction.model_name
                        ??
                        prediction.training_run_id
                }
            );
        }


        /*
         * Добавляем Prediction
         * в соответствующий sample.
         */
        if (
            !predictionMap.has(
                prediction.sample_id
            )
        ) {

            predictionMap.set(
                prediction.sample_id,
                new Map()
            );
        }


        predictionMap
            .get(
                prediction.sample_id
            )!
            .set(
                prediction.training_run_id,
                prediction
            );
    }


    const modelList =
        Array.from(
            models.values()
        );


    if (
        sampleIds.length === 0 ||
        modelList.length === 0
    ) {

        return (
            <div>
                Нет результатов Prediction.
            </div>
        );
    }


    return (

        <div
            style={{
                overflowX: "auto"
            }}
        >

            <h2>
                Результаты Prediction
            </h2>


            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%"
                }}
            >

                <thead>

                    <tr>

                        <th
                            style={{
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Образец
                        </th>


                        <th
                            style={{
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Фактический износ
                        </th>


                        <th
                            style={{
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Факт. класс
                        </th>


                        {modelList.map(
                            model => (

                                <th
                                    key={
                                        model.trainingRunId
                                    }
                                    style={{
                                        padding: "8px",
                                        textAlign: "left"
                                    }}
                                >
                                    {
                                        model.modelName
                                    }
                                </th>

                            )
                        )}

                    </tr>

                </thead>


                <tbody>

                    {sampleIds.map(
                        sampleId => {

                            const row =
                                predictionMap.get(
                                    sampleId
                                );


                            /*
                             * Берём первый Prediction
                             * только для actual_wear /
                             * actual_class.
                             *
                             * Они одинаковы для всех
                             * моделей одного sample.
                             */
                            const firstPrediction =
                                row
                                    ? Array.from(
                                        row.values()
                                    )[0]
                                    : undefined;


                            return (

                                <tr
                                    key={
                                        sampleId
                                    }
                                >

                                    <td
                                        style={{
                                            padding: "8px"
                                        }}
                                    >
                                        <strong>
                                            {
                                                sampleId
                                            }
                                        </strong>
                                    </td>


                                    <td
                                        style={{
                                            padding: "8px"
                                        }}
                                    >
                                        {
                                            formatWear(
                                                firstPrediction
                                                    ?.actual_wear
                                            )
                                        }
                                    </td>


                                    <td
                                        style={{
                                            padding: "8px"
                                        }}
                                    >
                                        {
                                            firstPrediction
                                                ?.actual_class
                                                ?? "—"
                                        }
                                    </td>


                                    {modelList.map(
                                        model => {

                                            const item =
                                                row?.get(
                                                    model.trainingRunId
                                                );


                                            if (!item) {

                                                return (

                                                    <td
                                                        key={
                                                            model.trainingRunId
                                                        }
                                                        style={{
                                                            padding: "8px"
                                                        }}
                                                    >
                                                        —
                                                    </td>

                                                );
                                            }


                                            return (

                                                <td
                                                    key={
                                                        model.trainingRunId
                                                    }
                                                    style={{
                                                        padding: "8px"
                                                    }}
                                                >

                                                    <div>

                                                        <strong>
                                                            Класс:{" "}
                                                            {
                                                                item.predicted_class
                                                                ?? "—"
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        Уверенность:{" "}

                                                        {
                                                            formatConfidence(
                                                                item.confidence
                                                            )
                                                        }

                                                    </div>


                                                    {item.predicted_class !==
                                                        item.actual_class && (

                                                        <div
                                                            style={{
                                                                marginTop: "4px"
                                                            }}
                                                        >
                                                            ⚠ Ошибка
                                                        </div>

                                                    )}

                                                </td>

                                            );
                                        }
                                    )}

                                </tr>

                            );
                        }
                    )}

                </tbody>

            </table>

        </div>
    );
}