import type { Prediction } from "../../api/predictionsApi";


interface PredictionsProps {
    predictions: Prediction[];
}


export default function Predictions({
    predictions,
}: PredictionsProps) {

    return (
        <div>

            <h1>Результаты классификации</h1>

            {predictions.length === 0 ? (
                <p>
                    Результаты классификации отсутствуют.
                </p>
            ) : (
                predictions.map((prediction) => (
                    <div key={prediction.id}>
                        Класс: {prediction.predicted_class}
                    </div>
                ))
            )}

        </div>
    );
}