import { useMemo } from "react";
import type { PredictionItem } from "../../types/Prediction";

interface Props {
    predictions: PredictionItem[];
}

interface ModelMetrics {
    trainingRunId: string;
    modelName: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
}

interface ConfusionClass {
    classNumber: number;
    tp: number;
    tn: number;
    fp: number;
    fn: number;
}

interface ModelConfusion {
    trainingRunId: string;
    modelName: string;
    classes: ConfusionClass[];
}

const CLASSES = [0, 1, 2];

function calculateMetrics(
    predictions: PredictionItem[]
): ModelMetrics[] {

    const groups = new Map<
        string,
        PredictionItem[]
    >();

    for (const prediction of predictions) {

        const existing =
            groups.get(
                prediction.training_run_id
            ) ?? [];

        existing.push(prediction);

        groups.set(
            prediction.training_run_id,
            existing
        );
    }

    return Array.from(
        groups.entries()
    ).map(
        ([
            trainingRunId,
            items
        ]) => {

            let correct = 0;

            let total = 0;

            let precisionSum = 0;
            let recallSum = 0;
            let f1Sum = 0;

            for (const classNumber of CLASSES) {

                let tp = 0;
                let fp = 0;
                let fn = 0;

                for (const item of items) {

                    const actual =
                        Number(
                            item.actual_class
                        );

                    const predicted =
                        Number(
                            item.predicted_class
                        );

                    if (
                        actual ===
                            classNumber &&
                        predicted ===
                            classNumber
                    ) {
                        tp++;
                    }

                    if (
                        actual !==
                            classNumber &&
                        predicted ===
                            classNumber
                    ) {
                        fp++;
                    }

                    if (
                        actual ===
                            classNumber &&
                        predicted !==
                            classNumber
                    ) {
                        fn++;
                    }

                    if (
                        actual ===
                        predicted
                    ) {
                        correct++;
                    }

                    total++;
                }

                const precision =
                    tp + fp > 0
                        ? tp /
                          (tp + fp)
                        : 0;

                const recall =
                    tp + fn > 0
                        ? tp /
                          (tp + fn)
                        : 0;

                const f1 =
                    precision +
                        recall >
                    0
                        ? (
                            2 *
                            precision *
                            recall
                        ) /
                          (
                              precision +
                              recall
                          )
                        : 0;

                precisionSum +=
                    precision;

                recallSum += recall;

                f1Sum += f1;
            }

            return {
                trainingRunId,
                modelName:
                    items[0]
                        ?.model_name ??
                    trainingRunId,

                accuracy:
                    total > 0
                        ? correct / total
                        : 0,

                precision:
                    precisionSum /
                    CLASSES.length,

                recall:
                    recallSum /
                    CLASSES.length,

                f1:
                    f1Sum /
                    CLASSES.length
            };
        }
    );
}

function calculateConfusionMatrices(
    predictions: PredictionItem[]
): ModelConfusion[] {

    const groups = new Map<
        string,
        PredictionItem[]
    >();

    for (const prediction of predictions) {

        const existing =
            groups.get(
                prediction.training_run_id
            ) ?? [];

        existing.push(prediction);

        groups.set(
            prediction.training_run_id,
            existing
        );
    }

    return Array.from(
        groups.entries()
    ).map(
        ([
            trainingRunId,
            items
        ]) => {

            const classes =
                CLASSES.map(
                    classNumber => {

                        let tp = 0;
                        let tn = 0;
                        let fp = 0;
                        let fn = 0;

                        for (
                            const item
                            of items
                        ) {

                            const actual =
                                Number(
                                    item.actual_class
                                );

                            const predicted =
                                Number(
                                    item.predicted_class
                                );

                            if (
                                actual ===
                                    classNumber &&
                                predicted ===
                                    classNumber
                            ) {
                                tp++;
                            } else if (
                                actual !==
                                    classNumber &&
                                predicted ===
                                    classNumber
                            ) {
                                fp++;
                            } else if (
                                actual ===
                                    classNumber &&
                                predicted !==
                                    classNumber
                            ) {
                                fn++;
                            } else {
                                tn++;
                            }
                        }

                        return {
                            classNumber,
                            tp,
                            tn,
                            fp,
                            fn
                        };
                    }
                );

            return {
                trainingRunId,
                modelName:
                    items[0]
                        ?.model_name ??
                    trainingRunId,
                classes
            };
        }
    );
}

export default function PredictionMetrics({
    predictions
}: Props) {

    const metrics = useMemo(
        () =>
            calculateMetrics(
                predictions
            ),
        [predictions]
    );

    const confusionMatrices =
        useMemo(
            () =>
                calculateConfusionMatrices(
                    predictions
                ),
            [predictions]
        );

    return (
        <div>

            {/* ================================== */}
            {/* Метрики */}
            {/* ================================== */}

            <section>

                <h2>
                    Метрики моделей
                </h2>

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
                                Модель
                            </th>

                            <th style={thStyle}>
                                Accuracy
                            </th>

                            <th style={thStyle}>
                                Precision
                            </th>

                            <th style={thStyle}>
                                Recall
                            </th>

                            <th style={thStyle}>
                                F1
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {metrics.map(
                            metric => (

                                <tr
                                    key={
                                        metric.trainingRunId
                                    }
                                >

                                    <td style={tdStyle}>
                                        {
                                            metric.modelName
                                        }
                                    </td>

                                    <td style={tdStyle}>
                                        {
                                            metric.accuracy.toFixed(
                                                4
                                            )
                                        }
                                    </td>

                                    <td style={tdStyle}>
                                        {
                                            metric.precision.toFixed(
                                                4
                                            )
                                        }
                                    </td>

                                    <td style={tdStyle}>
                                        {
                                            metric.recall.toFixed(
                                                4
                                            )
                                        }
                                    </td>

                                    <td style={tdStyle}>
                                        {
                                            metric.f1.toFixed(
                                                4
                                            )
                                        }
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </section>

            {/* ================================== */}
            {/* Confusion matrix */}
            {/* ================================== */}

            <section
                style={{
                    marginTop: "35px"
                }}
            >

                <h2>
                    Матрица ошибок
                </h2>

                {confusionMatrices.map(
                    matrix => (

                        <div
                            key={
                                matrix.trainingRunId
                            }
                            style={{
                                marginBottom:
                                    "30px"
                            }}
                        >

                            <h3>
                                {matrix.modelName}
                            </h3>

                            <table
                                style={{
                                    borderCollapse:
                                        "collapse"
                                }}
                            >

                                <thead>
                                    <tr>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            Класс
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            TP
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            TN
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            FP
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            FN
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {matrix.classes.map(
                                        row => (

                                            <tr
                                                key={
                                                    row.classNumber
                                                }
                                            >

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        row.classNumber
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        row.tp
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        row.tn
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        row.fp
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        row.fn
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )
                )}

            </section>

        </div>
    );
}

const thStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px 12px",
    textAlign: "left",
    backgroundColor: "#f5f5f5"
};

const tdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px 12px"
};