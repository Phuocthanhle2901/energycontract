import { Box, Grid, TextField, MenuItem, Card, CardContent, Typography } from "@mui/material";
import { type Contract } from "../../types/contractTypes";
import type { Reseller } from "@/types/contractTypes";

interface Props {
    contract: Contract;
    resellers: Reseller[];
    onChange: (field: string, value: any) => void;
}

export default function ContractFormBase({ contract, resellers, onChange }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Thông tin hợp đồng
                </Typography>

                <Grid container spacing={3}>
                    {/* Firstname */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Họ"
                            value={contract.firstName}
                            onChange={(e) => onChange("firstname", e.target.value)}
                        />
                    </Grid>

                    {/* Lastname */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tên"
                            value={contract.lastName}
                            onChange={(e) => onChange("lastname", e.target.value)}
                        />
                    </Grid>

                    {/* Company */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Công ty"
                            value={contract.companyName}
                            onChange={(e) => onChange("company_name", e.target.value)}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={contract.email}
                            onChange={(e) => onChange("email", e.target.value)}
                        />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            value={contract.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                        />
                    </Grid>

                    {/* Bank Account */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Số tài khoản ngân hàng"
                            value={contract.bankAccountNumber}
                            onChange={(e) => onChange("bank_account_number", e.target.value)}
                        />
                    </Grid>

                    {/* Reseller */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Đại lý"
                            value={contract.resellerId}
                            onChange={(e) => onChange("reseller_id", Number(e.target.value))}
                        >
                            {resellers.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.name} – {r.type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                {/* Address */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Địa chỉ
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Số nhà"
                                value={contract.address.housenumber}
                                onChange={(e) =>
                                    onChange("address", {
                                        ...contract.address,
                                        housenumber: e.target.value,
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Extension"
                                value={contract.address.extension}
                                onChange={(e) =>
                                    onChange("address", {
                                        ...contract.address,
                                        extension: e.target.value,
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Zipcode"
                                value={contract.address.zipcode}
                                onChange={(e) =>
                                    onChange("address", {
                                        ...contract.address,
                                        zipcode: e.target.value,
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Đường"
                                value={contract.address.street}
                                onChange={(e) =>
                                    onChange("address", {
                                        ...contract.address,
                                        street: e.target.value,
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Thành phố"
                                value={contract.address.city}
                                onChange={(e) =>
                                    onChange("address", {
                                        ...contract.address,
                                        city: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}
