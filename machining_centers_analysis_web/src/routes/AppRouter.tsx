import {BrowserRouter,Routes,Route, Navigate } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import DatasetsPage from "../pages/DatasetsPage";
import FeaturesPage from "../pages/FeaturesPage";
import TrainingPage from "../pages/TrainingPage";
import PredictionsPage from "../pages/PredictionsPage";

export default function AppRouter(){

    return(

        <BrowserRouter>

            <Routes>
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>

					<Route
						path="/dashboard"
						element={<DashboardPage/>}
					/>
					
					 <Route
						path="/datasets"
						element={<DatasetsPage />}
					/>

					<Route
						path="/features"
						element={<FeaturesPage />}
					/>

					<Route
						path="/training"
						element={<TrainingPage />}
					/>

					<Route
						path="/predictions"
						element={<PredictionsPage />}
					/>

            </Routes>

        </BrowserRouter>

    );

}