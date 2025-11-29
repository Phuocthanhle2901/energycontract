import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContractPdfInfo } from "../../api/pdf.api";
import type{ContractPdfInfo} from "../../api/pdf.api"

export default function ContractPDFPage() {
  const { id } = useParams();
  const [info, setInfo] = useState<ContractPdfInfo | null>(null);

  useEffect(() => {
    if (!id) return;
    getContractPdfInfo(Number(id)).then(setInfo);
  }, [id]);

  if (!info) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Contract PDF</h1>
      </div>
      <div className="card">
        <p>
          PDF generated at: {new Date(info.generatedAt).toLocaleString("vi-VN")}
        </p>
        <div className="pdf-preview">
          <div className="pdf-placeholder">PDF Preview Area (mock)</div>
        </div>
        <button className="btn-outline" disabled>
          Download (mock)
        </button>
      </div>
    </div>
  );
}
