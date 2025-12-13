export interface Order {
    id: number;
    orderNumber: string;
    orderType: 0 | 1;               // 0 = gas, 1 = electricity
    status: 0 | 1 | 2 | 3;          // 0 pending, 1 active, 2 completed, 3 cancelled
    startDate: string;
    endDate: string | null;
    topupFee: number;
    contractId: number;
}
