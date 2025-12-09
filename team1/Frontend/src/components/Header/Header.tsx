import React from "react";
import { Box, Button, Container, Modal, Stack, TextField, Typography } from "@mui/material";
import { useLogin, useRegister } from "@/hooks/useAuth";

const Header = () => {
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(false);

    const login = useLogin();
    const register = useRegister();

    const [loginData, setLoginData] = React.useState({ username: "", password: "" });
    const [registerData, setRegisterData] = React.useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleLogin = () => {
        login.mutate(loginData);
    };

    const handleRegister = () => {
        if (registerData.password !== registerData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        register.mutate(registerData);
    };

    return (
        <>
            <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <Container sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">INFODATION Management</Typography>

                    <Button variant="outlined" onClick={() => setOpenLogin(true)}>
                        SIGN IN
                    </Button>
                </Container>
            </Box>

            {/* LOGIN MODAL */}
            <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h5">Sign In</Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />

                        <Button variant="contained" onClick={handleLogin}>
                            Login
                        </Button>
                    </Stack>

                    <Typography sx={{ mt: 2 }}>
                        No account?{" "}
                        <span onClick={() => { setOpenLogin(false); setOpenRegister(true); }}>
                            Register
                        </span>
                    </Typography>
                </Box>
            </Modal>

            {/* REGISTER MODAL */}
            <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h5">Create Account</Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="First Name"
                                value={registerData.firstName}
                                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            />
                            <TextField
                                label="Last Name"
                                value={registerData.lastName}
                                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            />
                        </Stack>

                        <TextField
                            label="Email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) =>
                                setRegisterData({ ...registerData, confirmPassword: e.target.value })
                            }
                        />

                        <Button variant="contained" onClick={handleRegister}>
                            Register
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 4,
    bgcolor: "#222",
    color: "white",
    borderRadius: 3,
    width: 400
};

export default Header;
