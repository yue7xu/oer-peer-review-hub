import React from "react";
import { FilterChip } from "../forms/FilterChip.jsx";

/**
 * For Authors / For Reviewers toggle — uses shared FilterChip for site DS parity.
 * Clicking the active role again clears the filter.
 */
export function RoleToggle({ activeRole, onChange }) {
  const roles = [
    { id: "author", label: "For Authors" },
    { id: "reviewer", label: "For Reviewers" },
  ];

  return (
    <div className="hiw-controls">
      <div className="hiw-toggle" role="group" aria-label="Highlight a role in the flow">
        {roles.map((role) => {
          const selected = activeRole === role.id;
          return (
            <FilterChip
              key={role.id}
              label={role.label}
              selected={selected}
              onClick={() => onChange(selected ? null : role.id)}
            />
          );
        })}
      </div>
      <span className="hiw-toggle-hint">Trace one role through the flow</span>
    </div>
  );
}
