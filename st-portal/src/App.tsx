import { Fragment, Suspense } from "react";
import NotFound from "./components/NotFound/NotFound";
import { Route, Routes } from "react-router-dom";
import MainUi from "./layouts/MainUi/MainUi";
import Product from "./components/Product";
import DetailProduct from "./pages/DetailProduct";

function App() {
  return (
    <>
      <Suspense fallback={<NotFound></NotFound>}>
        <Fragment>
          <Routes>
            <Route element={<MainUi></MainUi>}>
              <Route
                path="/"
                element={
                  <>
                    <Product></Product>
                  </>
                }
              ></Route>
              <Route
                path="/products/:productId"
                element={<DetailProduct />}
              ></Route>
              <Route path="*" element={<NotFound></NotFound>}></Route>
            </Route>
          </Routes>
        </Fragment>
      </Suspense>
    </>
  );
}

export default App;
