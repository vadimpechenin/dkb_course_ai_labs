import type { MLModel } from "../../types/MLModel";


interface TrainingModelsProps {

    models: MLModel[];

    selectedModelIds: string[];

    onSelectionChange: (
        modelIds: string[]
    ) => void;
}


export default function TrainingModels({

    models,

    selectedModelIds,

    onSelectionChange

}: TrainingModelsProps) {


    const isSelected = (
        modelId: string
    ) => {

        return selectedModelIds.includes(
            modelId
        );
    };


    const toggleModel = (
        modelId: string
    ) => {

        if (
            isSelected(modelId)
        ) {

            onSelectionChange(

                selectedModelIds.filter(
                    id => id !== modelId
                )

            );

        } else {

            onSelectionChange([

                ...selectedModelIds,

                modelId

            ]);

        }
    };


    const selectAll = () => {

        onSelectionChange(

            models
                .filter(
                    model => model.active
                )
                .map(
                    model => model.id
                )

        );
    };


    const clearAll = () => {

        onSelectionChange([]);
    };


    return (

        <div>

            <h2>
                Алгоритмы
            </h2>


            <p>
                Выберите один или несколько
                алгоритмов для обучения.
            </p>


            <div>

                <button
                    type="button"
                    onClick={selectAll}
                >
                    Выбрать все
                </button>


                <button
                    type="button"
                    onClick={clearAll}
                >
                    Снять все
                </button>

            </div>


            <p>

                Выбрано алгоритмов:{" "}

                <strong>
                    {
                        selectedModelIds.length
                    }
                </strong>

            </p>


            <div>

                {models.map(
                    (model) => {

                        const selected =
                            isSelected(
                                model.id
                            );


                        return (

                            <div
                                key={model.id}
                                style={{
                                    border:
                                        selected
                                            ? "2px solid #1976d2"
                                            : "1px solid #ddd",

                                    padding:
                                        "15px",

                                    marginBottom:
                                        "10px",

                                    borderRadius:
                                        "8px"
                                }}
                            >

                                <label
                                    style={{
                                        cursor:
                                            model.active
                                                ? "pointer"
                                                : "default"
                                    }}
                                >

                                    <input
                                        type="checkbox"

                                        checked={
                                            selected
                                        }

                                        disabled={
                                            !model.active
                                        }

                                        onChange={() =>
                                            toggleModel(
                                                model.id
                                            )
                                        }
                                    />


                                    {" "}


                                    <strong>
                                        {
                                            model.name
                                        }
                                    </strong>


                                    {model.description && (

                                        <p
                                            style={{
                                                marginLeft:
                                                    "24px"
                                            }}
                                        >
                                            {
                                                model.description
                                            }
                                        </p>

                                    )}


                                    <div
                                        style={{
                                            marginLeft:
                                                "24px"
                                        }}
                                    >

                                        {model.framework && (

                                            <span>
                                                Framework:{" "}
                                                {
                                                    model.framework
                                                }
                                            </span>

                                        )}


                                        {model.model_type && (

                                            <span
                                                style={{
                                                    marginLeft:
                                                        "15px"
                                                }}
                                            >
                                                Тип:{" "}
                                                {
                                                    model.model_type
                                                }
                                            </span>

                                        )}

                                    </div>

                                </label>

                            </div>

                        );

                    }
                )}

            </div>

        </div>
    );
}