import React from "react";
import {
    Box,
    Button,
    Container,

    Modal,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";

const Header: React.FC = () => {
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(false);

    const inputStyle = {
        input: { color: "white" },
        label: { color: "white" },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.4)"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        }
    };
    const navigate = useNavigate();


    return (
        <>
            {/* TOP NAV */}
            <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <Container
                    maxWidth="lg"
                    sx={{
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        INFODATION
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ ml: 1, opacity: 0.7 }}
                        >
                            Management
                        </Typography>
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        <Typography>SOFTWARE</Typography>
                        <Typography>INDUSTRIES</Typography>
                        <Typography>FREE TRIAL</Typography>
                        <Typography>RESOURCES</Typography>
                        <Typography>COMPANY</Typography>
                        <Typography>BLOG</Typography>
                    </Stack>

                    <Button
                        variant="outlined"
                        onClick={() => setOpenLogin(true)}
                        sx={{
                            px: 3,
                            borderRadius: 999,
                            color: "white",
                            borderColor: "white",
                            "&:hover": { borderColor: "#4f77ff", color: "#4f77ff" }
                        }}
                    >
                        SIGN IN
                    </Button>
                </Container>
            </Box>

            {/* ========== LOGIN POPUP ========== */}
            <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 380,
                        bgcolor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(20px)",
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                    }}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Sign In
                    </Typography>

                    <Stack spacing={2}>
                        <TextField label="Email" fullWidth sx={inputStyle} />
                        <TextField label="Password" type="password" fullWidth sx={inputStyle} />

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#3550ff",
                                "&:hover": { bgcolor: "#4f6bff" }
                            }}
                            onClick={() => navigate("/Hero")}
                        >
                            Login
                        </Button>


                        <Typography sx={{ textAlign: "center", mt: 1 }}>
                            Don’t have an account?{" "}
                            <span
                                style={{
                                    color: "#ffd700",
                                    cursor: "pointer",
                                    fontWeight: 700
                                }}
                                onClick={() => {
                                    setOpenLogin(false);
                                    setOpenRegister(true);
                                }}
                            >
                                Register
                            </span>
                        </Typography>
                    </Stack>
                </Box>
            </Modal>

            {/* ========== REGISTER POPUP ========== */}
            <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 420,
                        bgcolor: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(20px)",
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                    }}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Create Account
                    </Typography>

                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <TextField label="First Name" fullWidth sx={inputStyle} />
                            <TextField label="Last Name" fullWidth sx={inputStyle} />
                        </Stack>

                        <TextField label="Email" fullWidth sx={inputStyle} />
                        <TextField label="Phone" fullWidth sx={inputStyle} />

                        <TextField label="Password" type="password" fullWidth sx={inputStyle} />
                        <TextField label="Confirm Password" type="password" fullWidth sx={inputStyle} />

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#3550ff",
                                "&:hover": { bgcolor: "#4f6bff" }
                            }}
                        >
                            Register
                        </Button>

                        <Typography sx={{ textAlign: "center", mt: 1 }}>
                            Already have an account?{" "}
                            <span
                                style={{
                                    color: "#ffd700",
                                    cursor: "pointer",
                                    fontWeight: 700
                                }}
                                onClick={() => {
                                    setOpenRegister(false);
                                    setOpenLogin(true);
                                }}
                            >
                                Sign In
                            </span>
                        </Typography>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default Header;
