
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
