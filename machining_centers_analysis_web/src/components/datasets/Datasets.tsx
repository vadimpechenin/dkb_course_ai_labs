import type { Dataset } from "../../api/datasetsApi";


interface DatasetsProps {
    datasets: Dataset[];
}


export default function Datasets({
    datasets,
}: DatasetsProps) {

    return (
        <div>

            <h1>Наборы данных</h1>

            {datasets.length === 0 ? (
                <p>
                    Наборы данных отсутствуют.
                </p>
            ) : (
                datasets.map((dataset) => (
                    <div key={dataset.id}>
                        {dataset.name}
                    </div>
                ))
            )}

        </div>
    );
}