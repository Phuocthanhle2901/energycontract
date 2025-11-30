<<<<<<< HEAD

import AppRoutes from "./routes/AppRouter";
import "./assets/styles.css";

export default function App() {
  return <AppRoutes />;
}
=======

import {BrowserRouter,Routes, Route} from "react-router-dom";
import ResellerPage from "./pages/ResellerPage.tsx";
import { Toaster } from "sonner";
function App() {
  return ( 
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/reseller" element={<ResellerPage />} />
            </Routes>
        </BrowserRouter>
      <Toaster richColors position={"top-right"}></Toaster>
    </>
  )
}

export default App
>>>>>>> 0fee2a44146a9d4217a88864a7771d627690aca5
