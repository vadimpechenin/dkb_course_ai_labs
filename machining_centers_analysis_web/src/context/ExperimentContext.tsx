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

    setSelectedModelIds([]);
};

    const [
        selectedFeatureIds,
        setSelectedFeatureIds
    ] = useState<string[]>([]);


    const [
        selectedModelIds,
        setSelectedModelIds
    ] = useState<string | null>(null);


    const clearExperiment = () => {

        setSelectedDatasetId(null);
        setSelectedFeatureIds([]);
        setSelectedModelIds([]);

    };


    return (
        <ExperimentContext.Provider
            value={{
                selectedDatasetId,
                selectedFeatureIds,
                selectedModelIds,

                setSelectedDatasetId,
                setSelectedFeatureIds,
                setSelectedModelIds,

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