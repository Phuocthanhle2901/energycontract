import NavMenu from "@/components/NavMenu/NavMenu";
import ContractFormBase from "./ContractFormBase";

export default function ContractCreate() {
  return (
    <>
      <NavMenu />
      <ContractFormBase mode="create" />
    </>
  );
}
