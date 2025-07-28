"use client";

import { SWRConfig } from "swr";

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const SwrConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        revalidateOnReconnect: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};
