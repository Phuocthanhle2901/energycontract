
import {BrowserRouter,Routes, Route} from "react-router-dom";

import { Toaster } from "sonner";
import ResellerPage from "@/pages/resellerPage.tsx";
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
