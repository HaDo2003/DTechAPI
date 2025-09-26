import type { Column } from "./Column";

export type Admin = { id: number; name: string; email: string };
export type Advertisement = { id: number; title: string; startDate: string; endDate: string };

export type Entity = Admin | Advertisement;

export const managementConfig: Record<
  string,
  {
    label: string;
    endpoint: string;
    basePath?: string;
    columns: Column<any>[];
  }
> = {
  admin: {
    label: "Admin Account",
    endpoint: "/api/admin/get-admins",
    basePath: "/admin/admin",
    columns: [
      { key: "userName", label: "User Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "gender", label: "Gender" },
      { key: "role", label: "Role" },
      { key: "actions", label: "Function" },
    ],
  },
  advertisement: {
    label: "Advertisement",
    endpoint: "/api/advertisement/get-advertisements",
    columns: [
      { key: "title", label: "Title" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "actions", label: "Function" },
    ],
  },

};
