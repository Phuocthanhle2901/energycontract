import { useParams } from "react-router-dom";
import OrderList from "./OrderList";
import OrderForm from "./OrderForm";
import OrderDelete from "./OrderDelete";

export default function OrderIndex() {
    const { id } = useParams();

    if (!id) return <OrderList />;
    if (id === "create") return <OrderForm mode="create" />;
    if (id === "delete") return <OrderDelete />;

    return <OrderForm mode="edit" />;
}
