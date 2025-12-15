import React, { createContext, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const ColorModeContext = createContext({
    mode: "light" as "light" | "dark",
    toggleColorMode: () => { },
});

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const savedMode = (localStorage.getItem("mode") as "light" | "dark") || "light";
    const [mode, setMode] = useState<"light" | "dark">(savedMode);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prev) => {
                    const next = prev === "light" ? "dark" : "light";
                    localStorage.setItem("mode", next);
                    return next;
                });
            },
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "dark"
                        ? {
                            background: { default: "#0B1220", paper: "#111827" },
                        }
                        : {
                            background: { default: "#F8FAFC", paper: "#FFFFFF" },
                        }),
                },

                shape: { borderRadius: 14 },

                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                backgroundColor: mode === "dark" ? "#0B1220" : "#F8FAFC",
                            },
                        },
                    },

                    MuiCard: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                            }),
                        },
                    },

                    MuiPaper: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                backgroundImage: "none",
                            }),
                        },
                    },

                    MuiTableHead: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                backgroundColor: alpha(theme.palette.action.hover, 0.6),
                            }),
                        },
                    },

                    MuiTableCell: {
                        styleOverrides: {
                            head: ({ theme }) => ({
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }),
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
