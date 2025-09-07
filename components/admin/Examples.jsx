"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Examples({ moduleId }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [examples, setExamples] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newExample, setNewExample] = useState({ title: "", content: "" });

  // Fetch example groups
  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("example_groups")
      .select("*")
      .eq("module_id", moduleId);

    if (error) console.error(error);
    else setGroups(data);
  };

  // Fetch examples for selected group
  const fetchExamples = async (groupId) => {
    const { data, error } = await supabase
      .from("examples")
      .select("*")
      .eq("group_id", groupId);

    if (error) console.error(error);
    else setExamples(data);
  };

  useEffect(() => {
    fetchGroups();
  }, [moduleId]);

  useEffect(() => {
    if (selectedGroup) fetchExamples(selectedGroup.id);
  }, [selectedGroup]);

  // Add new group
  const handleAddGroup = async () => {
    if (!newGroupName) return;

    const { data, error } = await supabase
      .from("example_groups")
      .insert({ module_id: moduleId, name: newGroupName })
      .select()
      .single();

    if (error) console.error(error);
    else {
      setNewGroupName("");
      fetchGroups();
      setSelectedGroup(data); // auto-select the new group
    }
  };

  // Add new example
  const handleAddExample = async () => {
    if (!newExample.title) return;

    const { data, error } = await supabase
      .from("examples")
      .insert({ group_id: selectedGroup.id, ...newExample })
      .select()
      .single();

    if (error) console.error(error);
    else {
      setNewExample({ title: "", content: "" });
      fetchExamples(selectedGroup.id);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      <h2 className="text-xl font-bold">Example Groups</h2>

      {!selectedGroup ? (
        <div>
          {groups.length === 0 && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="New group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="border p-1 mr-2 rounded text-black"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddGroup}
              >
                Add Group
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {groups.map((group) => (
              <li
                key={group.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-700 hover:text-white"
                onClick={() => setSelectedGroup(group)}
              >
                {group.name}
              </li>
            ))}
          </ul>

          {groups.length > 0 && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="New group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="border p-1 mr-2 rounded text-black"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddGroup}
              >
                Add Group
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-300 underline"
            onClick={() => setSelectedGroup(null)}
          >
            ← Back to Groups
          </button>

          <h3 className="text-lg font-semibold mb-2">{selectedGroup.name}</h3>

          <div className="mb-4 border p-2 rounded">
            <h4 className="font-bold mb-1">Add New Example</h4>
            <input
              type="text"
              placeholder="Title"
              value={newExample.title}
              onChange={(e) =>
                setNewExample({ ...newExample, title: e.target.value })
              }
              className="border p-1 w-full mb-1 rounded text-black"
            />
            <textarea
              placeholder="Content"
              value={newExample.content}
              onChange={(e) =>
                setNewExample({ ...newExample, content: e.target.value })
              }
              className="border p-1 w-full mb-1 rounded text-black"
            />
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={handleAddExample}
            >
              Add Example
            </button>
          </div>

          {examples.length === 0 ? (
            <p>No examples found.</p>
          ) : (
            <ul className="space-y-4">
              {examples.map((ex) => (
                <li
                  key={ex.id}
                  className="p-3 border rounded hover:bg-gray-700 hover:text-white"
                >
                  <h4 className="font-bold">{ex.title}</h4>
                  <p>{ex.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
