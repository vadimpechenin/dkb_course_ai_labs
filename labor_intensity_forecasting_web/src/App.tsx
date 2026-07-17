import Navigation from "./components/Navigation";

import DashboardPage from "./pages/DashboardPage";

export default function App(){

  return(

      <>

        <Navigation/>

        <div
            style={{
              marginLeft:260,
              padding:20
            }}
        >

          <DashboardPage/>

        </div>

      </>

  );

}