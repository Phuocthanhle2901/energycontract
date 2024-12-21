import { useState } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import RoomData from "./../../data/RoomData.json";
import { Pagination } from "antd";

const RoomTable = () => {
    const [tableData] = useState(RoomData); // Dữ liệu gốc
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số dòng mỗi trang

    // Dữ liệu phân trang
    const paginatedData = tableData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    // Xử lý thay đổi trang/kích thước
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };


    // const [tableData, setTableData] = useState(RoomData);

    const columns = [
        { label: "#", accessor: "id" },
        { label: "Name", accessor: "name" },
        { label: "Description", accessor: "description" },
        { label: "Status", accessor: "status" },
        { label: "Host", accessor: "host" },
        { label: "Balance", accessor: "balance" },
        { label: "Deposite", accessor: "deposite" },
    ];

    return (
        <>
            <div style={{
                minHeight: "calc(100vh - 320px)",
                maxHeight: "calc(100vh - 320px)",
                overflowY: "auto"
            }}>


                <table className="table">

                    <TableHead columns={[...columns, { label: "Actions", accessor: "actions" }]} />
                    <TableBody columns={columns} tableData={paginatedData} />
                </table> </div>
            <Pagination
                total={tableData.length}
                current={currentPage}
                pageSize={pageSize}
                pageSizeOptions={["5", "10", "20", "50"]}
                showSizeChanger
                showQuickJumper
                onChange={handlePaginationChange}
                showTotal={(total) => `Total ${total} items`}
            // style={{ marginTop: "20px", textAlign: "right" }}
            />
        </>
    );
};

export default RoomTable;