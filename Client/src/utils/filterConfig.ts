export interface FilterGroup {
  label: string;
  options: string[];
}

export const filterOptions: Record<string, FilterGroup[]> = {
  laptop: [
    { label: "CPU", options: ["Intel i5", "Intel i7", "AMD Ryzen 5", "AMD Ryzen 7"] },
    { label: "RAM", options: ["8GB", "16GB", "32GB"] },
    { label: "Storage", options: ["256GB SSD", "512GB SSD", "1TB SSD"] },
  ],
  "smart-phone": [
    { label: "Screen Size", options: ["5.5 inch", "6.1 inch", "6.7 inch"] },
    { label: "Battery", options: ["3000mAh", "4000mAh", "5000mAh+"] },
    { label: "Camera", options: ["Dual", "Triple", "Quad"] },
  ],
  tablet: [
    { label: "Display", options: ["10 inch", "11 inch", "12.9 inch"] },
    { label: "Storage", options: ["64GB", "128GB", "256GB+"] },
    { label: "Connectivity", options: ["Wi-Fi", "Wi-Fi + Cellular"] },
  ],
  keyboard: [
    { label: "Switch Type", options: ["Blue", "Red", "Brown"] },
    { label: "Connectivity", options: ["Wired", "Wireless"] },
    { label: "Backlight", options: ["RGB", "White", "None"] },
  ],
  mouse: [
    { label: "DPI", options: ["800", "1600", "3200+"] },
    { label: "Connectivity", options: ["Wired", "Wireless", "Bluetooth"] },
    { label: "Sensor Type", options: ["Optical", "Laser"] },
  ],
  headphone: [
    { label: "Type", options: ["Over-ear", "On-ear", "In-ear"] },
    { label: "Connectivity", options: ["Wired", "Bluetooth", "TWS"] },
    { label: "Noise Cancelling", options: ["Yes", "No"] },
  ],
};