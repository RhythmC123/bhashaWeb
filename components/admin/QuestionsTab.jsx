import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddQuestion from "./AddQ";
import supabase from "@/lib/supabaseClient";

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Questions for {selectedModule.title}
        </h2>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2 text-black"
        >
          <option value="all">All Types</option>
          <option value="mcq">MCQ</option>
          <option value="fill_in_blank">Fill in the Blank</option>
        </select>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions found for this module.</p>
      ) : (
        <div className="space-y-4">
          {questions
            .filter((q) => filterType === "all" || q.type === filterType)
            .map((q, idx) => (
              <Card key={idx} className="p-4 flex justify-between items-start">
                {editingQuestion?.id === q.id ? (
                  <div className="w-full space-y-2">
                    <p>Question</p>
                    {/* Question */}
                    <Input
                      className="mb-2"
                      value={editingQuestion.question}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          question: e.target.value,
                        })
                      }
                    />

                    {/* MCQ Options */}
                    {(q.type === "mcq") && (
                        
                      <div className="space-y-2">
                        <p>Options</p>
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

                        {/* Correct Answer */}
                        <p>Correct answer</p>
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

                        {/* Image Upload */}
                        {q.type === "mcq" && (
                          <div>
                            <p className="mt-2 font-semibold">Question Image</p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="mt-2 max-h-40"
                              />
                            ) : editingQuestion.image ? (
                              <img
                                src={editingQuestion.image}
                                alt="Current"
                                className="mt-2 max-h-40"
                              />
                            ) : <p>There is no image for this question</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fill in the Blank */}
                    {q.type === "fill_in_blank" && (
                      <Input
                        className="mt-2"
                        placeholder="Correct Answer"
                        value={editingQuestion.correct || ""}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            correct: e.target.value,
                          })
                        }
                      />
                    )}

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2 justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSaveEdit}
                      >
                        💾 Save
                      </Button>
                      <Button
                        className="bg-gray-500 hover:bg-gray-600"
                        onClick={() => setEditingQuestion(null)}
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Q{idx + 1} ({q.type})
                      </h3>
                      <p className="text-gray-700 mt-2">{q.question}</p>

                      {(q.type === "mcq" || q.type === "mcq_image") && (
                        <ul className="list-disc ml-6 mt-2">
                          {["o1", "o2", "o3", "o4"].map(
                            (key, i) => q[key] && <li key={i}>{q[key]}</li>
                          )}
                        </ul>
                      )}

                      {q.type === "mcq_image" && q.image && (
                        <img
                          src={q.image}
                          alt="Question"
                          className="mt-2 max-h-40"
                        />
                      )}

                      <p className="text-sm text-green-700 mt-2">
                        ✅ Correct Answer: {q.correct}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => setEditingQuestion(q)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteQuestion(q)}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
        </div>
      )}

      {/* Add Question */}
      <div className="mt-6 w-full flex">
        {showAddQ ? (
          <AddQuestion
            moduleId={selectedModule.id}
            languageId={selectedModule.language_id}
            onDone={() => setShowAddQ(false)}
          />
        ) : (
          <Button
            onClick={() => setShowAddQ(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            ➕ Add Question
          </Button>
        )}
      </div>

      {/* Refresh */}
      <Button
        onClick={async () => {
          setLoading(true);
          await fetchQuestions(selectedModule);
          setLoading(false);
        }}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Refreshing..." : "🔄 Refresh"}
      </Button>
    </div>
  );
}
