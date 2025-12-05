import {
    BrowserRouter,
    Routes,
    Route,

} from "react-router-dom";
import LoginPage from "@/pages/Auth/SignIn.tsx";
import SignupPage from "@/pages/Auth/SignUp.tsx";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

import HomePage from "@/pages/HomeTemp.tsx";

export default function AppRoutes() {
    return (
        
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<Homepages />} />*/}
                {/*<Route path="/home" element={<Home />} />*/}
                {/* Contract */}
                {/*<Route path="/contracts/create" element={<ContractCreate />} />*/}
                {/*<Route path="/contracts/list" element={<ContractList />} />*/}
                {/*<Route path="/contracts/:id/detail" element={<ContractDetail />} />*/}
                {/*<Route path="/contracts/:id/edit" element={<ContractEdit />} />*/}
                {/*<Route path="/contracts/:contractNumber/pdf" element={<ContractPDF />} />*/}
                {/*<Route path="/contracts/:id/history" element={<ContractHistoryPage />} />*/}

                {/* Address*/}
                {/*<Route path="/address-reseller/list" element={<AddressResellerList />} />*/}
                {/*<Route path="/address-reseller/create" element={<AddressResellerCreate />} />*/}
                {/*<Route path="/address-reseller/edit/:type/:id" element={<AddressResellerEdit />} />*/}
                {/*<Route path="/address-reseller/delete/:type/:id" element={<AddressResellerDelete />} />*/}

                {/* Order*/}
                {/*<Route path="/orderindex" element={<OrderIndex />} />*/}
                {/*<Route path="/orderform" element={<OrderForm />} />*/}
                {/*<Route path="/orderlist" element={<OrderList />} />*/}

                {/*/!* Reseller *!/*/}
                {/*<Route path="/resellers" element={<ResellerList />} />*/}
                {/*<Route path="/resellers/create" element={<CreateReseller />} />*/}
                {/*<Route path="/resellers/edit/:id" element={<ResellerEdit />} />*/}
                {/*<Route path="/resellers/delete/:id" element={<ResellerDelete />} />*/}
                
                <Route path ="/signin" element={<LoginPage/>}></Route>
                <Route path ="/" element={<LoginPage/>}></Route>
                <Route path ="/signup" element={<SignupPage/>}></Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomePage />} />
                </Route>
            </Routes>
            <Toaster position={"top-right"} ></Toaster>
        </BrowserRouter>
    );
}
