import type {
    Dashboard as DashboardData,
    DashboardLastTraining,
    DashboardModel,
} from "../../types/Dashboard";

import "./Dashboard.css";

interface DashboardProps {
    dashboard: DashboardData;
}


function StatisticCard({
                           title,
                           value,
                       }: {
    title: string;
    value: number;
}) {
    return (
        <div className="dashboard-statistic-card">
            <div className="dashboard-statistic-value">
                {value}
            </div>

            <div className="dashboard-statistic-title">
                {title}
            </div>
        </div>
    );
}


function ModelCard({
                       model,
                   }: {
    model: DashboardModel;
}) {
    return (
        <div className="dashboard-model-card">

            <div className="dashboard-model-header">
                <h3>{model.name}</h3>

                {model.active && (
                    <span className="dashboard-model-active">
                        Активна
                    </span>
                )}
            </div>

            <div className="dashboard-model-info">
                <div>
                    <span>Тип:</span>
                    <strong>{model.model_type}</strong>
                </div>

                <div>
                    <span>Framework:</span>
                    <strong>{model.framework ?? "—"}</strong>
                </div>

                <div>
                    <span>Задача:</span>
                    <strong>{model.task_type ?? "—"}</strong>
                </div>
            </div>

        </div>
    );
}


function LastTraining({
                          training,
                      }: {
    training: DashboardLastTraining | null | undefined;
}) {
    if (!training) {
        return (
            <div className="dashboard-empty">
                <h3>Последнее обучение</h3>

                <p>
                    Обучение моделей пока не выполнялось.
                </p>
            </div>
        );
    }

    return (
        <div className="dashboard-training">

            <div className="dashboard-training-header">
                <div>
                    <h3>Последнее обучение</h3>

                    <p>
                        {training.model_name}
                    </p>
                </div>
            </div>

            <div className="dashboard-training-info">

                <div>
                    <span>Размер выборки</span>
                    <strong>
                        {training.dataset_size}
                    </strong>
                </div>

                <div>
                    <span>Accuracy</span>
                    <strong>
                        {training.accuracy != null
                            ? training.accuracy.toFixed(3)
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>F1 weighted</span>
                    <strong>
                        {training.f1_weighted != null
                            ? training.f1_weighted.toFixed(3)
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>Precision weighted</span>
                    <strong>
                        {training.precision_weighted != null
                            ? training.precision_weighted.toFixed(3)
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>Recall weighted</span>
                    <strong>
                        {training.recall_weighted != null
                            ? training.recall_weighted.toFixed(3)
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>CV score</span>
                    <strong>
                        {training.cv_score != null
                            ? training.cv_score.toFixed(3)
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>Время обучения</span>
                    <strong>
                        {training.training_time != null
                            ? `${training.training_time.toFixed(2)} с`
                            : "—"}
                    </strong>
                </div>

                <div>
                    <span>Дата</span>
                    <strong>
                        {training.created_at
                            ? new Date(
                                training.created_at
                            ).toLocaleString("ru-RU")
                            : "—"}
                    </strong>
                </div>

            </div>

        </div>
    );
}


export default function Dashboard({
                                      dashboard,
                                  }: DashboardProps) {

    const statistics = dashboard.statistics;

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h1 style={{ display: 'block', lineHeight: 1, marginBottom: '8px' }}>
                    Классификация износа режущего инструмента
                </h1>

                <p>
                    Сводная информация о данных,
                    признаках и результатах машинного обучения
                </p>
            </div>


            <section className="dashboard-section">

                <h2>Статистика</h2>

                <div className="dashboard-statistics">

                    <StatisticCard
                        title="Наборы данных"
                        value={statistics.datasets_count}
                    />

                    <StatisticCard
                        title="Эксперименты"
                        value={statistics.experiments_count}
                    />

                    <StatisticCard
                        title="Образцы сигналов"
                        value={statistics.signal_samples_count}
                    />

                    <StatisticCard
                        title="Векторы признаков"
                        value={statistics.feature_vectors_count}
                    />

                    <StatisticCard
                        title="Признаки"
                        value={statistics.features_count}
                    />

                    <StatisticCard
                        title="ML-модели"
                        value={statistics.ml_models_count}
                    />

                    <StatisticCard
                        title="Обучения"
                        value={statistics.training_runs_count}
                    />

                    <StatisticCard
                        title="Предсказания"
                        value={statistics.predictions_count}
                    />

                </div>

            </section>


            <section className="dashboard-section">

                <h2>Доступные модели</h2>

                <div className="dashboard-models">

                    {dashboard.active_models.length === 0 ? (

                        <div className="dashboard-empty">
                            Доступные модели отсутствуют.
                        </div>

                    ) : (

                        dashboard.active_models.map((model) => (
                            <ModelCard
                                key={model.id}
                                model={model}
                            />
                        ))

                    )}

                </div>

            </section>


            <section className="dashboard-section">

                <LastTraining
                    training={dashboard.last_training}
                />

            </section>

        </div>
    );
}