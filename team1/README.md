# Energy Contract Management System

This application provides a simple interface to manage customer energy contracts and their associated gas/electricity orders.  
Users can perform full CRUD operations through the GUI and generate a contract PDF based on the stored contract information.

---

## 🏗 Architecture Overview

The system is built around two independent services:

### 1. **CustomerService**
Handles all business and data operations, including:
- CRUD for **Contracts**
- CRUD for **Orders** (gas or electricity)
- CRUD for **Resellers** and **Addresses**
- Tracking contract changes via `contract_history` (stored as JSON)
- Sending contract data to PdfService to generate a PDF

### 2. **PdfService**
Responsible for:
- Storing and managing HTML-based PDF templates
- Generating contract PDFs using data received from CustomerService
- Returning a PDF file or URL back to the GUI
- Store file to bucket/s3 if possible

---

## 📝 Core Features

### ✔ Contract Management
- Create, read, update, delete contracts  
- Supports customer details, address, energy type, dates, reseller, etc.

### ✔ Order Management
- Each contract may have multiple orders  
- Supports gas and electricity types  

### ✔ PDF Generation
- One-click “Generate Contract”  
- CustomerService sends contract data → PdfService returns a PDF  
- Template-driven HTML allows easy customization  

---

## 📦 Data Model (Simplified)

### Contract
- contract_number, start_date, end_date  
- firstname, lastname, email, phone  
- company_name, bank_account_number  
- reseller_id  
- address_id  
- pdf_link  

### Orde
- order_number  
- order_type (gas | electricity)  
- status  
- start_date, end_date  
- topup_fee  

### Address
- zipcode  
- housenumber  
- extension  

### Reseller
- name  
- type  

### ContractHistory
- contract_id  
- old_value (JSON)  
- new_value (JSON)  
- timestamp
---

## 🐳 Hướng dẫn Setup Database (Docker) cho Team

Để đảm bảo môi trường phát triển đồng nhất, chúng ta sử dụng PostgreSQL chạy trên Docker.

### Bước 1: Cài đặt
* Cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* Đảm bảo Docker đang chạy (Icon cá voi không còn chuyển động).

### Bước 2: Khởi động Database
Mở Terminal tại thư mục `Backend/` (nơi chứa file `docker-compose.yml`) và chạy:

```bash
docker-compose up -d
```
- Lệnh này sẽ tải image PostgreSQL và chạy container ngầm
### Bước 3: Cập nhật cấu trúc bảng (Migration)
Sau khi Docker chạy, Database sẽ trống ( lần đầu tiên chạy). Chạy lệnh sau để tạo bảng từ code:
```bash
dotnet ef database update \
--project src/CustomerService/CustomerService.Infrastructure/CustomerService.Infrastructure.csproj \
--startup-project src/CustomerService/CustomerService.API/CustomerService.Api.csproj
```
