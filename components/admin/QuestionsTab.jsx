import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddQuestion from "./AddQ";

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
                  // ------------------ EDIT MODE ------------------
                  <div className="w-full">
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

                    {q.type === "mcq" && (
                      <div className="space-y-2">
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
                      </div>
                    )}

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

                    <div className="mt-4 flex gap-2 justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateQuestion(editingQuestion)}
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
                  // ------------------ VIEW MODE ------------------
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Q{idx + 1} ({q.type})
                      </h3>
                      <p className="text-gray-700 mt-2">{q.question}</p>

                      {q.type === "mcq" && (
                        <ul className="list-disc ml-6 mt-2">
                          {["o1", "o2", "o3", "o4"].map(
                            (key, i) => q[key] && <li key={i}>{q[key]}</li>
                          )}
                        </ul>
                      )}

                      <p className="text-sm text-green-700 mt-2">
                        ✅ Correct Answer: {q.correct}
                      </p>
                    </div>

                    {/* Buttons aligned right */}
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
