import {
    BrowserRouter,
    Routes,
    Route,
    // Router,

} from "react-router-dom";

import Homepages from "../pages/Introduce/Homepages";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import ContractCreate from "../pages/Contract/ContractCreate";
import ContractList from "../pages/Contract/ContractList";
// import ContractPDF from './../pages/Contract/ContractPDF';
// import ContractEdit from './../pages/Contract/ContractEdit';
// import ContractDetail from './../pages/Contract/ContractDetail';
// import ContractDelete from './../pages/Contract/ContractDelete';

// import CreateAddress from "../pages/Address/CreateAddress";
// import AddressList from "../../src/pages/Address/AddressList";
// import AddressDelete from "../../src/pages/Address/AddressDelete";

// import CreateReseller from "../pages/Reseller/CreateReseller";
// import ResellerList from "../pages/Reseller/ResellerList";
// import ResellerEdit from "../pages/Reseller/ResellerEdit";
// import ResellerDelete from "../pages/Reseller/ResellerDelete";
import ContractDetail from "@/pages/Contract/ContractDetail";
import ContractEdit from "@/pages/Contract/ContractEdit";
import ContractPDF from "@/pages/Contract/ContractPDF";

import ContractHistoryPage from './../pages/Contract/ContractHistoryPage';

import AddressResellerList from "../pages/Address-Reseller/AddressResellerList";
import CreateAddressReseller from "../pages/Address-Reseller/AddressResellerCreate";
import AddressResellerEdit from "@/pages/Address-Reseller/AddressResellerEdit";
import AddressResellerDelete from "@/pages/Address-Reseller/AddressResellerDelete";

import OrderIndex from "../pages/orders/OrderIndex ";





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
                <Route path="/contracts/:id/detail" element={<ContractDetail />} />
                <Route path="/contracts/:id/edit" element={<ContractEdit />} />
                <Route path="/contracts/:contractNumber/pdf" element={<ContractPDF />} />
                <Route path="/contracts/:id/history" element={<ContractHistoryPage />} />



                {/* Address*/}
                {/* <Route path="/address/create" element={<CreateAddress />} />
                <Route path="/address/list" element={<AddressList />} />
                <Route path="/address/delete/:id" element={<AddressDelete />} /> */}



                <Route path="/address-reseller/list" element={<AddressResellerList />} />
                <Route path="/address-reseller/create" element={<CreateAddressReseller />} />
                <Route path="/address-reseller/edit/:type/:id" element={<AddressResellerEdit />} />
                <Route path="/address-reseller/delete/:type/:id" element={<AddressResellerDelete />} />




                {/* Order*/}
                <Route path="/orders" element={<OrderIndex />} />





                {/* Reseller */}
                {/* <Route path="/resellers" element={<ResellerList />} />
                <Route path="/resellers/create" element={<CreateReseller />} />
                <Route path="/resellers/edit/:id" element={<ResellerEdit />} />
                <Route path="/resellers/delete/:id" element={<ResellerDelete />} /> */}


            </Routes >
        </BrowserRouter >
    );
}
