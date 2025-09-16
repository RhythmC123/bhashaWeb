"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, GripVertical, BookOpen, Lightbulb, HelpCircle, FileText } from "lucide-react";

function SortableItem({ id, title, type }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Intro": return <BookOpen size={16} className="text-orange-500" />;
      case "Example": return <Lightbulb size={16} className="text-blue-500" />;
      case "Question": return <HelpCircle size={16} className="text-green-500" />;
      case "Story": return <FileText size={16} className="text-purple-500" />;
      default: return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Intro": return "border-orange-200 bg-orange-50";
      case "Example": return "border-blue-200 bg-blue-50";
      case "Question": return "border-green-200 bg-green-50";
      case "Story": return "border-purple-200 bg-purple-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 ${getTypeColor(type)} shadow-sm cursor-move hover:shadow-md transition-all duration-200 w-full`}
    >
      <GripVertical className="text-gray-400 cursor-grab" size={20} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {getTypeIcon(type)}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <span className="text-sm text-gray-600 capitalize">{type} Block</span>
      </div>
    </div>
  );
}

export default function Structure({ moduleId, setSelectedTab }) {
  const [structure, setStructure] = useState([]);
  const [intros, setIntros] = useState([]);
  const [examples, setExamples] = useState([]);
  const [questionGroups, setQuestionGroups] = useState([]);
  const [stories, setStories] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");

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

    const { data: questionGroupData } = await supabase
      .from("question_group")
      .select("*")
      .eq("module_id", moduleId);

    const { data: storiesData } = await supabase
      .from("stories")
      .select("*")
      .eq("module_id", moduleId);

    setIntros(introData || []);
    setExamples(exampleData || []);
    setQuestionGroups(questionGroupData || []);
    setStories(storiesData || []);
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

  // Add new question group
  const handleAddQuestionGroup = async (e) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    const { data, error } = await supabase
      .from("question_group")
      .insert({
        module_id: moduleId,
        language_id: 1, // You might want to get this from props
        title: newGroupTitle,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Failed to create question group");
    } else {
      setQuestionGroups([...questionGroups, data]);
      setNewGroupTitle("");
      setShowAddGroup(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Module Structure</h2>
          <p className="text-gray-600">Drag and drop blocks to organize your module content</p>
        </div>

        {/* Central drag-and-drop list */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Module Structure</h3>
              <p className="text-sm text-gray-600">Drag items to reorder your module content</p>
            </div>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={structure.map((s) => s.id)}>
                <div className="space-y-3 min-h-[200px]">
                  {structure.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No content blocks yet. Add some from the sections below.</p>
                    </div>
                  ) : (
                    structure.map((item) => (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        type={item.block_type}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* Source columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Intro Groups */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-orange-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Intro Groups</h3>
              </div>
              <div className="space-y-2">
                {intros.length === 0 ? (
                  <p className="text-gray-500 text-sm">No intro groups available</p>
                ) : (
                  intros.map((intro) => (
                    <div
                      key={intro.id}
                      className="p-3 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 cursor-pointer transition-all duration-200"
                      onClick={() => handleAddToStructure(intro, "Intro")}
                    >
                      <div className="font-medium text-gray-900">{intro.title}</div>
                      <div className="text-sm text-gray-600">Intro Group</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Example Groups */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-blue-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Example Groups</h3>
              </div>
              <div className="space-y-2">
                {examples.length === 0 ? (
                  <p className="text-gray-500 text-sm">No example groups available</p>
                ) : (
                  examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-all duration-200"
                      onClick={() => handleAddToStructure(ex, "Example")}
                    >
                      <div className="font-medium text-gray-900">{ex.name}</div>
                      <div className="text-sm text-gray-600">Example Group</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Groups */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="text-green-500" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Question Groups</h3>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddGroup(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {/* Add Question Group Form */}
              {showAddGroup && (
                <form onSubmit={handleAddQuestionGroup} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">Group Title</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newGroupTitle}
                      onChange={(e) => setNewGroupTitle(e.target.value)}
                      placeholder="Enter group title"
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowAddGroup(false);
                        setNewGroupTitle("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {questionGroups.length === 0 ? (
                  <p className="text-gray-500 text-sm">No question groups available</p>
                ) : (
                  questionGroups.map((qg) => (
                    <div
                      key={qg.id}
                      className="p-3 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 cursor-pointer transition-all duration-200"
                      onClick={() => handleAddToStructure(qg, "Question")}
                    >
                      <div className="font-medium text-gray-900">{qg.title}</div>
                      <div className="text-sm text-gray-600">Question Group</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stories */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-purple-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Stories</h3>
              </div>
              <div className="space-y-2">
                {stories.length === 0 ? (
                  <p className="text-gray-500 text-sm">No stories available</p>
                ) : (
                  stories.map((story) => (
                    <div
                      key={story.id}
                      className="p-3 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 cursor-pointer transition-all duration-200"
                      onClick={() => handleAddToStructure(story, "Story")}
                    >
                      <div className="font-medium text-gray-900">{story.title}</div>
                      <div className="text-sm text-gray-600">Story - {story.level}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
