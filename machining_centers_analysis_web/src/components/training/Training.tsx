import type { TrainingPageData } from "../../api/trainingApi";


interface TrainingProps {
    training: TrainingPageData;
}


export default function Training({
    training,
}: TrainingProps) {

    return (
        <div>

            <h1>Обучение модели</h1>

            <p>
                Выберите набор данных, признаки
                и модель машинного обучения.
            </p>

            <div>
                Наборов данных:{" "}
                {training.datasets.length}
            </div>

            <div>
                Признаков:{" "}
                {training.features.length}
            </div>

            <div>
                Моделей:{" "}
                {training.models.length}
            </div>

        </div>
    );
}