import React from "react";

const contactLabelStyle = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-subtle)",
  marginBottom: 3,
};

/**
 * ContactChannelList — stacked "label + mailto link" rows (General /
 * Institutions / Press, etc.). Shared by About's and Community's contact
 * sections, per Figma's own `ContactChannelList` component.
 */
export function ContactChannelList({ channels }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {channels.map((channel) => (
        <div key={channel.label}>
          <div style={contactLabelStyle}>{channel.label}</div>
          <a href={`mailto:${channel.email}`} style={{ fontSize: 16 }}>
            {channel.email}
          </a>
        </div>
      ))}
    </div>
  );
}
