import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { templateSchema } from "@/schemas/template.schema";
import { TemplateApi } from "@/api/template.api";
import { TextField, Button, Switch, FormControlLabel } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TemplateCreate() {
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(templateSchema),
        defaultValues: {
            name: "",
            description: "",
            htmlContent: "",
            isActive: true,
        },
    });

    const onSubmit = async (form: any) => {
        try {
            await TemplateApi.create(form);
            toast.success("Template created!");
            navigate("/templates");
        } catch {
            toast.error("Create failed!");
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
                rows={10}
                {...register("htmlContent")}
            />

            <FormControlLabel
                control={<Switch {...register("isActive")} />}
                label="Active"
            />

            <Button variant="contained" type="submit">Create</Button>
        </form>
    );
}
