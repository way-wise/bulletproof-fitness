"use client";

import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app";

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AppProgressProvider options={{ showSpinner: false }}>
      {children}
    </AppProgressProvider>
  );
};
