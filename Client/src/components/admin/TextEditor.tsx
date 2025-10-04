import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface RichTextEditorProps {
  value?: string;
  onChange?: (data: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value = "", onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor as unknown as any}
      data={value}
      onChange={(_, editor) => {
        const data = editor.getData();
        if (onChange) onChange(data);
      }}
      config={{
        licenseKey: 'GPL',
        toolbar: [
          "undo", "redo", "|",
          "heading", "|",
          "bold", "italic", "|",
          "bulletedList", "numberedList", "outdent", "indent", "|",
          "link", "imageUpload", "insertTable"
        ],
        image: {
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "|",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side"
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
          uploadUrl: "/img/ProductImg/ImgDes"
        }
      }}
    />
  );
};

export default RichTextEditor;
