import { mixed } from "yup";

const TicketFormats = ["book", "audiobook", "both"] as const;

type TicketFormat = typeof TicketFormats[number];

const TicketFormat = mixed<TicketFormat>((x: any): x is TicketFormat =>
  x ? TicketFormats.includes(x) : true
);

export { TicketFormat, TicketFormats };
