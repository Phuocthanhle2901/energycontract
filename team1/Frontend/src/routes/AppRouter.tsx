import {
    BrowserRouter,
    Routes,
    Route,

} from "react-router-dom";

import Homepages from "../pages/Introduce/Homepages";

export default function AppRoutes() {


    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    < Route path="/" element={<Homepages />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
