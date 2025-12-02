import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, MenuItem, Select, TextField, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { useState } from "react";
import { AddressApi } from "../../api/address.api";
import { ResellerApi } from "../../api/reseller.api";

export default function AddressResellerCreate() {
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        zipCode: "",
        houseNumber: "",
        extension: "",
    });

    const [reseller, setReseller] = useState({
        name: "",
        type: "Broker",
    });

    // ===========================
    // 🔥 CREATE BOTH IN ONE CLICK
    // ===========================
    const handleCreateAll = async () => {
        try {
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

            alert("Created Address + Reseller successfully!");
            navigate("/address-reseller/list");

        } catch (err) {
            console.error(err);
            alert("Error creating data!");
        }
    };

    return (
        <>
            <NavMenu />

            <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    Create Address & Reseller
                </Typography>

                <Card
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        mb: 3
                    }}
                >
                    {/* ADDRESS SECTION */}
                    <Typography fontWeight={700} sx={{ mb: 2 }}>
                        Address Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormLabel>Zip Code</FormLabel>
                            <TextField
                                fullWidth
                                value={address.zipCode}
                                onChange={(e) =>
                                    setAddress({ ...address, zipCode: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormLabel>House Number</FormLabel>
                            <TextField
                                fullWidth
                                value={address.houseNumber}
                                onChange={(e) =>
                                    setAddress({ ...address, houseNumber: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormLabel>Extension</FormLabel>
                            <TextField
                                fullWidth
                                value={address.extension}
                                onChange={(e) =>
                                    setAddress({ ...address, extension: e.target.value })
                                }
                            />
                        </Grid>
                    </Grid>
                </Card>

                {/* RESELLER SECTION */}
                <Card
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        mb: 4
                    }}
                >
                    <Typography fontWeight={700} sx={{ mb: 2 }}>
                        Reseller Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormLabel>Reseller Name</FormLabel>
                            <TextField
                                fullWidth
                                value={reseller.name}
                                onChange={(e) =>
                                    setReseller({ ...reseller, name: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormLabel>Partner Type</FormLabel>
                            <FormControl fullWidth>
                                <Select
                                    value={reseller.type}
                                    onChange={(e) =>
                                        setReseller({ ...reseller, type: e.target.value })
                                    }
                                >
                                    <MenuItem value="Broker">Broker</MenuItem>
                                    <MenuItem value="Agency">Agency</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>

                {/* ============================ */}
                {/* 🔥 ONE BUTTON FOR BOTH */}
                {/* ============================ */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        textTransform: "none",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 2
                    }}
                    onClick={handleCreateAll}
                >
                    Create Address + Reseller
                </Button>

                <Button
                    variant="outlined"
                    sx={{
                        mt: 2,
                        textTransform: "none",
                        borderRadius: 2
                    }}
                    onClick={() => navigate("/address-reseller/list")}
                >
                    Cancel
                </Button>
            </Box>
        </>
    );
}
