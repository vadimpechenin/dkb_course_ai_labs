import { useMemo } from "react";
import type { PredictionItem } from "../../types/Prediction";

interface Props {
    predictions: PredictionItem[];
}

interface ChartPoint {
    index: number;
    wear: number;
    actualClass: number;
    sampleId: string;
}

const CLASS_COLORS: Record<number, string> = {
    0: "#2e7d32",
    1: "#f9a825",
    2: "#d32f2f"
};

const CLASS_NAMES: Record<number, string> = {
    0: "0 — нормальный",
    1: "1 — повышенный износ",
    2: "2 — высокий износ"
};

export default function PredictionWearChart({
    predictions
}: Props) {

    const points = useMemo<ChartPoint[]>(() => {

        /*
         * В predictions одна строка приходится
         * на одну модель × один sample.
         *
         * Поэтому берём только первую модель,
         * чтобы один и тот же sample не рисовался
         * несколько раз.
         */
        const uniqueSamples = new Map<string, ChartPoint>();

        for (const prediction of predictions) {

            if (uniqueSamples.has(prediction.sample_id)) {
                continue;
            }

            const actualClass = Number(
                prediction.actual_class
            );

            const wear = Number(
                prediction.actual_wear
            );

            if (
                !Number.isFinite(wear) ||
                !Number.isFinite(actualClass)
            ) {
                continue;
            }

            uniqueSamples.set(
                prediction.sample_id,
                {
                    index: uniqueSamples.size + 1,
                    wear,
                    actualClass,
                    sampleId: prediction.sample_id
                }
            );
        }

        return Array.from(
            uniqueSamples.values()
        );
    }, [predictions]);

    if (points.length === 0) {
        return (
            <div>
                Нет данных для построения графика.
            </div>
        );
    }

    const width = 1000;
    const height = 400;

    const paddingLeft = 70;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 55;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        height -
        paddingTop -
        paddingBottom;

    const minWear = Math.min(
        ...points.map(point => point.wear)
    );

    const maxWear = Math.max(
        ...points.map(point => point.wear)
    );

    const wearRange =
        maxWear - minWear || 1;

    const maxIndex = points.length;

    function x(index: number): number {

        if (maxIndex === 1) {
            return paddingLeft +
                chartWidth / 2;
        }

        return (
            paddingLeft +
            ((index - 1) / (maxIndex - 1)) *
            chartWidth
        );
    }

    function y(wear: number): number {

        return (
            paddingTop +
            chartHeight -
            ((wear - minWear) / wearRange) *
            chartHeight
        );
    }

    /*
     * Для 1000 образцов:
     * ceil(1000 / 20) = 50.
     *
     * То есть будет примерно 20 цветных меток.
     */
    const markerStep = Math.max(
        1,
        Math.ceil(points.length / 20)
    );

    /*
     * Последний sample тоже показываем,
     * даже если он не попал в шаг.
     */
    const visiblePoints = points.filter((point, idx) => {
        const isStep = idx % markerStep === 0;
        const isLast = idx === points.length - 1;
        return isStep || isLast;
    });

    /*
     * Линия износа строится по всем точкам.
     */
    const linePoints = points
        .map(point =>
            `${x(point.index)},${y(point.wear)}`
        )
        .join(" ");

    const yTicks = 5;

    return (
        <div>

            <h2>
                Изменение износа по образцам
            </h2>

            <div
                style={{
                    width: "100%",
                    overflowX: "auto"
                }}
            >

                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    width="100%"
                    height="400"
                    preserveAspectRatio="none"
                >

                    {/* Оси */}

                    <line
                        x1={paddingLeft}
                        y1={paddingTop}
                        x2={paddingLeft}
                        y2={
                            height -
                            paddingBottom
                        }
                        stroke="#555"
                    />

                    <line
                        x1={paddingLeft}
                        y1={
                            height -
                            paddingBottom
                        }
                        x2={
                            width -
                            paddingRight
                        }
                        y2={
                            height -
                            paddingBottom
                        }
                        stroke="#555"
                    />

                    {/* Горизонтальная сетка */}

                    {Array.from(
                        { length: yTicks + 1 },
                        (_, index) => {

                            const value =
                                minWear +
                                (
                                    wearRange /
                                    yTicks
                                ) *
                                index;

                            const yy = y(
                                value
                            );

                            return (
                                <g key={index}>

                                    <line
                                        x1={
                                            paddingLeft
                                        }
                                        y1={yy}
                                        x2={
                                            width -
                                            paddingRight
                                        }
                                        y2={yy}
                                        stroke="#e0e0e0"
                                    />

                                    <text
                                        x={
                                            paddingLeft -
                                            10
                                        }
                                        y={
                                            yy + 4
                                        }
                                        textAnchor="end"
                                        fontSize="12"
                                    >
                                        {value.toFixed(1)}
                                    </text>

                                </g>
                            );
                        }
                    )}

                    {/* Линия wear */}

                    <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#555"
                        strokeWidth="1.5"
                    />

                    {/* Цветные точки */}

                    {visiblePoints.map(
                        point => (

                            <circle
                                key={
                                    point.sampleId
                                }
                                cx={
                                    x(point.index)
                                }
                                cy={
                                    y(point.wear)
                                }
                                r="5"
                                fill={
                                    CLASS_COLORS[
                                        point.actualClass
                                    ] ??
                                    "#757575"
                                }
                            />
                        )
                    )}

                    {/* Подпись X */}

                    <text
                        x={
                            paddingLeft +
                            chartWidth / 2
                        }
                        y={
                            height - 10
                        }
                        textAnchor="middle"
                        fontSize="13"
                    >
                        № образца
                    </text>

                    {/* Подпись Y */}

                    <text
                        x="15"
                        y={
                            paddingTop +
                            chartHeight / 2
                        }
                        textAnchor="middle"
                        fontSize="13"
                        transform={`
                            rotate(-90 15 ${
                                paddingTop +
                                chartHeight / 2
                            })
                        `}
                    >
                        Износ
                    </text>

                </svg>

            </div>

            {/* Легенда */}

            <div
                style={{
                    display: "flex",
                    gap: "25px",
                    marginTop: "10px",
                    flexWrap: "wrap"
                }}
            >

                {[0, 1, 2].map(
                    classNumber => (

                        <div
                            key={classNumber}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px"
                            }}
                        >

                            <span
                                style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                        CLASS_COLORS[
                                            classNumber
                                        ]
                                }}
                            />

                            <span>
                                {
                                    CLASS_NAMES[
                                        classNumber
                                    ]
                                }
                            </span>

                        </div>
                    )
                )}

            </div>

            <div
                style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#666"
                }}
            >
                Образцов: {points.length}.
                Шаг отображения цветных меток: {markerStep}.
            </div>

        </div>
    );
}