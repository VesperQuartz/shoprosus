"use client";
import { ProgressProvider } from "@bprogress/next/app";
import React from "react";

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <React.Fragment>
      <ProgressProvider
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </React.Fragment>
  );
};
