import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, currency = "ETB"): string {
  if (currency === "ETB") {
    return `${price.toLocaleString("en-US")} ETB`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: "Apartment",
    commercial: "Commercial",
  };
  return labels[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-800",
    draft: "bg-stone-100 text-stone-600",
    reserved: "bg-amber-100 text-amber-800",
    sold: "bg-red-100 text-red-800",
    archived: "bg-stone-200 text-stone-500",
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800",
    visit_scheduled: "bg-cyan-100 text-cyan-800",
    negotiating: "bg-amber-100 text-amber-800",
    closed_won: "bg-emerald-100 text-emerald-800",
    closed_lost: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-stone-100 text-stone-600";
}
