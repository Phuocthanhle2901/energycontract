import { useQuery } from "@tanstack/react-query";
import { TemplateApi } from "@/api/template.api";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TemplateList() {
    const navigate = useNavigate();

    const { data = [], refetch } = useQuery({
        queryKey: ["templates"],
        queryFn: TemplateApi.getAll,
    });

    return (
        <div>
            <Button variant="contained" onClick={() => navigate("/templates/create")}>
                Create Template
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((t: any) => (
                        <TableRow key={t.id}>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>{t.isActive ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <Button onClick={() => navigate(`/templates/edit/${t.id}`)}>Edit</Button>
                                <Button color="error" onClick={async () => {
                                    await TemplateApi.delete(t.id);
                                    refetch();
                                }}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
