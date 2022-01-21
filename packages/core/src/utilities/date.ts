const DateFormatPattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

const dateReviver: Parameters<typeof JSON.parse>[1] = ({}, value) =>
  DateFormatPattern.test(value) ? new Date(value) : value;

const formatDate = (d: Date) => d.toLocaleString("en-GB");

export { DateFormatPattern, formatDate, dateReviver };
