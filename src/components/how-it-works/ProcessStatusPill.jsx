import React from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";

/**
 * Page-local public status labels (prototype wording), using shared StatusBadge chrome.
 * Does not change catalog StatusBadge semantics — label override via children only.
 */
export function ProcessStatusPill({ label, status }) {
  return <StatusBadge status={status}>{label}</StatusBadge>;
}
