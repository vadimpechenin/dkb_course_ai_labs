import {BrowserRouter,Routes,Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout"; 
import DashboardPage from "../pages/DashboardPage";
import DatasetsPage from "../pages/DatasetsPage";
import FeaturesPage from "../pages/FeaturesPage";
import TrainingPage from "../pages/TrainingPage";
import PredictionsPage from "../pages/PredictionsPage";

export default function AppRouter(){

    return(

        <BrowserRouter>

            <Routes>
				<Route element={<Layout />}  >
					<Route path="/" element={<Navigate to="/dashboard" replace />} />

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
				</Route> 
            </Routes>

        </BrowserRouter>

    );

}