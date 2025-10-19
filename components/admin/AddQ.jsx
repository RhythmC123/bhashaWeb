"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AddQuestion({ moduleId, languageId, onDone }) {
  const [type, setType] = useState("mcq");
  const [form, setForm] = useState({
    question: "",
    o1: "",
    o2: "",
    o3: "",
    o4: "",
    correct: "",
    chapter_id: "",
    classification: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

    if (type === "mcq" || type === "mcq_image") {
      const { error: mcqError } = await supabase.from("mcq").insert([
        {
          question: form.question,
          o1: form.o1,
          o2: form.o2,
          o3: form.o3,
          o4: form.o4,
          correct: form.correct,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          type: type,
          image: imageUrl,
          chapter_id: form.chapter_id ? Number(form.chapter_id) : null,
          classification: form.classification || null,
        },
      ]);
      error = mcqError;
    } else if (type === "fill_in_blank") {
      const { error: fibError } = await supabase.from("fillblank").insert([
        {
          question: form.question,
          correct: form.correct,
          module_id: Number(moduleId),
          language_id: Number(languageId),
        },
      ]);
      error = fibError;
    } else if (type === "multi") {
      const correctAnswers = form.correct
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== "");
      const { error: multiError } = await supabase.from("multi").insert([
        {
          question: form.question,
          o1: form.o1,
          o2: form.o2,
          o3: form.o3,
          o4: form.o4,
          correct: correctAnswers,
          module_id: Number(moduleId),
          language_id: Number(languageId),
        },
      ]);
      error = multiError;
    }

    if (error) {
      alert("❌ Failed: " + error.message);
    } else {
      alert("✅ Question added!");
      setForm({ question: "", o1: "", o2: "", o3: "", o4: "", correct: "", chapter_id: "", classification: "" });
      setImageFile(null);
      setPreviewUrl(null);
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
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded p-2 text-black"
            >
              <option value="mcq">MCQ</option>
              <option value="mcq_image">MCQ with Image</option>
              <option value="fill_in_blank">Fill in the Blank</option>
              <option value="multi">Multiple Correct</option>
            </select>
          </div>

          {/* Question Field */}
          <div>
            <Label>Question</Label>
            <Textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              rows={3}
              placeholder="Enter your question..."
              required
            />
          </div>

          {/* Image Upload */}
          {type === "mcq_image" && (
            <div>
              <Label>Question Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-2 max-h-40" />
              )}
            </div>
          )}

          {/* MCQ + Multi Fields */}
          {(type === "mcq" || type === "mcq_image" || type === "multi") && (
            <>
              {["o1", "o2", "o3", "o4"].map((opt, idx) => (
                <div key={idx}>
                  <Label>Option {idx + 1}</Label>
                  <Input
                    type="text"
                    name={opt}
                    value={form[opt]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div>
                <Label>
                  Correct Answer{type === "multi" ? "s (comma separated)" : ""}
                </Label>
                <Input
                  type="text"
                  name="correct"
                  value={form.correct}
                  onChange={handleChange}
                  placeholder={
                    type === "multi"
                      ? "Enter correct answers separated by commas"
                      : "Enter the correct option text"
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Chapter ID (optional)</Label>
                  <Input
                    type="number"
                    name="chapter_id"
                    value={form.chapter_id}
                    onChange={handleChange}
                    placeholder="e.g., 12"
                  />
                </div>
                <div>
                  <Label>Classification (optional)</Label>
                  <Input
                    type="text"
                    name="classification"
                    value={form.classification}
                    onChange={handleChange}
                    placeholder="e.g., grammar, vocab, easy, hard"
                  />
                </div>
              </div>
            </>
          )}

          {/* Fill in the Blank */}
          {type === "fill_in_blank" && (
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
