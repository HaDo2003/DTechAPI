import type { CustomerMonitor } from "./Customer";
import type { OrderMonitor } from "./Order";
import type { ProductMonitor } from "./Product";

export interface Dashboard {
    latestOrders: OrderMonitor[];
    usersList: CustomerMonitor[];
    productsList: ProductMonitor[];
    visitorCounts: VisitorCountMonitor[];
}

export interface VisitorCountMonitor {
    week?: number;
    date?: string;
    day?: string;
    count?: number;
}