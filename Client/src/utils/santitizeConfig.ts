import DOMPurify from "dompurify";

DOMPurify.setConfig({
  ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "ul", "li"],
  ALLOWED_ATTR: ["href", "title", "target"],
});

export default DOMPurify;