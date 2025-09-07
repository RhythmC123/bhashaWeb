import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GroupBlocks from "./GroupBlocks";

export default function IntroGroups({ moduleId, languageId }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [moduleId]);

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("intro_groups")
      .select("*")
      .eq("module_id", moduleId)
      .order("id");

    if (error) console.error(error);
    else setGroups(data || []);
    setLoading(false);
  };

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) return alert("Enter a title!");
    const { error } = await supabase.from("intro_groups").insert([
      { module_id: moduleId, language_id: languageId, title: newGroupTitle },
    ]);
    if (error) {
      console.error(error);
      alert("❌ Failed to create group");
    } else {
      setNewGroupTitle("");
      setCreating(false);
      fetchGroups();
    }
  };

  return (
    <div className="space-y-4">
      {loading && <p>Loading...</p>}

      {/* Groups List */}
      {groups.map((group) => (
        <Card key={group.id} className="p-4">
          <CardContent>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <Button
                variant="outline"
                onClick={() =>
                  setExpandedGroupId(expandedGroupId === group.id ? null : group.id)
                }
              >
                {expandedGroupId === group.id ? "Collapse" : "Expand"}
              </Button>
            </div>

            {expandedGroupId === group.id && (
              <div className="mt-4">
                <GroupBlocks groupId={group.id} moduleId={moduleId} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Always show Add Group button */}
      {!creating ? (
        <Button
          onClick={() => setCreating(true)}
          className="bg-green-600 text-white"
        >
          + Add Intro Group
        </Button>
      ) : (
        <div className="border p-4 rounded bg-gray-50">
          <Input
            placeholder="Enter intro title..."
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button onClick={handleCreateGroup} className="bg-green-600 text-white">
              Save
            </Button>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
