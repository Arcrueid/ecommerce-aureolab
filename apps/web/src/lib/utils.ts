import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});
const numberFormatter = new Intl.NumberFormat("es-CL", {});

export const formatCurrency = (amount: number) =>
  currencyFormatter.format(amount);

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
