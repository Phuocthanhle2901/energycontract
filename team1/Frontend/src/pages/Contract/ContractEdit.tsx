import { useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import ContractFormBase from "./ContractFormBase";

export default function ContractEdit() {
  const { id } = useParams();

  return (
    <>
      <NavMenu />
      <ContractFormBase mode="edit" id={id} />
    </>
  );
}
