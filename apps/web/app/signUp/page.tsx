import { AppLayout } from "components/Layout/AppLayout";
import SignUp from "components/Auth/SignUp";


export default async function Home() {
  return (
    <AppLayout>
      <div>
        <SignUp />
      </div>
    </AppLayout>
  );
}
