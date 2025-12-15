import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useContracts } from "@/hooks/useContracts";
import { useReseller } from "@/hooks/useResellers";

import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import { alpha } from "@mui/material/styles";

import {
  Add as AddIcon,
  Description as ContractIcon,
  Bolt as EnergyIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

// ===================== Component con: Reseller name =====================
const ResellerCell = ({ resellerId }: { resellerId: number }) => {
  const { t } = useTranslation();
  const { data: reseller, isLoading } = useReseller(resellerId);

  if (!resellerId) return <Typography variant="body2">—</Typography>;

  if (isLoading)
    return (
      <Typography variant="caption" color="text.secondary">
        {t("Loading")}
      </Typography>
    );

  return <Typography variant="body2">{reseller?.name || "—"}</Typography>;
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data, isLoading } = useContracts({ pageNumber: 1, pageSize: 100 });
  const contracts = Array.isArray(data?.items) ? data.items : [];

  const stats = useMemo(() => {
    const now = new Date();
    let activeCount = 0;

    contracts.forEach((c: any) => {
      if (c?.endDate && new Date(c.endDate) > now) activeCount++;
    });

    return {
      total: contracts.length,
      active: activeCount,
      expired: contracts.length - activeCount,
      totalOrders: 0,
    };
  }, [contracts]);

  const recentContracts = useMemo(() => contracts.slice(0, 5), [contracts]);

  const heroBg = isDark
    ? `linear-gradient(135deg,
        ${alpha(theme.palette.primary.main, 0.18)} 0%,
        ${alpha(theme.palette.background.paper, 0.92)} 100%)`
    : `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`;

  const heroTextColor = isDark
    ? theme.palette.text.primary
    : theme.palette.common.white;

  const iconBox = (color: "primary" | "success" | "error") => ({
    p: 1.5,
    borderRadius: 2,
    bgcolor: alpha(theme.palette[color].main, isDark ? 0.16 : 0.12),
    color: theme.palette[color].main,
    border: `1px solid ${alpha(theme.palette[color].main, 0.25)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <Box sx={{ display: "flex" }}>
      <NavMenu />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          ml: { xs: 0, md: "240px" },
          p: 3,
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          {/* ================= HERO ================= */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: heroBg,
              color: heroTextColor,
              border: `1px solid ${alpha(
                theme.palette.divider,
                isDark ? 0.35 : 0.12
              )}`,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={900} gutterBottom>
                ⚡ {t("Energy Contract Manager")}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 650 }}>
                {t("Hero Description")}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/contracts/create")}
                sx={{ fontWeight: 800 }}
              >
                {t("New Contract")}
              </Button>
            </Stack>
          </Paper>

          {/* ================= STATS ================= */}
          <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
            📊 {t("Dashboard Overview")}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* CARD 1 */}
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ borderRadius: 3, height: "100%", bgcolor: "background.paper" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Box sx={iconBox("primary")}>
                      <ContractIcon />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={800} color="text.secondary">
                      {t("Total Contracts")}
                    </Typography>
                  </Stack>

                  <Typography variant="h3" fontWeight={900}>
                    {isLoading ? "-" : stats.total}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                    <Chip
                      label={`${stats.active} ${t("Active")}`}
                      size="small"
                      color="success"
                      variant={isDark ? "outlined" : "filled"}
                    />
                    {stats.expired > 0 && (
                      <Chip
                        label={`${stats.expired} ${t("Expired")}`}
                        size="small"
                        color="error"
                        variant={isDark ? "outlined" : "filled"}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, height: "100%", bgcolor: "background.paper" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Box sx={iconBox("success")}>
                      <EnergyIcon />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={800} color="text.secondary">
                      {t("Total Orders")}
                    </Typography>
                  </Stack>

                  <Typography variant="h3" fontWeight={900}>
                    {isLoading ? "-" : "N/A"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {t("Gas & Electricity combined")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 3 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, height: "100%", bgcolor: "background.paper" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Box sx={iconBox("error")}>
                      <TimeIcon />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={800} color="text.secondary">
                      {t("Requires Renewal")}
                    </Typography>
                  </Stack>

                  <Typography variant="h3" fontWeight={900}>
                    {isLoading ? "-" : stats.expired}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {stats.expired === 0 ? `✅ ${t("All active")}` : `⚠️ ${t("Need Action")}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ================= RECENT TABLE ================= */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={900}>
              📄 {t("Recent Contracts")}
            </Typography>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate("/contracts/list")}>
              {t("View All")}
            </Button>
          </Stack>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900 }}>{t("Contract No.")}</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{t("Customer")}</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{t("Reseller")}</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{t("Duration")}</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{t("Status")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>
                    {t("Action")}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {t("Loading data...")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : recentContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography variant="h6" color="text.secondary">
                        📭 {t("No contracts found")}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/contracts/create")}
                      >
                        {t("Create First Contract")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentContracts.map((c: any) => {
                    const active = c?.endDate && new Date(c.endDate) > new Date();

                    return (
                      <TableRow
                        key={c.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.6) },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={900} color="primary.main">
                            {c.contractNumber}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" fontWeight={800}>
                            {c.firstName} {c.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.email}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <ResellerCell resellerId={c.resellerId} />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {c.startDate ? new Date(c.startDate).toLocaleDateString("vi-VN") : "—"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t("common.to")}{" "}
                            {c.endDate ? new Date(c.endDate).toLocaleDateString("vi-VN") : "N/A"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={active ? t("Active") : t("Expired")}
                            color={active ? "success" : "error"}
                            size="small"
                            variant={active ? "filled" : "outlined"}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Button size="small" onClick={() => navigate(`/contracts/${c.id}/detail`)}>
                            {t("Details")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}
