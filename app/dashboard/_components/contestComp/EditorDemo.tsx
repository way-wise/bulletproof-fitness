"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditorDemo() {
  const [content, setContent] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Rich Text Editor Demo - Starting from Blank</CardTitle>
          <p className="text-sm text-muted-foreground">
            This shows how the editor looks when starting from scratch
          </p>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start typing your contest content here... Use the toolbar above to format your text!"
            className="min-h-[300px]"
          />
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">HTML Output:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
              {content || "No content yet..."}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
