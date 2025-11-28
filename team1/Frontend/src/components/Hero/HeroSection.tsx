import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
export const signupFormRef = React.createRef<HTMLDivElement>();

const HeroSection: React.FC = () => {

    const scrollToForm = () => {
        signupFormRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box sx={{ py: 10 }}>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: 6,
                }}
            >
                <Box flex={1}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "2.6rem", md: "3.6rem" },
                            lineHeight: 1.15,
                        }}
                    >
                        Energy, Oil, &amp; Gas
                        <br />
                        Contract Management
                        <br />
                        Software
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 3, opacity: 0.9 }}>
                        Trusted by Energy Industry Leaders to Manage Contracts and Committals.
                    </Typography>

                    {/* BUTTON SCROLL TO FORM */}
                    <Button
                        variant="contained"
                        onClick={scrollToForm}
                        sx={{
                            mt: 4,
                            borderRadius: 999,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            bgcolor: "#2130d1ff",
                            "&:hover": { bgcolor: "#3340e1" }
                        }}
                    >
                        Register now
                    </Button>
                </Box>

                <Box flex={1} sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                        sx={{
                            width: 260,
                            height: 360,
                            borderRadius: 4,
                            background:
                                "radial-gradient(circle at 20% 0%, #2130d1ff 0, transparent 60%), radial-gradient(circle at 80% 100%, #1e88ff 0, transparent 55%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 60px 20px #312178ff",
                        }}
                    >
                        <BoltIcon sx={{ fontSize: 160, color: "white" }} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
export default HeroSection;