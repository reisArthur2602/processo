import { Suspense } from "react";
import { ClientsData } from "./feature/clients-data";
import { ClientsSkeleton } from "./feature/clients-skeleton";

const ClientsPage = () => {
  return (
    <Suspense fallback={<ClientsSkeleton />}>
      <ClientsData />
    </Suspense>
  );
};

export default ClientsPage;
