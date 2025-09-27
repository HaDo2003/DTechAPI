import type { Column } from "./Column";

export const managementConfig: Record<
  string,
  {
    label: string;
    endpoint: string;
    basePath?: string;
    allowDelete?: boolean;
    columns: Column<any>[];
  }
> = {
  admin: {
    label: "Admin Account",
    endpoint: "/api/admin/get-admins",
    basePath: "/admin/admin",
    allowDelete: true,
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
    basePath: "/admin/advertisment",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "order", label: "Order" },
    ],
  },
  brand: {
    label: "Brand",
    endpoint: "/api/brand/get-brand",
    basePath: "/admin/brand",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "slug", label: "Slug" },
    ],
  },
  category: {
    label: "Category",
    endpoint: "/api/category/get-category",
    basePath: "/admin/category",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "parent", label: "Parent" },
    ],
  },
  coupon: {
    label: "Coupon",
    endpoint: "/api/coupon/get-coupon",
    basePath: "/admin/coupon",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "discountType", label: "Discount Type" },
      { key: "code", label: "Code" },
      { key: "discount", label: "Discount" },
      { key: "condition", label: "Condition" },
      { key: "detail", label: "Detail" }
    ],
  },
  customer: {
    label: "Customer",
    endpoint: "/api/customer/get-customer",
    basePath: "/admin/customer",
    allowDelete: false,
    columns: [
      { key: "userName", label: "User Name" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone Number" },
    ],
  },
  feedback: {
    label: "Feedback",
    endpoint: "/api/feedback/get-feedback",
    basePath: "/admin/feedback",
    allowDelete: false,
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "detail", label: "Detail" },
      { key: "fbdate", label: "Feedback Date" },
    ],
  },
  order: {
    label: "Order",
    endpoint: "/api/order/get-order",
    basePath: "/admin/order",
    allowDelete: false,
    columns: [
      { key: "id", label: "Order ID" },
      { key: "orderDate", label: "Order Date" },
      { key: "finalCost", label: "Final Cost" },
      { key: "note", label: "Note" },
      { key: "billingName", label: "Customer Name" },
      { key: "status", label: "Status" },
    ],
  },
  paymentMethod: {
    label: "Payment Method",
    endpoint: "/api/paymentMethod/get-paymentMethod",
    basePath: "/admin/paymentMethod",
    allowDelete: true,
    columns: [
      { key: "id", label: "Payment Method ID" },
      { key: "description", label: "Description" },
    ],
  },
  post: {
    label: "Post",
    endpoint: "/api/post/get-post",
    basePath: "/admin/post",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "postDate", label: "Post Date" },
      { key: "postBy", label: "POst By" },
      { key: "postCategory", label: "Post Category" },
    ],
  },
  postCategory: {
    label: "Post Category",
    endpoint: "/api/postCategory/get-postCategory",
    basePath: "/admin/postCategory",
    allowDelete: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
    ],
  },
  product: {
    label: "Product",
    endpoint: "/api/product/get-product",
    basePath: "/admin/product",
    allowDelete: true,
    columns: [
      { key: "id", label: "Product Id" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price" },
      { key: "statusProduct", label: "Status Product" },
    ],
  },

};
