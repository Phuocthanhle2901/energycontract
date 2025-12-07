import { useEffect, useState } from "react";
import AddressApi from "../api/address.api";


export function useAddressForm(id?: number) {
    const [form, setForm] = useState({
        zipCode: "",
        houseNumber: "",
        extension: "",
    });

    const [loading, setLoading] = useState(false);

    // FETCH WHEN EDIT
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        AddressApi.getById(id)
            .then((res: { zipCode: any; houseNumber: any; extension: any; }) => {
                setForm({
                    zipCode: res.zipCode || "",
                    houseNumber: res.houseNumber || "",
                    extension: res.extension || "",
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // HANDLE CHANGE
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // SUBMIT
    const handleSubmit = async (onSuccess: () => void) => {
        try {
            setLoading(true);
            if (id) {
                await AddressApi.update(id, form);
            } else {
                await AddressApi.create(form);
            }
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return { form, handleChange, handleSubmit, loading };
}
