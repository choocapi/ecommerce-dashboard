"use client";

import { UnauthorisedError } from "@/components/common/errors/unauthorized-error";

export default function UnauthorizedPage() {
  return <UnauthorisedError />;
}
