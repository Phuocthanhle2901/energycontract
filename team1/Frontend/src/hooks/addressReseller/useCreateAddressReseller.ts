import { useState } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { ResellerApi } from "@/services/customerService/ResellerService";

export function useCreateAddressReseller() {
    const [address, setAddress] = useState({
        zipCode: "",
        houseNumber: "",
        extension: "",
    });

    const [reseller, setReseller] = useState({
        name: "",
        type: "Broker",
    });

    const createAll = async () => {
        // 1) Create Address
        await AddressApi.create({
            zipCode: address.zipCode,
            houseNumber: address.houseNumber,
            extension: address.extension,
        });

        // 2) Create Reseller
        await ResellerApi.create({
            name: reseller.name,
            type: reseller.type,
        });
    };

    return {
        address,
        reseller,
        setAddress,
        setReseller,
        createAll,
    };
}
