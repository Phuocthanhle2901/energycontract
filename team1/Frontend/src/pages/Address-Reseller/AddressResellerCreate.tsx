import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, MenuItem, Select, TextField, Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

import { useCreateAddressReseller } from "@/hooks/addressReseller/useCreateAddressReseller";

export default function AddressResellerCreate() {
    const navigate = useNavigate();

    const {
        address,
        reseller,
        setAddress,
        setReseller,
        createAll
    } = useCreateAddressReseller();

    const handleCreate = async () => {
        try {
            await createAll();
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

                {/* ADDRESS */}
                <Card sx={{ p: 4, borderRadius: 4, mb: 3 }}>
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

                {/* RESELLER */}
                <Card sx={{ p: 4, borderRadius: 4, mb: 4 }}>
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

                {/* BUTTONS */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCreate}
                    sx={{
                        textTransform: "none",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                    }}
                >
                    Create Address + Reseller
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/address-reseller/list")}
                >
                    Cancel
                </Button>
            </Box>
        </>
    );
}
