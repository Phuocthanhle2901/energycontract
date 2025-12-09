import { useEffect, useState } from "react";
import ResellerApi from "@/api/reseller.api";

export function useResellerForm(id?: number) {
    const [form, setForm] = useState({
        name: "",
        type: "Broker",
    });

    const [loading, setLoading] = useState(false);

    // --- LOAD DATA WHEN EDIT ---
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        ResellerApi.getById(id)
            .then((data) => {
                setForm({
                    name: data.name || "",
                    type: data.type || "Broker",
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // --- HANDLE CHANGE ---
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --- SUBMIT (CREATE / UPDATE) ---
    const handleSubmit = async (onSuccess: () => void) => {
        try {
            setLoading(true);

            if (id) {
                // Update reseller
                await ResellerApi.update(id, form);
            } else {
                // Create reseller
                await ResellerApi.create(form);
            }

            onSuccess();

        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        handleChange,
        handleSubmit,
        loading,
    };
}
