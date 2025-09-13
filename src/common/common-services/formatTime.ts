import dayjs from "dayjs";

export const formatDate = (
  timestamp: string,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string => {
  const date = dayjs(timestamp).format(format);
  return date;
};
