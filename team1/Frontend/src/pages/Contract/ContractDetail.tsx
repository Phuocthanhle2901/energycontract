import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { useState } from "react";
import { MOCK_CONTRACTS } from "../../mock/mockData";

import ContractHistory from "./ContractHistory";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contract = MOCK_CONTRACTS.find((c) => c.id === Number(id));
  const [tab, setTab] = useState(0);

  if (!contract) return <div>Không tìm thấy hợp đồng</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{contract.contract_number}</Typography>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/contracts/${contract.id}/pdf`)}
          >
            Xem PDF
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/contracts/edit/${contract.id}`)}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Thông tin chung" />
        <Tab label={`Đơn hàng (${contract.orders.length})`} />
        <Tab label="Lịch sử" />
        <Tab label="PDF" />
      </Tabs>

      {/* TAB 0 – INFO */}
      {tab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6">Thông tin khách hàng</Typography>
            <Grid container spacing={3} mt={1}>
              <Grid item xs={6}>
                <strong>Họ tên:</strong>{" "}
                {contract.firstname} {contract.lastname}
              </Grid>
              <Grid item xs={6}>
                <strong>Email:</strong> {contract.email}
              </Grid>
              <Grid item xs={6}>
                <strong>Số điện thoại:</strong> {contract.phone}
              </Grid>
              <Grid item xs={6}>
                <strong>Đại lý:</strong> {contract.reseller_id}
              </Grid>
            </Grid>

            <Typography variant="h6" mt={4}>Địa chỉ</Typography>
            <Grid container spacing={3} mt={1}>
              <Grid item xs={4}>Số nhà: {contract.address.housenumber}</Grid>
              <Grid item xs={4}>Street: {contract.address.street}</Grid>
              <Grid item xs={4}>City: {contract.address.city}</Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* TAB 1 – ORDERS */}
      {tab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>Danh sách đơn hàng</Typography>

            {contract.orders.length === 0 && (
              <Typography>Chưa có đơn hàng.</Typography>
            )}

            {contract.orders.map((o) => (
              <Box
                key={o.id}
                p={2}
                border="1px solid #ddd"
                borderRadius={2}
                mb={2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}><strong>Loại:</strong> {o.type}</Grid>
                  <Grid item xs={4}><strong>Mã:</strong> {o.order_number}</Grid>
                  <Grid item xs={4}><strong>Phí:</strong> {o.topup_fee}</Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 2 – HISTORY */}
      {tab === 2 && <ContractHistory logs={contract.history} />}

      {/* TAB 3 – PDF */}
      {tab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>Xem trước PDF</Typography>
            <Button variant="contained" onClick={() => navigate(`/contracts/${contract.id}/pdf`)}>
              Mở trang PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
