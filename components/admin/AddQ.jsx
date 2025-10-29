"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AddQuestion({ moduleId, languageId, onDone, chapterId }) {
  const [type, setType] = useState("mcq");
  const [form, setForm] = useState({
    question: "",
    o1: "",
    o2: "",
    o3: "",
    o4: "",
    correct: "",
    options: "",
    side1: "",
    side2: "",
    classification: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCorrect, setSelectedCorrect] = useState([]); // stores codes like ["o1", "o3"]

  const allowedClassifications = [
    "modulepractice",
    "finalpractice",
    "example",
    "quizpractice",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = null;
    let imageUrl = null;

    // Upload image if present
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("mcq-images") // make sure you created this bucket
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("❌ Image upload failed: " + uploadError.message);
        return;
      }

      const { publicURL } = supabase.storage
        .from("mcq-images")
        .getPublicUrl(data.path);

      imageUrl = publicURL;
    }

    // Validate classification
    if (!form.classification || !allowedClassifications.includes(form.classification)) {
      alert("Please select a classification before saving.");
      return;
    }

    if (type === "mcq" || type === "mcq_image" || type === "multimcq") {
      // Build correct value from selected codes
      let correctValue = "";
      if (type === "multimcq") {
        if (!selectedCorrect.length) {
          alert("Select at least one correct option.");
          return;
        }
        correctValue = selectedCorrect.join(",");
      } else {
        if (selectedCorrect.length !== 1) {
          alert("Select the correct option.");
          return;
        }
        correctValue = selectedCorrect[0];
      }

      const { error: mcqError } = await supabase.from("mcq").insert([
        {
          question: form.question,
          o1: form.o1,
          o2: form.o2,
          o3: form.o3,
          o4: form.o4,
          correct: correctValue,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          type: type, // 'mcq', 'mcq_image', or 'multimcq'
          image: imageUrl,
          chapter_id: chapterId != null ? Number(chapterId) : null,
          classification: form.classification || null,
        },
      ]);
      error = mcqError;
    } else if (type === "fill_in_blank") {
      const { error: fibError } = await supabase.from("fillblank").insert([
        {
          question: form.question,
          correct: form.correct,
          options: form.options,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          classification: form.classification || null,
        },
      ]);
      error = fibError;
    } else if (type === "match") {
      // Basic validation for match
      if (!form.question.trim() || !form.side1.trim() || !form.side2.trim() || !form.correct.trim()) {
        alert("Please fill Heading, Side 1, Side 2, and Correct mappings.");
        return;
      }
      const { error: matchErr } = await supabase.from("match").insert([
        {
          image: imageUrl,
          Heading: form.question,
          side1: form.side1,
          side2: form.side2,
          correct: form.correct,
          module_id: Number(moduleId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          language_id: Number(languageId),
          type: "match",
          classification: form.classification || null,
        },
      ]);
      error = matchErr;
    }

    if (error) {
      alert("❌ Failed: " + error.message);
    } else {
      alert("✅ Question added!");
      setForm({ question: "", o1: "", o2: "", o3: "", o4: "", correct: "", options: "", side1: "", side2: "", classification: "" });
      setImageFile(null);
      setPreviewUrl(null);
      setSelectedCorrect([]);
      if (onDone) onDone();
    }
  };

  return (
    <div className="p-6 w-full">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Add Question</h2>

          {/* Select Question Type */}
          <div>
            <Label>Question Type</Label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSelectedCorrect([]);
                setForm({ ...form, correct: "" });
              }}
              className="w-full border rounded p-2 text-black"
            >
              <option value="mcq">MCQ</option>
              <option value="mcq_image">MCQ with Image</option>
              <option value="fill_in_blank">Fill in the Blank</option>
              <option value="match">Match</option>
              <option value="multimcq">Multiple Correct (MCQ)</option>
            </select>
          </div>

          {/* Question Field */}
          <div>
            <Label>{type === "match" ? "Heading" : "Question"}</Label>
            <Textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              rows={3}
              placeholder={type === "match" ? "Enter the main instruction/heading..." : "Enter your question..."}
              required
            />
          </div>

          {/* Classification (required for all types) */}
          <div>
            <Label>Classification</Label>
            <select
              name="classification"
              value={form.classification}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 text-black"
            >
              <option value="" disabled>
                Select classification
              </option>
              {allowedClassifications.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          {(type === "mcq_image" || type === "match") && (
            <div>
              <Label>Question Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-2 max-h-40" />
              )}
            </div>
          )}

          {/* MCQ + Multi-MCQ Fields */}
          {(type === "mcq" || type === "mcq_image" || type === "multimcq") && (
            <>
              {["o1", "o2", "o3", "o4"].map((opt, idx) => {
                const code = `o${idx + 1}`;
                const selected = selectedCorrect.includes(code);
                return (
                  <div key={idx} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label>Option {idx + 1}</Label>
                      <Input
                        type="text"
                        name={opt}
                        value={form[opt]}
                        onChange={handleChange}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        if (type === "multimcq") {
                          setSelectedCorrect((prev) =>
                            prev.includes(code)
                              ? prev.filter((c) => c !== code)
                              : [...prev, code]
                          );
                        } else {
                          setSelectedCorrect([code]);
                        }
                      }}
                      className={
                        `min-w-[120px] ${selected ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`
                      }
                    >
                      {selected ? "Selected" : "Mark Correct"}
                    </Button>
                  </div>
                );
              })}

              <div className="text-sm text-gray-700">
                Selected correct {type === "multimcq" ? "options" : "option"}: {selectedCorrect.length ? selectedCorrect.join(", ") : "None"}
              </div>
            </>
          )}

          {/* Fill in the Blank */}
          {type === "fill_in_blank" && (
            <>
              <div>
                <Label>Options (comma separated)</Label>
                <Input
                  type="text"
                  name="options"
                  value={form.options}
                  onChange={handleChange}
                  placeholder="e.g., option1, option2, option3"
                />
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Input
                  type="text"
                  name="correct"
                  value={form.correct}
                  onChange={handleChange}
                  placeholder="Enter correct word/phrase"
                />
              </div>
            </>
          )}

          {/* Match Type */}
          {type === "match" && (
            <>
              <div>
                <Label>Side 1 (left) - comma separated</Label>
                <Input
                  type="text"
                  name="side1"
                  value={form.side1}
                  onChange={handleChange}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div>
                <Label>Side 2 (right) - comma separated</Label>
                <Input
                  type="text"
                  name="side2"
                  value={form.side2}
                  onChange={handleChange}
                  placeholder="e.g., 1, 2, 3"
                />
              </div>
              <div>
                <Label>Correct mappings</Label>
                <Textarea
                  name="correct"
                  value={form.correct}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Format: left1=rightX, left2=rightY, ..."
                />
              </div>
            </>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
