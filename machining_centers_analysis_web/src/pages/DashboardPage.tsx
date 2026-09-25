import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import { getDashboard } from "../api/dashboardApi";
import type { Dashboard } from "../types/Dashboard";

import DashboardComponent from "../components/dashboard/Dashboard";


export default function DashboardPage() {

    const [dashboard, setDashboard] = useState<Dashboard>();
    const [error, setError] = useState<string>();


    useEffect(() => {

        getDashboard()
            .then(setDashboard)
            .catch(() => {
                setError(
                    "Не удалось загрузить данные Dashboard."
                );
            });

    }, []);


    if (error) {
        return (
            <div>
                {error}
            </div>
        );
    }


    if (!dashboard) {
        return (
            <div>
                Loading...
            </div>
        );
    }


    return (
        <AppLayout>
        <DashboardComponent
            dashboard={dashboard}
        />
        </AppLayout>
    );
}