export const CATEGORIES = [
  { id: 1, slug: "desktop", name: "Desktop PC", icon: "🖥️", color: "#FF6B35" },
  { id: 2, slug: "laptop", name: "Laptop PC", icon: "💻", color: "#00B4D8" },
  { id: 3, slug: "printers", name: "Imprimante", icon: "🖨️", color: "#7B2CBF" },
  { id: 4, slug: "peripherals", name: "Periferice", icon: "🖱️", color: "#2EC4B6" },
];

export const STATUS_COLORS = {
  pending: "#f39c12", confirmed: "#3498db", processing: "#9b59b6",
  shipped: "#00b4d8", delivered: "#27ae60", cancelled: "#e74c3c",
};

export const STATUS_LABELS = {
  pending: "In asteptare", confirmed: "Confirmata", processing: "Se proceseaza",
  shipped: "Expediata", delivered: "Livrata", cancelled: "Anulata",
};
