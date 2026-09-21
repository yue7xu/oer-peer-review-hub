// Shared contact channels for About's "Get in touch" and Community's "Join
// the community" sections. Addresses are explicitly "placeholder." prefixed
// per the design — no real oerhub.org mailbox exists yet.
export const CONTACT_CHANNELS = [
  { label: "General", email: "placeholder.hello@oerhub.org" },
  { label: "Institutions", email: "placeholder.partners@oerhub.org" },
  { label: "Press", email: "placeholder.press@oerhub.org" },
];

// Recipient for the shared ContactFormCard. The form has no backend — on submit
// it opens the visitor's mail client with a pre-filled message to this address.
export const CONTACT_FORM_RECIPIENT = "yuexu3@andrew.cmu.edu";
