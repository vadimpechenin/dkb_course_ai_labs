import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";


interface ExperimentContextType {

    selectedDatasetId: string | null;

    selectedFeatureIds: string[];

    selectedModelId: string | null;


    setSelectedDatasetId: (datasetId: string | null) => void;

    setSelectedFeatureIds: (featureIds: string[]) => void;

    setSelectedModelId: (modelId: string | null) => void;


    clearExperiment: () => void;
}


const ExperimentContext =
    createContext<ExperimentContextType | undefined>(
        undefined
    );


interface ExperimentProviderProps {
    children: ReactNode;
}


export function ExperimentProvider({
    children
}: ExperimentProviderProps) {

    const [
        selectedDatasetId,
        setSelectedDatasetIdState
    ] = useState<string | null>(null);
	
	const setSelectedDatasetId = (
    datasetId: string | null
) => {

    setSelectedDatasetIdState(
        datasetId
    );

    // При смене датасета
    // сбрасываем параметры эксперимента.
    setSelectedFeatureIds([]);

    setSelectedModelId(null);
};

    const [
        selectedFeatureIds,
        setSelectedFeatureIds
    ] = useState<string[]>([]);


    const [
        selectedModelId,
        setSelectedModelId
    ] = useState<string | null>(null);


    const clearExperiment = () => {

        setSelectedDatasetId(null);
        setSelectedFeatureIds([]);
        setSelectedModelId(null);

    };


    return (
        <ExperimentContext.Provider
            value={{
                selectedDatasetId,
                selectedFeatureIds,
                selectedModelId,

                setSelectedDatasetId,
                setSelectedFeatureIds,
                setSelectedModelId,

                clearExperiment
            }}
        >
            {children}
        </ExperimentContext.Provider>
    );
}


export function useExperiment() {

    const context =
        useContext(ExperimentContext);


    if (!context) {
        throw new Error(
            "useExperiment must be used inside ExperimentProvider"
        );
    }


    return context;
}