import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingSuspense({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}
