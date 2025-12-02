export interface Order {
    id: string;
    orderNumber: string;
    order_type: 'electricity' | 'gas';
    status: 'active' | 'pending' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string;
    topup_fee: number;
}
