import {BrowserRouter,Routes,Route, Navigate } from "react-router-dom";


import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import ForecastPage from "../pages/ForecastPage";
import TrainingPage from "../pages/TrainingPage";
import DatasetPage from "../pages/DatasetPage";
import ModelsPage from "../pages/ModelsPage";
import PredictionsPage from "../pages/PredictionsPage";


export default function AppRouter(){

    return(

        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                    path="/dashboard"
                    element={<DashboardPage/>}
                />
                <Route
                    path="/dataset"
                    element={
                        <DatasetPage />
                    }
                />

                <Route
                    path="/models"
                    element={
                        <ModelsPage />
                    }
                />
                <Route
                    path="/predictions"
                    element={<PredictionsPage />}
                />
                <Route
                    path="/settings"
                    element={<SettingsPage/>}
                />
                <Route
                    path="/forecast"
                    element={<ForecastPage />}
                />

                <Route
                    path="/training"
                    element={<TrainingPage />}
                />
            </Routes>

        </BrowserRouter>

    );

}