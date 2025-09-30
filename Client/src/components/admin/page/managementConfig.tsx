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
    endpoint: "/api/advertisement/get-ads",
    basePath: "/admin/advertisement",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "order", label: "Order" },
      { key: "actions", label: "Function" },
    ],
  },
  brand: {
    label: "Brand",
    endpoint: "/api/brand/get-brands",
    basePath: "/admin/brand",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "actions", label: "Function" },
    ],
  },
  category: {
    label: "Category",
    endpoint: "/api/category/get-categories",
    basePath: "/admin/category",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "parent", label: "Parent" },
      { key: "actions", label: "Function" },
    ],
  },
  coupon: {
    label: "Coupon",
    endpoint: "/api/coupon/get-coupons",
    basePath: "/admin/coupon",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "code", label: "Code" },
      { key: "discountType", label: "Discount Type" },
      { key: "discount", label: "Discount" },
      { key: "condition", label: "Condition" },
      { key: "detail", label: "Detail" },
      { key: "actions", label: "Function" },
    ],
  },
  customer: {
    label: "Customer",
    endpoint: "/api/customer/get-customers",
    basePath: "/admin/customer",
    allowDelete: false,
    columns: [
      { key: "userName", label: "User Name" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "actions", label: "Function" },
    ],
  },
  feedback: {
    label: "Feedback",
    endpoint: "/api/feedback/get-feedbacks",
    basePath: "/admin/feedback",
    allowDelete: false,
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "detail", label: "Detail" },
      { key: "fbdate", label: "Feedback Date" },
      { key: "actions", label: "Function" },
    ],
  },
  order: {
    label: "Order",
    endpoint: "/api/order/get-orders",
    basePath: "/admin/order",
    allowDelete: false,
    columns: [
      { key: "id", label: "Order ID" },
      { key: "billingName", label: "Customer Name" },
      { key: "orderDate", label: "Order Date" },
      { key: "finalCost", label: "Final Cost" },
      { key: "status", label: "Status" },
      { key: "note", label: "Note" },
      { key: "actions", label: "Function" },
    ],
  },
  paymentMethod: {
    label: "Payment Method",
    endpoint: "/api/paymentMethod/get-payment-methods",
    basePath: "/admin/paymentMethod",
    allowDelete: true,
    columns: [
      { key: "id", label: "Payment Method ID" },
      { key: "description", label: "Description" },
      { key: "actions", label: "Function" },
    ],
  },
  post: {
    label: "Post",
    endpoint: "/api/post/get-posts",
    basePath: "/admin/post",
    allowDelete: true,
    columns: [
      { key: "name", label: "Title" },
      { key: "postDate", label: "Post Date" },
      { key: "postBy", label: "Post By" },
      { key: "postCategory", label: "Post Category" },
      { key: "actions", label: "Function" },
    ],
  },
  postCategory: {
    label: "Post Category",
    endpoint: "/api/postCategory/get-post-categories",
    basePath: "/admin/postCategory",
    allowDelete: true,
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "actions", label: "Function" },
    ],
  },
  product: {
    label: "Product",
    endpoint: "/api/product/get-products",
    basePath: "/admin/product",
    allowDelete: true,
    columns: [
      { key: "id", label: "Product Id" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price" },
      { key: "statusProduct", label: "Status Product" },
      { key: "actions", label: "Function" },
    ],
  },

};
