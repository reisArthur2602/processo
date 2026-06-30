import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/cases");
};

export default DashboardPage;
