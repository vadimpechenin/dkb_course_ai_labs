import type { Feature } from "../../api/featuresApi";


interface FeaturesProps {
    features: Feature[];
}


export default function Features({
    features,
}: FeaturesProps) {

    return (
        <div>

            <h1>Признаки</h1>

            {features.length === 0 ? (
                <p>
                    Признаки отсутствуют.
                </p>
            ) : (
                features.map((feature) => (
                    <div key={feature.id}>
                        {feature.display_name}
                    </div>
                ))
            )}

        </div>
    );
}