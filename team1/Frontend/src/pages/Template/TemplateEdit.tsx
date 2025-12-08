import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TemplateApi } from "@/api/template.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { templateSchema } from "@/schemas/template.schema";
import { TextField, Button, Switch, FormControlLabel } from "@mui/material";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function TemplateEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["template", id],
        queryFn: () => TemplateApi.getById(Number(id)),
    });

    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(templateSchema),
        defaultValues: {
            name: "",
            description: "",
            htmlContent: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                name: data.name,
                description: data.description,
                htmlContent: data.htmlContent,
                isActive: data.isActive,
            });
        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>;

    const onSubmit = async (form: any) => {
        try {
            await TemplateApi.update(Number(id), form);
            toast.success("Updated!");
            navigate("/templates");
        } catch {
            toast.error("Update failed!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <TextField label="Name" fullWidth {...register("name")} />

            <TextField label="Description" fullWidth {...register("description")} />

            <TextField
                label="HTML Content"
                fullWidth
                multiline
                rows={12}
                {...register("htmlContent")}
            />

            <FormControlLabel
                control={<Switch {...register("isActive")} />}
                label="Active"
            />

            <Button type="submit" variant="contained">Update</Button>
        </form>
    );
}
