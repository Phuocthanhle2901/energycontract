import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { getContracts } from "../../services/customerService/ContractService";
import { ResellerApi } from "../../services/customerService/ResellerService";
import type { ContractResponse } from "@/types/contract";

export default function ContractList() {
  const [list, setList] = useState<ContractResponse[]>([]);
  const [resellers, setResellers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load contracts
    getContracts().then((res) => {
      const normalized = Array.isArray(res) ? res : [];
      setList(normalized);
    });

    // Load resellers
    ResellerApi.getAll().then((res) => setResellers(res));
  }, []);

  // Map resellerId → resellerName
  const getResellerName = (id: number | null | undefined) => {
    const found = resellers.find((r) => r.id === id);
    return found ? found.name : "—";
  };

  return (
    <Box sx={{ ml: "240px", p: 3 }}>
      <NavMenu />

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Contracts</Typography>
        <Button variant="contained" onClick={() => navigate("/contracts/create")}>
          + Add Contract
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Reseller</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.firstName} {c.lastName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.startDate}</TableCell>


                {/* ==== SHOW RESELLER NAME ==== */}
                <TableCell>{getResellerName(c.resellerId)}</TableCell>

                <TableCell align="right">
                  <Button onClick={() => navigate(`/contracts/${c.id}/detail`)}>Detail</Button>
                  <Button onClick={() => navigate(`/contracts/${c.id}/edit`)}>Edit</Button>
                  <Button color="error" onClick={() => navigate(`/contracts/${c.id}/delete`)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}

            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No contracts</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
