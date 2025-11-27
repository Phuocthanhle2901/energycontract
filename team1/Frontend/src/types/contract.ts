export interface Contract {
    contractNumber: string;
    firstname: string;
    lastname: string;
    email: string;
    startDate: string;
    endDate?: string;    // API chưa trả, optional
    status: string;      // Active / Expired
    orders?: any[];      // tạm để frontend xử lý, default rỗng
    reseller?: { name: string }; // API chưa trả, tạm tạo
    address?: any;       // API chưa trả
}