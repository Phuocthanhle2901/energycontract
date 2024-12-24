const TableHead = ({ columns }) => {
    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor }) => {
                    return <th
                        key={accessor}
                        className={`${accessor === "name" || accessor === "description" ? "text-start" : "text-center"}`}
                    >
                        {label}
                    </th>;
                })}
            </tr>
        </thead>
    );
};

export default TableHead;