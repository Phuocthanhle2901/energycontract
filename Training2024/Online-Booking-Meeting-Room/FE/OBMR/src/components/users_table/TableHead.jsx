const TableHead = ({ columns }) => {
    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor }) => {
                    return <th
                        key={accessor}
                        className={`${accessor === "name" || accessor === "email" ? "text-start" : "text-center"}`}
                    >{label}</th>;
                })}
            </tr>
        </thead>
    );
};

export default TableHead;