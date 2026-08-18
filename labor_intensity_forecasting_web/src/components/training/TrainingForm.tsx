import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import {
    getModels,
    type MLModel
} from "../../api/modelsApi";

import {
    getFeatures,
    type Feature
} from "../../api/datasetApi";


export interface TrainingRequest {

    model_id: string;

    dataset_size: number;

    train_percent: number;

    test_percent: number;

    features: string[];

    model_params: Record<string, any>;
}


interface TrainingFormProps {

    onRetrain: (
        request: TrainingRequest
    ) => Promise<void>;

    loading: boolean;
}


export default function TrainingForm({
                                         onRetrain,
                                         loading
                                     }: TrainingFormProps) {

    // --------------------------------------------------
    // Состояние
    // --------------------------------------------------

    const [models, setModels] =
        useState<MLModel[]>([]);

    const [features, setFeatures] =
        useState<Feature[]>([]);

    const [loadingData, setLoadingData] =
        useState(true);


    const [modelId, setModelId] =
        useState("");


    const [datasetSize, setDatasetSize] =
        useState(1000);


    const [trainPercent, setTrainPercent] =
        useState(80);


    const [testPercent, setTestPercent] =
        useState(20);


    const [selectedFeatures, setSelectedFeatures] =
        useState<string[]>([]);


    // --------------------------------------------------
    // Параметры моделей
    // --------------------------------------------------

    const [nEstimators, setNEstimators] =
        useState(200);

    const [maxDepth, setMaxDepth] =
        useState(12);

    const [minSamplesLeaf, setMinSamplesLeaf] =
        useState(1);


    const [maxFeatures, setMaxFeatures] =
        useState("sqrt");


    const [learningRate, setLearningRate] =
        useState(0.1);

    const [nEstimatorsXGB, setNEstimatorsXGB] =
        useState(200);


    const [iterations, setIterations] =
        useState(200);

    const [depth, setDepth] =
        useState(6);

    const [learningRateCatBoost, setLearningRateCatBoost] =
        useState(0.1);


    const [hiddenLayer1, setHiddenLayer1] =
        useState(10);

    const [hiddenLayer2, setHiddenLayer2] =
        useState(10);

    const [maxIter, setMaxIter] =
        useState(1000);


    // --------------------------------------------------
    // Загрузка моделей и признаков
    // --------------------------------------------------

    useEffect(() => {

        async function loadData() {

            try {

                setLoadingData(true);

                const [
                    modelsData,
                    featuresData
                ] = await Promise.all([
                    getModels(),
                    getFeatures()
                ]);

                setModels(modelsData);
                setFeatures(featuresData);


                // Первая модель по умолчанию
                if (modelsData.length > 0) {

                    setModelId(
                        modelsData[0].id
                    );

                }


                // Все признаки, которые разрешены
                // по умолчанию включаем
                setSelectedFeatures(
                    featuresData
                        .filter(feature => feature.enabled)
                        .sort(
                            (a, b) =>
                                (a.feature_order ?? 0) -
                                (b.feature_order ?? 0)
                        )
                        .map(feature =>
                            feature.feature_name
                        )
                );

            } catch (error) {

                console.error(
                    "Ошибка загрузки параметров обучения:",
                    error
                );

            } finally {

                setLoadingData(false);

            }
        }

        loadData();

    }, []);


    // --------------------------------------------------
    // Выбранная модель
    // --------------------------------------------------

    const selectedModel =
        models.find(
            model => model.id === modelId
        );


    // --------------------------------------------------
    // Выбор train/test
    // --------------------------------------------------

    function changeTrain(
        value: number
    ) {

        if (value < 50) {
            value = 50;
        }

        if (value > 95) {
            value = 95;
        }

        setTrainPercent(value);

        setTestPercent(
            100 - value
        );
    }


    // --------------------------------------------------
    // Выбор признака
    // --------------------------------------------------

    function toggleFeature(
        featureName: string
    ) {

        setSelectedFeatures(
            current => {

                if (
                    current.includes(featureName)
                ) {

                    return current.filter(
                        feature =>
                            feature !== featureName
                    );

                }

                return [
                    ...current,
                    featureName
                ];

            }
        );

    }


    // --------------------------------------------------
    // Параметры выбранной модели
    // --------------------------------------------------

    function getModelParams(): Record<string, any> {

        if (!selectedModel) {
            return {};
        }


        switch (selectedModel.name) {

            case "Random Forest":

                return {
                    n_estimators: nEstimators,
                    max_depth: maxDepth,
                    min_samples_leaf: minSamplesLeaf,
                    max_features: maxFeatures
                };


            case "XGBoost":

                return {
                    n_estimators: nEstimatorsXGB,
                    max_depth: maxDepth,
                    learning_rate: learningRate,
                    min_samples_leaf: minSamplesLeaf
                };


            case "CatBoost":

                return {
                    iterations: iterations,
                    depth: depth,
                    learning_rate: learningRateCatBoost
                };


            case "MLP":

                return {
                    hidden_layer_sizes: [
                        hiddenLayer1,
                        hiddenLayer2
                    ],
                    max_iter: maxIter
                };


            case "Linear Regression":

                return {};

            default:

                return {};

        }

    }


    // --------------------------------------------------
    // Отправка формы
    // --------------------------------------------------

    async function submit(
        event: React.FormEvent
    ) {

        event.preventDefault();


        if (!modelId) {
            return;
        }


        if (
            selectedFeatures.length === 0
        ) {
            alert(
                "Выберите хотя бы один признак."
            );

            return;
        }


        const request: TrainingRequest = {

            model_id: modelId,

            dataset_size: datasetSize,

            train_percent:
            trainPercent,

            test_percent:
            testPercent,

            features:
            selectedFeatures,

            model_params:
                getModelParams()

        };


        await onRetrain(request);

    }


    // --------------------------------------------------
    // Индикатор загрузки
    // --------------------------------------------------

    if (loadingData) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 4
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <Box
            component="form"
            onSubmit={submit}
        >

            <Typography
                variant="h6"
                sx={{ mb: 3 }}
            >
                Обучение модели
            </Typography>


            {/* --------------------------------------- */}
            {/* Модель */}
            {/* --------------------------------------- */}

            <Grid
                container
                spacing={2}
            >

                <Grid
                    size={{ xs: 12 }}
                >

                    <TextField
                        select
                        fullWidth
                        label="Модель"
                        value={modelId}
                        onChange={e =>
                            setModelId(
                                e.target.value
                            )
                        }
                    >

                        {models.map(model => (

                            <MenuItem
                                key={model.id}
                                value={model.id}
                            >
                                {model.name}
                            </MenuItem>

                        ))}

                    </TextField>

                </Grid>


                {/* --------------------------------------- */}
                {/* Размер датасета */}
                {/* --------------------------------------- */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <TextField
                        fullWidth
                        type="number"
                        label="Размер датасета"
                        value={datasetSize}
                        onChange={e =>
                            setDatasetSize(
                                Math.max(
                                    1,
                                    Number(
                                        e.target.value
                                    )
                                )
                            )
                        }
                        inputProps={{
                            min: 1,
                            max: 2000
                        }}
                    />

                </Grid>


                {/* --------------------------------------- */}
                {/* Train */}
                {/* --------------------------------------- */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <TextField
                        fullWidth
                        type="number"
                        label="Обучение, %"
                        value={trainPercent}
                        onChange={e =>
                            changeTrain(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                        inputProps={{
                            min: 50,
                            max: 95
                        }}
                    />

                </Grid>


                {/* --------------------------------------- */}
                {/* Test */}
                {/* --------------------------------------- */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >

                    <TextField
                        fullWidth
                        type="number"
                        label="Тест, %"
                        value={testPercent}
                        disabled
                    />

                </Grid>

            </Grid>


            <Divider
                sx={{ my: 4 }}
            />


            {/* --------------------------------------- */}
            {/* Признаки */}
            {/* --------------------------------------- */}

            <Typography
                variant="h6"
                sx={{ mb: 1 }}
            >
                Признаки
            </Typography>


            <FormGroup>

                <Grid
                    container
                >

                    {features
                        .sort(
                            (a, b) =>
                                (a.feature_order ?? 0) -
                                (b.feature_order ?? 0)
                        )
                        .map(feature => (

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}
                                key={
                                    feature.feature_name
                                }
                            >

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                selectedFeatures.includes(
                                                    feature.feature_name
                                                )
                                            }
                                            onChange={() =>
                                                toggleFeature(
                                                    feature.feature_name
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        feature.display_name ??
                                        feature.feature_name
                                    }
                                />

                            </Grid>

                        ))}

                </Grid>

            </FormGroup>


            <Divider
                sx={{ my: 4 }}
            />


            {/* --------------------------------------- */}
            {/* Параметры модели */}
            {/* --------------------------------------- */}

            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                Параметры{" "}
                {selectedModel?.name ?? ""}
            </Typography>


            {/* RANDOM FOREST */}

            {selectedModel?.name ===
                "Random Forest" && (

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Количество деревьев"
                                value={nEstimators}
                                onChange={e =>
                                    setNEstimators(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 10,
                                    max: 1000
                                }}
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Максимальная глубина"
                                value={maxDepth}
                                onChange={e =>
                                    setMaxDepth(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 1,
                                    max: 100
                                }}
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Min samples leaf"
                                value={minSamplesLeaf}
                                onChange={e =>
                                    setMinSamplesLeaf(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 1,
                                    max: 100
                                }}
                            />

                        </Grid>

                    </Grid>

                )}


            {/* XGBOOST */}

            {selectedModel?.name ===
                "XGBoost" && (

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Количество деревьев"
                                value={nEstimatorsXGB}
                                onChange={e =>
                                    setNEstimatorsXGB(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Максимальная глубина"
                                value={maxDepth}
                                onChange={e =>
                                    setMaxDepth(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Learning rate"
                                value={learningRate}
                                onChange={e =>
                                    setLearningRate(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 0.001,
                                    max: 1,
                                    step: 0.01
                                }}
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Min samples leaf"
                                value={minSamplesLeaf}
                                onChange={e =>
                                    setMinSamplesLeaf(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>

                    </Grid>

                )}


            {/* CATBOOST */}

            {selectedModel?.name ===
                "CatBoost" && (

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Iterations"
                                value={iterations}
                                onChange={e =>
                                    setIterations(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Depth"
                                value={depth}
                                onChange={e =>
                                    setDepth(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Learning rate"
                                value={
                                    learningRateCatBoost
                                }
                                onChange={e =>
                                    setLearningRateCatBoost(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                inputProps={{
                                    step: 0.01
                                }}
                            />

                        </Grid>

                    </Grid>

                )}


            {/* MLP */}

            {selectedModel?.name ===
                "MLP" && (

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Нейронов в первом слое"
                                value={hiddenLayer1}
                                onChange={e =>
                                    setHiddenLayer1(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Нейронов во втором слое"
                                value={hiddenLayer2}
                                onChange={e =>
                                    setHiddenLayer2(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>


                        <Grid
                            size={{
                                xs: 12,
                                md: 4
                            }}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Max iterations"
                                value={maxIter}
                                onChange={e =>
                                    setMaxIter(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                        </Grid>

                    </Grid>

                )}


            {/* LINEAR REGRESSION */}

            {selectedModel?.name ===
                "Linear Regression" && (

                    <Typography
                        color="text.secondary"
                    >
                        Для линейной регрессии
                        дополнительные параметры
                        не требуются.
                    </Typography>

                )}


            {/* --------------------------------------- */}
            {/* Кнопка */}
            {/* --------------------------------------- */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 4
                }}
            >

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={
                        loading ||
                        !modelId ||
                        selectedFeatures.length === 0
                    }
                >

                    {loading
                        ? "Обучение..."
                        : "Начать обучение"}

                </Button>

            </Box>

        </Box>
    );
}