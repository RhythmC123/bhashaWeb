import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddQuestion from "./AddQ";
import supabase from "@/lib/supabaseClient";
import { Plus, Folder, HelpCircle, Edit3, Trash2 } from "lucide-react";

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

  // Fetch question groups
  useEffect(() => {
    if (selectedModule?.id) {
      fetchQuestionGroups();
    }
  }, [selectedModule]);

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
        language_id: 1, // You might want to get this from props
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
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
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

            {/* Questions List */}
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
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Question Modal */}
        {showAddQ && (
          <AddQuestion
            moduleId={selectedModule.id}
            onClose={() => setShowAddQ(false)}
            onSuccess={() => {
              setShowAddQ(false);
              fetchQuestions();
            }}
          />
        )}
      </div>
    </div>
  );
}