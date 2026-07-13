import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/clients");
};

export default DashboardPage;
