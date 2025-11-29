import {
    BrowserRouter,
    Routes,
    Route,

} from "react-router-dom";

import Homepages from "../pages/Introduce/Homepages";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import ContractCreate from "../pages/Contract/ContractCreate";
import ContractList from "../pages/Contract/ContractList";

export default function AppRoutes() {


    return (
        <BrowserRouter>
            <Routes>           
                <Route path="/" element={<Homepages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                {/* Contract */}
                <Route path="/contracts/create" element={<ContractCreate />} />
                <Route path="/contracts/list" element={<ContractList />} />
                
            </Routes>
        </BrowserRouter>
    );
}
