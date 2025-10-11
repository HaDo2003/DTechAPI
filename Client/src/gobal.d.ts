import $ from "jquery";
declare module "swiper/css";
declare module "swiper/css/navigation";

declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}

export {};