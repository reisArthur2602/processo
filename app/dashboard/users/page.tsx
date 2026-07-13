import { Suspense } from "react";
import { UsersData } from "./feature/users-data";
import { UsersSkeleton } from "./feature/users-skeleton";

const UsersPage = () => {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <UsersData />
    </Suspense>
  );
};

export default UsersPage;
