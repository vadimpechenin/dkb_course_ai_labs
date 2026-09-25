import type {
    Dataset,
} from "../../types/Dataset";


interface DatasetsProps {
    datasets: Dataset[];
}


export default function Datasets({
    datasets,
}: DatasetsProps) {

    return (
        <div>

            <h1>Наборы данных</h1>
            <p>
                Наборы данных для классификации
                износа режущего инструмента.
            </p>

            {datasets.length === 0 ? (
                <p>
                    Наборы данных отсутствуют.
                </p>
            ) : (
                <div>

                    {datasets.map((dataset) => (

                        <div key={dataset.id}>

                            <h2>
                                {dataset.name}
                            </h2>

                            <p>
                                {dataset.description}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}