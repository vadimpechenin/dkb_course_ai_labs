import type { Dataset } from "../../types/Dataset";


interface DatasetsProps {

    datasets: Dataset[];

    selectedDatasetId: string | null;

    onSelectDataset: (
        datasetId: string
    ) => void;
}


export default function Datasets({
    datasets,
    selectedDatasetId,
    onSelectDataset
}: DatasetsProps) {


    return (

        <div>

            <h1>
                Наборы данных
            </h1>


            <p>
                Выберите набор данных
                для дальнейшего эксперимента.
            </p>


            {datasets.length === 0 ? (

                <div>
                    Наборы данных отсутствуют.
                </div>

            ) : (

                <div>

                    {datasets.map((dataset) => {

                        const selected =
                            dataset.id ===
                            selectedDatasetId;


                        return (

                            <div
                                key={dataset.id}
                                style={{
                                    border: selected
                                        ? "2px solid #1976d2"
                                        : "1px solid #ddd",

                                    padding: "20px",

                                    marginBottom: "15px",

                                    borderRadius: "8px"
                                }}
                            >

                                <h2>
                                    {dataset.name}
                                </h2>


                                {dataset.description && (

                                    <p>
                                        {
                                            dataset.description
                                        }
                                    </p>

                                )}


                                <p>
                                    <strong>
                                        Источник:
                                    </strong>{" "}

                                    {
                                        dataset.source_name
                                        || "—"
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Тип:
                                    </strong>{" "}

                                    {
                                        dataset.source_type
                                        || "—"
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Образцов:
                                    </strong>{" "}

                                    {
                                        dataset.samples_count
                                    }
                                </p>


                                <p>
                                    <strong>
                                        Инструментов:
                                    </strong>{" "}

                                    {
                                        dataset.tools_count
                                    }
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectDataset(
                                            dataset.id
                                        )
                                    }
                                >

                                    {selected
                                        ? "Выбран"
                                        : "Выбрать"}

                                </button>

                            </div>
                        );

                    })}

                </div>

            )}

        </div>
    );
}