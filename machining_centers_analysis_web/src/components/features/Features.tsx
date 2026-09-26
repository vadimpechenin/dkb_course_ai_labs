import type {
    Feature
} from "../../types/Feature";


interface FeaturesProps {

    features: Feature[];

    selectedFeatureIds: string[];

    onSelectionChange: (
        featureIds: string[]
    ) => void;
}


export default function Features({

                                     features,

                                     selectedFeatureIds,

                                     onSelectionChange

                                 }: FeaturesProps) {


    const isSelected = (
        featureId: string
    ) => {

        return selectedFeatureIds.includes(
            featureId
        );
    };


    const toggleFeature = (
        featureId: string
    ) => {

        if (
            isSelected(featureId)
        ) {

            onSelectionChange(
                selectedFeatureIds.filter(
                    id => id !== featureId
                )
            );

        } else {

            onSelectionChange([
                ...selectedFeatureIds,
                featureId
            ]);

        }
    };


    const selectAll = () => {

        onSelectionChange(
            features
                .filter(
                    feature => feature.enabled
                )
                .map(
                    feature => feature.id
                )
        );
    };


    const clearAll = () => {

        onSelectionChange([]);
    };


    return (

        <div>

            <h1>
                Признаки
            </h1>


            <p>
                Выберите признаки,
                которые будут использоваться
                при обучении классификатора.
            </p>


            <div>

                <button
                    type="button"
                    onClick={selectAll}
                >
                    Выбрать все
                </button>


                <button
                    type="button"
                    onClick={clearAll}
                >
                    Снять все
                </button>

            </div>


            <p>
                Выбрано признаков:{" "}

                <strong>
                    {selectedFeatureIds.length}
                </strong>
            </p>


            <div>

                {features.map(
                    (feature) => (

                        <div
                            key={feature.id}
                        >

                            <label>

                                <input
                                    type="checkbox"

                                    checked={
                                        isSelected(
                                            feature.id
                                        )
                                    }

                                    disabled={
                                        !feature.enabled
                                    }

                                    onChange={() =>
                                        toggleFeature(
                                            feature.id
                                        )
                                    }
                                />


                                <strong>
                                    {
                                        feature.display_name
                                        ||
                                        feature.feature_name
                                    }
                                </strong>


                                {" — "}


                                <span>
                                    {
                                        feature.feature_name
                                    }
                                </span>


                                {" ("}


                                <span>
                                    {
                                        feature.channel
                                    }
                                </span>


                                {feature.unit && (
                                    <>
                                        {", "}
                                        {feature.unit}
                                    </>
                                )}


                                {")"}

                            </label>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}