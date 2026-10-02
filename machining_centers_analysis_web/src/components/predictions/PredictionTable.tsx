import type { PredictionItem } from "../../types/Prediction";

interface Props {
    predictions: PredictionItem[];
    sampleIds: string[];
}

export default function PredictionTable({
    predictions,
    sampleIds
}: Props) {

    const modelIds = Array.from(
        new Set(
            predictions.map(
                prediction =>
                    prediction.training_run_id
            )
        )
    );

    const modelNames = new Map<
        string,
        string
    >();

    for (const prediction of predictions) {

        if (
            !modelNames.has(
                prediction.training_run_id
            )
        ) {
            modelNames.set(
                prediction.training_run_id,
                prediction.model_name ??
                    prediction.training_run_id
            );
        }
    }

    function getPrediction(
        sampleId: string,
        trainingRunId: string
    ): PredictionItem | undefined {

        return predictions.find(
            prediction =>
                prediction.sample_id ===
                    sampleId &&
                prediction.training_run_id ===
                    trainingRunId
        );
    }

    return (
        <div>

            <h2>
                Результаты Prediction
            </h2>

            <div
                style={{
                    overflowX: "auto"
                }}
            >

                <table
                    style={{
                        borderCollapse:
                            "collapse",
                        width: "100%"
                    }}
                >

                    <thead>

                        <tr>

                            <th style={thStyle}>
                                №
                            </th>

                            <th style={thStyle}>
                                Sample
                            </th>

                            <th style={thStyle}>
                                Wear
                            </th>

                            <th style={thStyle}>
                                Actual
                            </th>

                            {modelIds.map(
                                modelId => (

                                    <th
                                        key={
                                            modelId
                                        }
                                        style={
                                            thStyle
                                        }
                                    >
                                        {
                                            modelNames.get(
                                                modelId
                                            )
                                        }
                                    </th>

                                )
                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {sampleIds.map(
                            (
                                sampleId,
                                index
                            ) => {

                                const firstPrediction =
                                    getPrediction(
                                        sampleId,
                                        modelIds[0]
                                    );

                                return (
                                    <tr
                                        key={
                                            sampleId
                                        }
                                    >

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                index +
                                                1
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                sampleId
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                firstPrediction
                                                    ?.actual_wear
                                                    ?.toFixed(
                                                        4
                                                    )
                                            }
                                        </td>

                                        <td
                                            style={
                                                {
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold"
                                                }
                                            }
                                        >
                                            {
                                                firstPrediction
                                                    ?.actual_class
                                            }
                                        </td>

                                        {modelIds.map(
                                            modelId => {

                                                const prediction =
                                                    getPrediction(
                                                        sampleId,
                                                        modelId
                                                    );

                                                if (
                                                    !prediction
                                                ) {
                                                    return (
                                                        <td
                                                            key={
                                                                modelId
                                                            }
                                                            style={
                                                                tdStyle
                                                            }
                                                        >
                                                            —
                                                        </td>
                                                    );
                                                }

                                                const isCorrect =
                                                    prediction
                                                        .predicted_class ===
                                                    prediction
                                                        .actual_class;

                                                return (
                                                    <td
                                                        key={
                                                            modelId
                                                        }
                                                        style={{
                                                            ...tdStyle,
                                                            color:
                                                                isCorrect
                                                                    ? "inherit"
                                                                    : "#d32f2f",
                                                            backgroundColor:
                                                                isCorrect
                                                                    ? "transparent"
                                                                    : "#ffebee",
                                                            fontWeight:
                                                                isCorrect
                                                                    ? "normal"
                                                                    : "bold"
                                                        }}
                                                    >

                                                        <div>
                                                            {
                                                                prediction
                                                                    .predicted_class
                                                            }
                                                        </div>

                                                        {prediction.confidence !==
                                                            null &&
                                                            prediction.confidence !==
                                                                undefined && (
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            "12px",
                                                                        color:
                                                                            "#777"
                                                                    }}
                                                                >
                                                                    confidence:{" "}
                                                                    {(
                                                                        prediction
                                                                            .confidence *
                                                                        100
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                    %
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

        </div>
    );
}

const thStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px 10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    whiteSpace: "nowrap"
};

const tdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "7px 10px"
};