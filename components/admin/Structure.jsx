"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, title, type }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center border p-3 rounded bg-gray-100 shadow-sm cursor-move text-black w-full"
    >
      <span>{title}</span>
      <span className="text-xs text-gray-500">{type}</span>
    </div>
  );
}

export default function Structure({ moduleId, setSelectedTab }) {
  const [structure, setStructure] = useState([]);
  const [intros, setIntros] = useState([]);
  const [examples, setExamples] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchStructure();
    fetchSources();
  }, [moduleId]);

  const fetchStructure = async () => {
    const { data, error } = await supabase
      .from("module_structure")
      .select("*")
      .eq("module_id", moduleId)
      .order("position", { ascending: true });

    if (error) console.error(error);
    else setStructure(data || []);
  };

  const fetchSources = async () => {
    const { data: introData } = await supabase
      .from("intro_groups")
      .select("*")
      .eq("module_id", moduleId);

    const { data: exampleData } = await supabase
      .from("example_groups")
      .select("*")
      .eq("module_id", moduleId);

    const { data: questionData } = await supabase
      .from("question_groups")
      .select("*")
      .eq("module_id", moduleId);

    setIntros(introData || []);
    setExamples(exampleData || []);
    setQuestions(questionData || []);
  };

  // Drag-and-drop inside central structure
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = structure.findIndex((item) => item.id === active.id);
    const newIndex = structure.findIndex((item) => item.id === over.id);

    const newOrder = arrayMove(structure, oldIndex, newIndex);
    setStructure(newOrder);

    // Update positions in DB
    for (let i = 0; i < newOrder.length; i++) {
      await supabase
        .from("module_structure")
        .update({ position: i + 1 })
        .eq("id", newOrder[i].id);
    }
  };

  // Add item from source to central structure
  const handleAddToStructure = async (item, type) => {
    const { data, error } = await supabase
      .from("module_structure")
      .insert({
        module_id: moduleId,
        block_id: item.id,
        block_type: type,
        title: item.title || `Item #${item.id}`,
        position: structure.length + 1,
      })
      .select()
      .single();

    if (error) console.error(error);
    else setStructure([...structure, data]);
  };

  return (
    <div className="text-black">
      <h2 className="text-xl font-bold mb-4">Module Structure</h2>

      {/* Central drag-and-drop list */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={structure.map((s) => s.id)}>
              <div className="space-y-2">
                {structure.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    type={item.block_type}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Source columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Intro */}
        <div>
          <h3 className="font-semibold mb-2">Intro Groups</h3>
          <div className="space-y-2">
            {intros.map((intro) => (
              <div
                key={intro.id}
                className="p-3 border rounded bg-orange-700 hover:bg-orange-600 text-white cursor-pointer"
                onClick={() => handleAddToStructure(intro, "Intro")}
              >
                {intro.title}
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="font-semibold mb-2">Example Groups</h3>
          <div className="space-y-2">
            {examples.map((ex) => (
              <div
                key={ex.id}
                className="p-3 border rounded bg-blue-700 hover:bg-blue-600 text-white cursor-pointer"
                onClick={() => handleAddToStructure(ex, "Example")}
              >
                {ex.title}
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div>
          <h3 className="font-semibold mb-2">Question Bank</h3>
          <div className="space-y-2">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-3 border rounded bg-green-700 hover:bg-green-600 text-white cursor-pointer"
                onClick={() => handleAddToStructure(q, "Question")}
              >
                {q.title || `Question Set #${q.id}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
