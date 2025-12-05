import { useState, useEffect } from "react";
import { AddressApi } from "@/services/customerService/AddressService";
import { ResellerApi } from "@/services/customerService/ResellerService";

export function useAddressResellerEdit(type?: string, id?: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isAddress = type === "address";
    const isReseller = type === "reseller";

    useEffect(() => {
        if (!id || !type) return;

        const fetchData = async () => {
            try {
                if (isAddress) {
                    const d = await AddressApi.getById(Number(id));
                    setData({
                        zipCode: d.zipCode || "",
                        houseNumber: d.houseNumber || "",
                        extension: d.extension || "",
                    });
                }

                if (isReseller) {
                    const d = await ResellerApi.getById(Number(id));
                    setData({
                        name: d.name || "",
                        partnerType: d.type || "Broker",
                    });
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, type]);

    const save = async () => {
        if (!data) return;

        if (isAddress) {
            await AddressApi.update(Number(id), {
                id: Number(id),
                zipCode: data.zipCode,
                houseNumber: data.houseNumber,
                extension: data.extension
            });
        }

        if (isReseller) {
            await ResellerApi.update(Number(id), {
                id: Number(id),
                name: data.name,
                type: data.partnerType
            });
        }
    };


    return {
        data,
        setData,
        save,
        loading,
        isAddress,
        isReseller
    };
}
