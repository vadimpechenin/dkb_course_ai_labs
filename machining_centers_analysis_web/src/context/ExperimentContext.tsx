import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

interface ExperimentContextType {
    selectedDatasetId: string | null;
    selectedFeatureIds: string[];
    selectedModelIds: string[];

    setSelectedDatasetId: (datasetId: string | null) => void;
    setSelectedFeatureIds: (featureIds: string[]) => void;
    setSelectedModelIds: (modelIds: string[]) => void;

    clearExperiment: () => void;
}

const ExperimentContext =
    createContext<ExperimentContextType | undefined>(undefined);

interface ExperimentProviderProps {
    children: ReactNode;
}

export function ExperimentProvider({ children }: ExperimentProviderProps) {
    // 1. Сначала объявляем все стейты в самом начале компонента
    const [selectedDatasetId, setSelectedDatasetIdState] = useState<string | null>(null);
    const [selectedFeatureIds, setSelectedFeatureIdsState] = useState<string[]>([]);

    // Исправлено: теперь инициализируется массивом [], как в интерфейсе
    const [selectedModelIds, setSelectedModelIdsState] = useState<string[]>([]);

    // 2. Теперь объявляем кастомные функции-модификаторы
    const setSelectedDatasetId = (datasetId: string | null) => {
        setSelectedDatasetIdState(datasetId);
        // При смене датасета сбрасываем параметры эксперимента.
        setSelectedFeatureIdsState([]);
        setSelectedModelIdsState([]);
    };

    const clearExperiment = () => {
        setSelectedDatasetIdState(null);
        setSelectedFeatureIdsState([]);
        setSelectedModelIdsState([]);
    };

    return (
        <ExperimentContext.Provider
            value={{
                selectedDatasetId,
                selectedFeatureIds,
                selectedModelIds,

                setSelectedDatasetId,
                // Передаем функции-сеттеры в контекст
                setSelectedFeatureIds: setSelectedFeatureIdsState,
                setSelectedModelIds: setSelectedModelIdsState,

                clearExperiment
            }}
        >
            {children}
        </ExperimentContext.Provider>
    );
}

export function useExperiment() {
    const context = useContext(ExperimentContext);
    if (!context) {
        throw new Error(
            "useExperiment must be used inside ExperimentProvider"
        );
    }
    return context;
}
