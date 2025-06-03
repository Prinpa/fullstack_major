import { AppLayout } from "components/Layout/AppLayout";
import { AddProductForm } from "components/Products/addProductForm";
import { getUserData } from "components/authFunctions";

export default async function page() {
  const userData = await getUserData();

  return (
    <AppLayout>
      {userData.role === "admin" ? <AddProductForm/>:  <p>Unauthorized</p>}
    </AppLayout>
  );
}
