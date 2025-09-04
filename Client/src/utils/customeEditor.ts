import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Underline,
  Font,
  Paragraph,
  Link,
  Alignment,
  List,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  LinkImage,
  PictureEditing,
  Heading,
  Indent,
  IndentBlock,
  Table,
  TableToolbar,
  TableColumnResize,
  ImageUpload,
  SimpleUploadAdapter
} from "ckeditor5";

export default class CustomEditor extends ClassicEditor {}

CustomEditor.builtinPlugins = [
  Essentials,
  Bold,
  Italic,
  Underline,
  Font,
  Paragraph,
  Link,
  Alignment,
  List,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  LinkImage,
  PictureEditing,
  Heading,
  Indent,
  IndentBlock,
  Table,
  TableToolbar,
  TableColumnResize,
  ImageUpload,
  SimpleUploadAdapter
];

CustomEditor.defaultConfig = {
  toolbar: [
    "undo", "redo", "|",
    "heading", "|",
    "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "|",
    "bold", "italic", "underline", "|",
    "alignment", "bulletedList", "numberedList", "outdent", "indent"
  ],
  image: {
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Default image width",
        value: null
      },
      {
        name: "resizeImage:50",
        label: "50% page width",
        value: "50"
      },
      {
        name: "resizeImage:75",
        label: "75% page width",
        value: "75"
      }
    ],
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "|",
      "resizeImage"
    ]
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
      { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
      { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" }
    ]
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://"
  },
  simpleUpload: {
    uploadUrl: "img/ProductImg/ImgDes"
  }
};
