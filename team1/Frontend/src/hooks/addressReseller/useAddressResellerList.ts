import { useEffect, useState } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { ResellerApi } from "@/services/customerService/ResellerService";

export function useAddressResellerList() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [resellers, setResellers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        AddressApi.getAll().then((res) => setAddresses(res.data ?? res));
        ResellerApi.getAll().then((res) => setResellers(res.data ?? res));
    }, []);

    const filteredAddresses = addresses.filter((a) =>
        a.zipCode?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredResellers = resellers.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase())
    );

    return {
        search,
        setSearch,
        filteredAddresses,
        filteredResellers,
    };
}
