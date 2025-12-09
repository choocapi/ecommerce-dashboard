"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache 5 phút
            staleTime: 5 * 60 * 1000,
            // Giữ cache 10 phút
            gcTime: 10 * 60 * 1000,
            // Không refetch khi focus window
            refetchOnWindowFocus: false,
            // Retry 1 lần khi lỗi
            retry: 1,
            // Retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry mutations
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
