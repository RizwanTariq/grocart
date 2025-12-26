"use client";

import { createPortal } from "react-dom";

function PortalWrapper({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}

export default PortalWrapper;
