import {
    BrowserRouter,
    Routes,
    Route,
    Router,

} from "react-router-dom";

import Homepages from "../pages/Introduce/Homepages";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import ContractCreate from "../pages/Contract/ContractCreate";
import ContractList from "../pages/Contract/ContractList";
import ContractPDF from './../pages/Contract/ContractPDF';
import ContractEdit from './../pages/Contract/ContractEdit';
// import ContractDetail from './../pages/Contract/ContractDetail';
import ContractDelete from './../pages/Contract/ContractDelete';

import CreateAddress from "../pages/Address/CreateAddress";
import AddressList from "../../src/pages/Address/AddressList";
import AddressDelete from "../../src/pages/Address/AddressDelete";

import CreateReseller from "../pages/Reseller/CreateReseller";
import ResellerList from "../pages/Reseller/ResellerList";
import ResellerEdit from "../pages/Reseller/ResellerEdit";
import ResellerDelete from "../pages/Reseller/ResellerDelete";






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
                <Route path="/contracts/:contractNumber/pdf" element={<ContractPDF />} />
                <Route path="/contracts/edit/1" element={<ContractEdit />} />
                {/* <Route path="/contracts/edit/1" element={<ContractEdit />} /> */}
                <Route path="/contracts/delete/1" element={<ContractDelete />} />

                {/* Address*/}
                <Route path="/address/create" element={<CreateAddress />} />
                <Route path="/address/list" element={<AddressList />} />
                <Route path="/address/delete/:id" element={<AddressDelete />} />

                {/* Reseller */}
                <Route path="/resellers" element={<ResellerList />} />
                <Route path="/resellers/create" element={<CreateReseller />} />
                <Route path="/resellers/edit/:id" element={<ResellerEdit />} />
                <Route path="/resellers/delete/:id" element={<ResellerDelete />} />



            </Routes >
        </BrowserRouter >
    );
}
