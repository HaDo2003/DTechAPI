import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "../../utils/customeEditor";

interface RichTextEditorProps {
  value?: string;
  onChange?: (data: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value = "", onChange }) => {
  return (
    <CKEditor
      editor={CustomEditor}
      data={value}
      onChange={(_, editor) => {
        const data = editor.getData();
        if (onChange) onChange(data);
      }}
      onReady={(editor) => {
        console.log("Editor ready:", editor);
      }}
    />
  );
};

export default RichTextEditor;
