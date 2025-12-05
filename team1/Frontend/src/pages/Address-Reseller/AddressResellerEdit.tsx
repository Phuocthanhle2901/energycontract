import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    FormControl,
    FormLabel,
    Select,
    MenuItem
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";

import { useAddressResellerEdit } from "@/hooks/addressReseller/useAddressResellerEdit";

export default function AddressResellerEdit() {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const {
        data,
        setData,
        save,
        loading,
        isAddress,
        isReseller
    } = useAddressResellerEdit(type, id);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data found</div>;
    const handleSave = async () => {
        try {
            await save();

            alert("Updated successfully!");
            navigate("/address-reseller/list");
        } catch (err) {
            alert("Update failed!");
            console.error(err);
        }
    };
    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
            <NavMenu />

            <Card sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    Edit {isAddress ? "Address" : "Reseller"}
                </Typography>

                {/* ----- ADDRESS FORM ----- */}
                {isAddress && (
                    <>
                        <TextField
                            fullWidth
                            label="Zip Code"
                            sx={{ mb: 2 }}
                            value={data.zipCode}
                            onChange={(e) =>
                                setData({ ...data, zipCode: e.target.value })
                            }
                        />

                        <TextField
                            fullWidth
                            label="House Number"
                            sx={{ mb: 2 }}
                            value={data.houseNumber}
                            onChange={(e) =>
                                setData({ ...data, houseNumber: e.target.value })
                            }
                        />

                        <TextField
                            fullWidth
                            label="Extension"
                            sx={{ mb: 3 }}
                            value={data.extension}
                            onChange={(e) =>
                                setData({ ...data, extension: e.target.value })
                            }
                        />
                    </>
                )}

                {/* ----- RESELLER FORM ----- */}
                {isReseller && (
                    <>
                        <TextField
                            fullWidth
                            label="Reseller Name"
                            sx={{ mb: 2 }}
                            value={data.name}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                        />

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel>Partner Type</FormLabel>
                            <Select
                                value={data.partnerType}
                                onChange={(e) =>
                                    setData({ ...data, partnerType: e.target.value })
                                }
                            >
                                <MenuItem value="Broker">Broker</MenuItem>
                                <MenuItem value="Agency">Agency</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}

                <Button variant="contained" fullWidth onClick={handleSave}>
                    Save
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/address-reseller/list")}
                >
                    Cancel
                </Button>
            </Card>
        </Box>
    );
}
