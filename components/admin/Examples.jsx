"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, Plus, Edit3, Trash2, ArrowLeft } from "lucide-react";

export default function Examples({ moduleId }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [examples, setExamples] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newExample, setNewExample] = useState({ title: "", content: "" });
  const [showAddGroup, setShowAddGroup] = useState(false);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("example_groups")
      .select("*")
      .eq("module_id", moduleId)
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setGroups(data || []);
  };

  const fetchExamples = async (groupId) => {
    const { data, error } = await supabase
      .from("examples")
      .select("*")
      .eq("group_id", groupId)
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setExamples(data || []);
  };

  useEffect(() => {
    fetchGroups();
  }, [moduleId]);

  useEffect(() => {
    if (selectedGroup?.id) fetchExamples(selectedGroup.id);
  }, [selectedGroup]);

  const handleAddGroup = async (e) => {
    e?.preventDefault?.();
    if (!newGroupName.trim()) return;
    const { data, error } = await supabase
      .from("example_groups")
      .insert({ module_id: moduleId, name: newGroupName.trim() })
      .select()
      .single();
    if (error) {
      console.error(error);
      alert("Failed to create example group");
    } else {
      setNewGroupName("");
      setSelectedGroup(data);
      fetchGroups();
    }
  };

  const handleAddExample = async (e) => {
    e?.preventDefault?.();
    if (!selectedGroup?.id || !newExample.title.trim()) return;
    const { error } = await supabase
      .from("examples")
      .insert({ group_id: selectedGroup.id, title: newExample.title.trim(), content: newExample.content });
    if (error) {
      console.error(error);
      alert("Failed to add example");
    } else {
      setNewExample({ title: "", content: "" });
      fetchExamples(selectedGroup.id);
    }
  };

  const handleDeleteExample = async (exampleId) => {
    const { error } = await supabase.from("examples").delete().eq("id", exampleId);
    if (error) alert("Failed to delete example");
    else fetchExamples(selectedGroup.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-blue-500" size={24} />
                <h2 className="text-2xl font-semibold text-gray-900">Example Groups</h2>
              </div>
              {!selectedGroup && (
                <Button onClick={() => setShowAddGroup(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={16} className="mr-2" />
                  New Group
                </Button>
              )}
            </div>

            {!selectedGroup ? (
              <div>
                {showAddGroup && (
                  <form onSubmit={handleAddGroup} className="mb-4 p-4 bg-gray-50 rounded-lg flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-sm text-gray-700">Group Name</Label>
                      <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Enter group name" />
                    </div>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddGroup(false)}>Cancel</Button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {groups.map((group) => (
                    <Card key={group.id} className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setSelectedGroup(group)}>
                      <CardContent className="p-4">
                        <div className="font-medium text-gray-900">{group.name}</div>
                        <div className="text-sm text-gray-600">Group ID: {group.id}</div>
                      </CardContent>
                    </Card>
                  ))}
                  {groups.length === 0 && (
                    <div className="text-gray-500">No example groups yet. Create one to get started.</div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Button variant="outline" className="mb-4" onClick={() => setSelectedGroup(null)}>
                  <ArrowLeft size={16} className="mr-2" /> Back to Groups
                </Button>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedGroup.name}</h3>

                <form onSubmit={handleAddExample} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-gray-700">Title</Label>
                      <Input value={newExample.title} onChange={(e) => setNewExample({ ...newExample, title: e.target.value })} placeholder="Example title" />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-700">Content</Label>
                      <Input value={newExample.content} onChange={(e) => setNewExample({ ...newExample, content: e.target.value })} placeholder="Explain the concept..." />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Example</Button>
                  </div>
                </form>

                <div className="space-y-3">
                  {examples.length === 0 ? (
                    <div className="text-gray-500">No examples yet.</div>
                  ) : (
                    examples.map((ex) => (
                      <Card key={ex.id} className="hover:shadow-sm">
                        <CardContent className="p-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-900">{ex.title}</div>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap">{ex.content}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => alert("Edit coming soon")}> <Edit3 size={14} /> </Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteExample(ex.id)}> <Trash2 size={14} /> </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
