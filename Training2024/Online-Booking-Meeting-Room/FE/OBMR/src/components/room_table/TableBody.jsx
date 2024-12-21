const TableBody = ({ tableData, columns }) => {
    return (
        <tbody>
            {tableData.map((data) => {
                return (
                    <tr key={data.id}>
                        {columns.map(({ accessor }) => {
                            const tData = data[accessor] ? data[accessor] : "——";
                            return <td
                                key={accessor}
                                className={`${accessor === "name" || accessor === "description" ? "text-start" : "text-center"}`}
                            >{tData}</td>;
                        })}
                        <td>
                            <button className="btn btn-action" onClick={() => onDelete(data.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                            <button className="btn btn-action ms-1" onClick={() => onEdit(data.id)}>
                                <i className="fa-solid fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;