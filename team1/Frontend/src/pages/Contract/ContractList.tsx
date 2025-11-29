// src/pages/Contract/ContractList.tsx
import React, { useEffect, useState } from "react";
import { getContracts, deleteContract } from "../../api/contract.api";
import type { ContractSummary } from "../../types/contract";
import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";

// import NavMenu nếu bạn có sẵn component này
import NavMenu from "../../components/NavMenu/NavMenu";

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContracts();
        setContracts(data);
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (contractNumber: string) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;

    try {
      await deleteContract(Number(contractNumber)); // giả sử contractNumber là ID số
      setContracts(contracts.filter(c => c.contractNumber !== contractNumber));
    } catch (err) {
      console.error(err);
      alert("Failed to delete contract");
    }
  };

  return (
    <>
      {/* Navbar */}
      <NavMenu />

      {/* Page content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Contracts
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => navigate("/contracts/create")}
        >
          Create New Contract
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contract Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map(c => (
              <TableRow key={c.contractNumber}>
                <TableCell>{c.contractNumber}</TableCell>
                <TableCell>{c.customerName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.startDate}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/contracts/${c.contractNumber}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(c.contractNumber)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                  No contracts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default ContractList;
