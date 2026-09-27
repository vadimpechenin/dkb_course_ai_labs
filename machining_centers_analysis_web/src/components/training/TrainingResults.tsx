import type {
    TrainingRun
} from "../../api/trainingApi";


interface Props {

    results: TrainingRun[];
}


function formatMetric(
    value?: number | null
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "—";
    }


    return value.toFixed(4);
}


export default function TrainingResults({
    results
}: Props) {


    return (

        <div>

            <h2>
                Результаты обучения
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Модель
                        </th>

                        <th>
                            Размер данных
                        </th>

                        <th>
                            Accuracy
                        </th>

                        <th>
                            Precision
                        </th>

                        <th>
                            Recall
                        </th>

                        <th>
                            F1
                        </th>

                        <th>
                            Время, с
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {results.map(
                        result => (

                            <tr
                                key={
                                    result.id
                                }
                            >

                                <td>
                                    {
                                        result.model_name
                                    }
                                </td>

                                <td>
                                    {
                                        result.dataset_size
                                    }
                                </td>

                                <td>
                                    {
                                        formatMetric(
                                            result.accuracy
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        formatMetric(
                                            result.precision_weighted
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        formatMetric(
                                            result.recall_weighted
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        formatMetric(
                                            result.f1_weighted
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        formatMetric(
                                            result.training_time
                                        )
                                    }
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}