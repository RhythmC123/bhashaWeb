import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function GroupBlocks({ groupId, moduleId }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingBlockType, setAddingBlockType] = useState(null);
  const [blockForm, setBlockForm] = useState({});

  useEffect(() => {
    fetchBlocks();
  }, [groupId]);

  const fetchBlocks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("intro_modules")
      .select("*")
      .eq("intro_group_id", groupId) // 🔑 you’ll need this column in intro_modules
      .order("position", { ascending: true });

    if (error) console.error(error);
    else setBlocks(data || []);
    setLoading(false);
  };

  const handleAddBlock = async () => {
    if (!addingBlockType) return;
    const position = blocks.length + 1;

    let newBlock = {
      module_id: moduleId,
      intro_group_id: groupId,
      block_type: addingBlockType,
      position,
    };

    if (addingBlockType === "text") {
      newBlock = { ...newBlock, title: blockForm.title, content: blockForm.content };
    } else {
      newBlock = {
        ...newBlock,
        title: blockForm.title,
        left_title: blockForm.left_title,
        left_content: blockForm.left_content,
        right_title: blockForm.right_title,
        right_text: blockForm.right_content,
      };
    }

    const { error } = await supabase.from("intro_modules").insert([newBlock]);
    if (error) console.error(error);
    else {
      setAddingBlockType(null);
      setBlockForm({});
      fetchBlocks();
    }
  };

  return (
    <div className="space-y-4">
      {loading && <p>Loading blocks...</p>}

      {blocks.map((block) =>
        block.block_type === "text" ? (
          <Card key={block.id} className="p-4">
            <CardContent>
              <h4 className="font-semibold mb-2">{block.title}</h4>
              <p className="text-gray-800">{block.content}</p>
            </CardContent>
          </Card>
        ) : (
          <Card key={block.id} className="p-4">
            <CardContent>
              <h4 className="font-semibold mb-2">{block.title}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3 bg-orange-50">
                  <h5 className="font-bold">{block.left_title}</h5>
                  <p>{block.left_content}</p>
                </div>
                <div className="border rounded-lg p-3 bg-yellow-50">
                  <h5 className="font-bold">{block.right_title}</h5>
                  <p>{block.right_text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Add Block */}
      {!addingBlockType && (
        <div className="flex gap-2">
          <Button onClick={() => setAddingBlockType("text")}>➕ Add Text Block</Button>
          <Button onClick={() => setAddingBlockType("vs")}>➕ Add VS Block</Button>
        </div>
      )}

      {addingBlockType && (
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">
            Add {addingBlockType === "text" ? "Text Block" : "VS Block"}
          </h4>

          {addingBlockType === "text" ? (
            <>
              <Label>Title</Label>
              <Input
                value={blockForm.title || ""}
                onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                className="mb-2"
              />
              <Label>Content</Label>
              <Textarea
                value={blockForm.content || ""}
                onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                className="mb-2"
              />
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Left Title</Label>
                <Input
                  value={blockForm.left_title || ""}
                  onChange={(e) => setBlockForm({ ...blockForm, left_title: e.target.value })}
                  className="mb-2"
                />
                <Label>Left Content</Label>
                <Textarea
                  value={blockForm.left_content || ""}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, left_content: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Right Title</Label>
                <Input
                  value={blockForm.right_title || ""}
                  onChange={(e) => setBlockForm({ ...blockForm, right_title: e.target.value })}
                  className="mb-2"
                />
                <Label>Right Content</Label>
                <Textarea
                  value={blockForm.right_content || ""}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, right_content: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button onClick={handleAddBlock} className="bg-green-600 text-white">
              Save Block
            </Button>
            <Button variant="outline" onClick={() => setAddingBlockType(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
