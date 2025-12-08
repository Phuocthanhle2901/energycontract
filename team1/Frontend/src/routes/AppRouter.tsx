import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===================== AUTH & HOME ===================== */
import Homepages from "@/pages/Introduce/Homepages";
// import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home";

/* ===================== CONTRACT MODULE ===================== */
// import ContractCreate from "@/pages/Contract/ContractCreate";
import ContractList from "@/pages/Contract/ContractList";
import ContractDetail from "@/pages/Contract/ContractDetail";
// import ContractEdit from "@/pages/Contract/ContractEdit";
import ContractPDF from "@/pages/Contract/ContractPDF";
import ContractHistoryPage from "@/pages/Contract/ContractHistoryPage";

/* ===================== ADDRESS - RESELLER MODULE ===================== */
import AddressResellerList from "@/pages/Address-Reseller/AddressResellerList";
// import CreateAddressReseller from "@/pages/Address-Reseller/AddressResellerCreate";
// import AddressResellerEdit from "@/pages/Address-Reseller/AddressResellerEdit";
// import AddressResellerDelete from "@/pages/Address-Reseller/AddressResellerDelete";

/* ===================== ORDERS MODULE ===================== */
// import OrderForm from "@/pages/orders/OrderCreate";
// import OrderDelete from "@/pages/orders/OrderDelete";
import OrderList from "@/pages/orders/OrderList";
// import OrderEdit from "@/pages/orders/OrderEdit";

/* ===================== RESELLERS ===================== */
// import ResellerPage from "@/pages/resellerPage";
// import ContractDelete from "@/pages/Contract/ContractDelete";
import TemplateList from "@/pages/Template/TemplateList";
import TemplateCreate from "@/pages/Template/TemplateCreate";
import TemplateEdit from "@/pages/Template/TemplateEdit";



export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ===================== AUTH & HOME ===================== */}
                <Route path="/" element={<Homepages />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/home" element={<Home />} />

                {/* ===================== CONTRACT (CRUD FULL) ===================== */}
                <Route path="/contracts/list" element={<ContractList />} />
                {/* <Route path="/contracts/create" element={<ContractCreate />} /> */}
                <Route path="/contracts/:id/detail" element={<ContractDetail />} />
                {/* <Route path="/contracts/:id/edit" element={<ContractEdit />} />
                <Route path="/contracts/:id/delete" element={<ContractDelete />} /> */}
                <Route path="/contracts/:id/history" element={<ContractHistoryPage />} />

                {/* ===================== CONTRACT (PDF) ===================== */}
                <Route path="/contracts/:id/pdf" element={<ContractPDF />} />



                {/* ===================== ADDRESS - RESELLER (CRUD FULL) ===================== */}
                <Route path="/address-reseller/list" element={<AddressResellerList />} />

                {/* ======================= ORDERS ======================= */}

                <Route path="/orders" element={<OrderList />} />
                {/* <Route path="/orders/create" element={<OrderForm />} />
                <Route path="/orders/:id/edit" element={<OrderEdit />} />
                <Route path="/orders/:id/delete" element={<OrderDelete />} /> */}


                {/* ===================== RESELLERS ===================== */}
                {/* <Route path="/resellers" element={<ResellerPage />} /> */}

                {/* ===================== TEAMPLATE ===================== */}

                <Route path="/templates" element={<TemplateList />} />
                <Route path="/templates/create" element={<TemplateCreate />} />
                <Route path="/templates/edit/:id" element={<TemplateEdit />} />


            </Routes>
        </BrowserRouter>
    );
}
