import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddQuestion from "./AddQ";
import supabase from "@/lib/supabaseClient";
import { Plus, Folder, HelpCircle, Edit3, Trash2 } from "lucide-react";
// DnD removed per request

export default function QuestionsTab({
  selectedModule,
  questions,
  filterType,
  setFilterType,
  editingQuestion,
  setEditingQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  fetchQuestions,
}) {
  const [showAddQ, setShowAddQ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [questionGroups, setQuestionGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupItems, setGroupItems] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTargetQuestion, setAssignTargetQuestion] = useState(null);
  const [assignNewGroupTitle, setAssignNewGroupTitle] = useState("");
  const [mappingTable, setMappingTable] = useState(null); // "question_group_items" | "question_group_map"
  const addQuestionRef = useRef(null);

  // Fetch question groups
  useEffect(() => {
    if (selectedModule?.id) {
      fetchQuestionGroups();
    }
  }, [selectedModule]);

  // Smooth scroll to the Add Question area when opened
  useEffect(() => {
    if (showAddQ && addQuestionRef.current) {
      addQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddQ]);

  const fetchQuestionGroups = async () => {
    const { data, error } = await supabase
      .from("question_group")
      .select("*")
      .eq("module_id", selectedModule.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching question groups:", error);
    } else {
      setQuestionGroups(data || []);
    }
  };

  const resolveMappingTable = async () => {
    // Try preferred names in order
    const candidates = ["question_group_items", "question_group_map"];
    for (const tbl of candidates) {
      try {
        const { error } = await supabase.from(tbl).select("id").limit(1);
        if (!error) return tbl;
      } catch (e) {
        // try next
      }
    }
    return null;
  };

  const fetchGroupItems = async (groupId) => {
    try {
      const tableName = mappingTable || (await resolveMappingTable());
      if (!tableName) throw new Error("mapping table missing");
      setMappingTable(tableName);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("group_id", groupId)
        .order("position", { ascending: true });
      if (error) throw error;
      setGroupItems(data || []);
    } catch (err) {
      console.warn("question group mapping missing or error:", err?.message);
      setGroupItems([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Add new question group
  const handleAddQuestionGroup = async (e) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    const { data, error } = await supabase
      .from("question_group")
      .insert({
        module_id: selectedModule.id,
        language_id: Number(selectedModule.language_id),
        title: newGroupTitle,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating question group:", error);
      alert("Failed to create question group");
    } else {
      setQuestionGroups([...questionGroups, data]);
      setNewGroupTitle("");
      setShowAddGroup(false);
    }
  };

  // Update question group
  const handleUpdateQuestionGroup = async (e) => {
    e.preventDefault();
    if (!editingGroup || !editingGroup.title.trim()) return;

    const { error } = await supabase
      .from("question_group")
      .update({ title: editingGroup.title })
      .eq("id", editingGroup.id);

    if (error) {
      console.error("Error updating question group:", error);
      alert("Failed to update question group");
    } else {
      setQuestionGroups(questionGroups.map(g => 
        g.id === editingGroup.id ? { ...g, title: editingGroup.title } : g
      ));
      setEditingGroup(null);
    }
  };

  // Delete question group
  const handleDeleteQuestionGroup = async (groupId) => {
    if (!confirm("Are you sure you want to delete this question group?")) return;

    const { error } = await supabase
      .from("question_group")
      .delete()
      .eq("id", groupId);

    if (error) {
      console.error("Error deleting question group:", error);
      alert("Failed to delete question group");
    } else {
      setQuestionGroups(questionGroups.filter(g => g.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  useEffect(() => {
    if (selectedGroup?.id) fetchGroupItems(selectedGroup.id);
  }, [selectedGroup]);

  const groupedQuestionKeys = new Set(
    groupItems.map((gi) => `${gi.question_type}:${gi.question_id}`)
  );
  const ungrouped = questions.filter(
    (q) => !groupedQuestionKeys.has(`${q.type}:${q.id}`)
  );
  const grouped = groupItems
    .map((gi) => {
      const match = questions.find(
        (q) => q.id === gi.question_id && q.type === gi.question_type
      );
      return match ? { ...match, _groupItemId: gi.id } : null;
    })
    .filter(Boolean);

  const addToGroup = async ({ groupId, question }) => {
    try {
      const tableName = mappingTable || (await resolveMappingTable());
      if (!tableName) throw new Error("mapping table missing");
      setMappingTable(tableName);
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          group_id: groupId,
          question_type: question.type,
          question_id: question.id,
          position: (groupItems?.length || 0) + 1,
        })
        .select()
        .single();
      if (error) throw error;
      setGroupItems([...(groupItems || []), data]);
    } catch (err) {
      alert("Missing join table (question_group_items or question_group_map). Create it and refresh.");
    }
  };

  const removeFromGroup = async ({ groupItemId }) => {
    try {
      const tableName = mappingTable || (await resolveMappingTable());
      if (!tableName) throw new Error("mapping table missing");
      setMappingTable(tableName);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", groupItemId);
      if (error) throw error;
      setGroupItems((prev) => prev.filter((gi) => gi.id !== groupItemId));
    } catch (err) {
      // ignore
    }
  };

  // Assign modal helpers
  const openAssignModal = (q) => {
    setAssignTargetQuestion(q);
    setAssignModalOpen(true);
  };
  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setAssignTargetQuestion(null);
    setAssignNewGroupTitle("");
  };
  const assignToExistingGroup = async (groupId) => {
    if (!assignTargetQuestion) return;
    await addToGroup({ groupId, question: assignTargetQuestion });
    if (selectedGroup?.id === groupId) {
      fetchGroupItems(groupId);
    }
    closeAssignModal();
  };
  const createGroupAndAssign = async () => {
    const title = assignNewGroupTitle.trim();
    if (!title) return;
    const { data, error } = await supabase
      .from("question_group")
      .insert({
        module_id: selectedModule.id,
        language_id: Number(selectedModule.language_id),
        title,
      })
      .select()
      .single();
    if (error) {
      alert("Failed to create group");
      return;
    }
    setQuestionGroups([...questionGroups, data]);
    await assignToExistingGroup(data.id);
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion) return;

    let imageUrl = editingQuestion.image || null;

    // If a new image is selected, upload it
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("❌ Image upload failed: " + uploadError.message);
        return;
      }

      const { publicURL } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);

      imageUrl = publicURL;
    }

    // Call the original handleUpdateQuestion with updated image URL
    handleUpdateQuestion({ ...editingQuestion, image: imageUrl });
    setEditingQuestion(null);
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Questions for {selectedModule.title}
          </h2>
          <p className="text-gray-600">Organize and manage your question groups and individual questions</p>
        </div>

        {/* Question Groups Section */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Folder className="text-green-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Question Groups</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {questionGroups.length} groups
                </span>
              </div>
              <Button
                onClick={() => setShowAddGroup(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Group
              </Button>
            </div>

            {/* Add Group Form */}
            {showAddGroup && (
              <form onSubmit={handleAddQuestionGroup} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Group Title</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGroupTitle}
                    onChange={(e) => setNewGroupTitle(e.target.value)}
                    placeholder="Enter group title"
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Create
                  </Button>
                  <Button
                    type="button"
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

            {/* Question Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questionGroups.map((group) => (
                <Card
                  key={group.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedGroup?.id === group.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Folder className="text-green-500" size={20} />
                        <span className="font-medium text-gray-900">
                          {editingGroup?.id === group.id ? (
                            <form onSubmit={handleUpdateQuestionGroup} className="flex gap-2">
                              <Input
                                value={editingGroup.title}
                                onChange={(e) => setEditingGroup({...editingGroup, title: e.target.value})}
                                className="text-sm"
                                autoFocus
                              />
                              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                Save
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGroup(null)}
                              >
                                Cancel
                              </Button>
                            </form>
                          ) : (
                            group.title
                          )}
                        </span>
                      </div>
                      {editingGroup?.id !== group.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGroup(group);
                            }}
                            className="p-1 h-8 w-8"
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestionGroup(group.id);
                            }}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Click to view questions</p>
                  </CardContent>
                </Card>
              ))}

              {questionGroups.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Folder size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No question groups yet. Create your first group to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="bg-white shadow-lg h-[80vh]">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-blue-500" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedGroup ? `Questions in "${selectedGroup.title}"` : 'All Questions'}
                </h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {questions.length} questions
                </span>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="mcq">MCQ</option>
                  <option value="fill_in_blank">Fill in the Blank</option>
                  <option value="multi">Multiple Correct</option>
                </select>
                <Button
                  onClick={() => setShowAddQ(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {selectedGroup && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Questions in this group</h4>
                <div className="space-y-3 h-[360px] overflow-auto p-3 border rounded bg-white">
                  {grouped.map((q) => (
                    <div key={`grouped:${q.id}`} className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="text-xs text-green-700 mb-1 uppercase">{q.type}</div>
                      <div className="text-gray-900">{q.question}</div>
                    </div>
                  ))}
                  {grouped.length === 0 && (
                    <div className="text-sm text-gray-500">No questions assigned yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto">
              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No questions found for this module.</p>
                  <p className="text-sm mt-2">Add some questions to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions
                    .filter((q) => filterType === "all" || q.type === filterType)
                    .map((q, idx) => (
                      <Card key={idx} className="p-6 hover:shadow-md transition-shadow duration-200">
                      {editingQuestion?.id === q.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Question</Label>
                            <Input
                              value={editingQuestion.question}
                              onChange={(e) =>
                                setEditingQuestion({
                                  ...editingQuestion,
                                  question: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>

                          {/* MCQ Options */}
                          {q.type === "mcq" && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium text-gray-700">Options</Label>
                              {["o1", "o2", "o3", "o4"].map((key, i) => (
                                <Input
                                  key={i}
                                  placeholder={`Option ${i + 1}`}
                                  value={editingQuestion[key] || ""}
                                  onChange={(e) =>
                                    setEditingQuestion({
                                      ...editingQuestion,
                                      [key]: e.target.value,
                                    })
                                  }
                                />
                              ))}

                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Correct Answer</Label>
                                <Input
                                  placeholder="Correct Answer"
                                  value={editingQuestion.correct || ""}
                                  onChange={(e) =>
                                    setEditingQuestion({
                                      ...editingQuestion,
                                      correct: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* Image Upload */}
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Question Image</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="mt-2 w-32 h-32 object-cover rounded-lg border"
                                  />
                                ) : editingQuestion.image ? (
                                  <img
                                    src={editingQuestion.image}
                                    alt="Current"
                                    className="mt-2 w-32 h-32 object-cover rounded-lg border"
                                  />
                                ) : null}
                              </div>
                            </div>
                          )}

                          {/* Fill in the Blank */}
                          {q.type === "fill_in_blank" && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Answer</Label>
                              <Input
                                placeholder="Correct Answer"
                                value={editingQuestion.correct || ""}
                                onChange={(e) =>
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    correct: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}

                          {/* Extra MCQ metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Chapter ID</Label>
                              <Input
                                type="number"
                                value={editingQuestion.chapter_id ?? ''}
                                onChange={(e) => setEditingQuestion({ ...editingQuestion, chapter_id: e.target.value })}
                                placeholder="e.g., 12"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Classification</Label>
                              <Input
                                type="text"
                                value={editingQuestion.classification ?? ''}
                                onChange={(e) => setEditingQuestion({ ...editingQuestion, classification: e.target.value })}
                                placeholder="e.g., grammar, vocab, easy, hard"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Save Changes
                            </Button>
                            <Button
                              onClick={() => setEditingQuestion(null)}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {q.type === "mcq" ? "MCQ" : "Fill in the Blank"}
                              </span>
                              {q.image && (
                                <img
                                  src={q.image}
                                  alt="Question"
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              )}
                            </div>
                            
                            <p className="font-medium text-gray-900 mb-3 text-lg">{q.question}</p>
                            
                            {q.type === "mcq" && (
                              <div className="space-y-2">
                                {["o1", "o2", "o3", "o4"].map((key, i) => (
                                  <div key={i} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    {i + 1}. {q[key]}
                                  </div>
                                ))}
                                <div className="text-sm font-medium text-green-600 bg-green-50 p-2 rounded mt-3">
                                  ✓ Correct Answer: {q.correct}
                                </div>
                              </div>
                            )}
                            
                            {q.type === "fill_in_blank" && (
                              <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded">
                                ✓ Answer: {q.correct}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => setEditingQuestion(q)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteQuestion(q)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => openAssignModal(q)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Assign
                            </Button>
                          </div>
                        </div>
                      )}
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {assignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign Question</h3>
              <p className="text-sm text-gray-600 mb-4">Select a group to assign this question{assignTargetQuestion ? ` (ID #${assignTargetQuestion.id}, ${assignTargetQuestion.type})` : ''}.</p>
              <div className="space-y-2 max-h-56 overflow-auto border rounded p-2 mb-4">
                {questionGroups.length === 0 && (
                  <div className="text-sm text-gray-500 p-2">No groups yet. Create one below.</div>
                )}
                {questionGroups.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="text-gray-900">{g.title}</div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => assignToExistingGroup(g.id)}>
                      Assign here
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <Label className="text-sm text-gray-700">Create new group</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={assignNewGroupTitle} onChange={(e) => setAssignNewGroupTitle(e.target.value)} placeholder="New group title" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={createGroupAndAssign}>Create & Assign</Button>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={closeAssignModal}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Question Modal */}
        {showAddQ && (
          <div ref={addQuestionRef}>
            <AddQuestion
              moduleId={selectedModule.id}
              languageId={selectedModule.language_id}
              onDone={() => {
                setShowAddQ(false);
                fetchQuestions(selectedModule);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SortableQuestionItem({ id, className, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
      {children}
    </div>
  );
}

function DroppableList({ id, className, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className + (isOver ? " ring-2 ring-blue-400" : "")}>{children}</div>
  );
}

function GroupPreview({ groupId, allQuestions, onAdd }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("question_group_items")
          .select("*")
          .eq("group_id", groupId)
          .order("position", { ascending: true });
        if (error) throw error;
        if (!isMounted) return;
        const qs = (data || [])
          .map((gi) => allQuestions.find((q) => q.id === gi.question_id && q.type === gi.question_type))
          .filter(Boolean);
        setItems(qs);
      } catch (e) {
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [groupId, allQuestions]);

  if (loading) return <div className="p-3 text-sm text-gray-500">Loading…</div>;
  if (!items.length) return <div className="p-3 text-sm text-gray-500">No questions yet.</div>;

  return (
    <div className="p-3 space-y-2">
      {items.map((q) => (
        <div key={`${q.type}:${q.id}`} className="p-2 bg-gray-50 border rounded flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase">{q.type}</div>
            <div className="text-gray-900">{q.question}</div>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onAdd(q)}>
            Add to selected
          </Button>
        </div>
      ))}
    </div>
  );
}