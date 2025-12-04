import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===================== AUTH & HOME ===================== */
import Homepages from "@/pages/Introduce/Homepages";
import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home";

/* ===================== CONTRACT MODULE ===================== */
import ContractCreate from "@/pages/Contract/ContractCreate";
import ContractList from "@/pages/Contract/ContractList";
import ContractDetail from "@/pages/Contract/ContractDetail";
import ContractEdit from "@/pages/Contract/ContractEdit";
import ContractPDF from "@/pages/Contract/ContractPDF";
import ContractHistoryPage from "@/pages/Contract/ContractHistoryPage";

/* ===================== ADDRESS - RESELLER MODULE ===================== */
import AddressResellerList from "@/pages/Address-Reseller/AddressResellerList";
import CreateAddressReseller from "@/pages/Address-Reseller/AddressResellerCreate";
import AddressResellerEdit from "@/pages/Address-Reseller/AddressResellerEdit";
import AddressResellerDelete from "@/pages/Address-Reseller/AddressResellerDelete";

/* ===================== ORDERS MODULE ===================== */
import OrderList from "@/pages/orders/OrderList";
import OrderForm from "@/pages/orders/OrderForm";
import OrderIndex from "@/pages/orders/OrderIndex ";

/* ===================== RESELLERS ===================== */
import ResellerPage from "@/pages/resellerPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ===================== AUTH & HOME ===================== */}
                <Route path="/" element={<Homepages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />

                {/* ===================== CONTRACT (CRUD FULL) ===================== */}
                <Route path="/contracts/list" element={<ContractList />} />
                <Route path="/contracts/create" element={<ContractCreate />} />
                <Route path="/contracts/:id/detail" element={<ContractDetail />} />
                <Route path="/contracts/:id/edit" element={<ContractEdit />} />
                <Route path="/contracts/:contractNumber/pdf" element={<ContractPDF />} />
                <Route path="/contracts/:id/history" element={<ContractHistoryPage />} />

                {/* ===================== ADDRESS - RESELLER (CRUD FULL) ===================== */}
                <Route path="/address-reseller/list" element={<AddressResellerList />} />
                <Route path="/address-reseller/create" element={<CreateAddressReseller />} />
                <Route path="/address-reseller/edit/:type/:id" element={<AddressResellerEdit />} />
                <Route path="/address-reseller/delete/:type/:id" element={<AddressResellerDelete />} />

                {/* ===================== ORDERS (CRUD FULL) ===================== */}

                <Route path="/orders" element={<OrderList />} />

                <Route path="/orders/create" element={<OrderForm mode="create" />} />

                <Route path="/orders/:id/edit" element={<OrderForm mode="edit" />} />

                <Route path="/orders/:id/delete" element={<OrderForm mode="delete" />} />


                {/* ===================== RESELLERS ===================== */}
                <Route path="/resellers" element={<ResellerPage />} />

            </Routes>
        </BrowserRouter>
    );
}
