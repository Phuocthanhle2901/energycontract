// src/pages/Contract/ContractEdit.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ContractFormBase from "./ContractFormBase";
import NavMenu from "../../components/NavMenu/NavMenu";

const ContractEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      {/* NavMenu */}
      <NavMenu />

      {/* Contract form */}
      <ContractFormBase mode="edit" contractNumber={id} />
    </>
  );
};

export default ContractEdit;
