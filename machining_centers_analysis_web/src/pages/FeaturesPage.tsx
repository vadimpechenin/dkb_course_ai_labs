import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import {
    getFeatures,
    type Feature,
} from "../api/featuresApi";

import Features from "../components/features/Features";


export default function FeaturesPage() {

    const [features, setFeatures] = useState<Feature[]>();
    const [error, setError] = useState<string>();


    useEffect(() => {

        getFeatures()
            .then(setFeatures)
            .catch(() => {
                setError(
                    "Не удалось загрузить признаки."
                );
            });

    }, []);


    if (error) {
        return <div>{error}</div>;
    }


    if (!features) {
        return <div>Loading...</div>;
    }


    return (
        <AppLayout>
        <Features
            features={features}
        />
        </AppLayout>
    );
}