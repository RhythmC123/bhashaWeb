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
    heading: "",
    subheading: "",
    answer: "",
    o1: "",
    o2: "",
    o3: "",
    o4: "",
    correct: "",
    options: "",
    side1: "",
    side2: "",
    words: "",
    correct_order: "",
    selectedAnswer: "",
    bin_names: "",
    options_4_sepration: "",
    answers: "",
    classification: "modulepractice",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image1File, setImage1File] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
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

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1File(file);
      setImage1Preview(URL.createObjectURL(file));
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage2File(file);
      setImage2Preview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = null;
    let imageUrl = null;
    let image1Url = null;
    let image2Url = null;

    // Upload image if present (for match/translate)
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

    // Upload image1 if present (for binary)
    if (image1File) {
      const fileExt = image1File.name.split(".").pop();
      const fileName = `image1-${Date.now()}.${fileExt}`;
      const { data, error: uploadError1 } = await supabase.storage
        .from("mcq-images")
        .upload(fileName, image1File);

      if (uploadError1) {
        alert("❌ Image1 upload failed: " + uploadError1.message);
        return;
      }

      const { publicURL: publicURL1 } = supabase.storage
        .from("mcq-images")
        .getPublicUrl(data.path);

      image1Url = publicURL1;
    }

    // Upload image2 if present (for binary)
    if (image2File) {
      const fileExt = image2File.name.split(".").pop();
      const fileName = `image2-${Date.now()}.${fileExt}`;
      const { data, error: uploadError2 } = await supabase.storage
        .from("mcq-images")
        .upload(fileName, image2File);

      if (uploadError2) {
        alert("❌ Image2 upload failed: " + uploadError2.message);
        return;
      }

      const { publicURL: publicURL2 } = supabase.storage
        .from("mcq-images")
        .getPublicUrl(data.path);

      image2Url = publicURL2;
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
    } else if (type === "rearrange") {
      if (!form.words.trim() || !form.correct_order.trim()) {
        alert("Please fill Words and Correct Order for rearrange.");
        return;
      }
      const { error: rearrErr } = await supabase.from("rearrange").insert([
        {
          words: form.words,
          correct_order: form.correct_order,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          type: "rearrange",
          classification: form.classification || null,
        },
      ]);
      error = rearrErr;
    } else if (type === "translate") {
      if (!form.heading.trim() || !form.question.trim() || !form.answer.trim()) {
        alert("Please fill Heading, Question, and Answer for translate.");
        return;
      }
      const { error: transErr } = await supabase.from("Translate").insert([
        {
          heading: form.heading,
          subheading: form.subheading,
          question: form.question,
          answer: form.answer,
          image: imageUrl,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          type: "translate",
          classification: form.classification || null,
        },
      ]);
      error = transErr;
    } else if (type === "binary") {
      if (!form.o1.trim() || !form.o2.trim() || !form.selectedAnswer) {
        alert("Please fill o1, o2, and select the correct answer for binary.");
        return;
      }
      const answerText = form.selectedAnswer === "o1" ? form.o1 : form.o2;
      const { error: binaryErr } = await supabase.from("binary").insert([
        {
          o1: form.o1,
          o2: form.o2,
          answer: answerText,
          image1: image1Url,
          image2: image2Url,
          Heading: form.question, // using question as heading
          Subheading: form.subheading,
          module_id: Number(moduleId),
          language_id: Number(languageId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          type: "binary",
          classification: form.classification || null,
        },
      ]);
      error = binaryErr;
    } else if (type === "bins") {
      if (!form.bin_names.trim() || !form.options_4_sepration.trim() || !form.answers.trim()) {
        alert("Please fill Bin Names, Options, and Answers for bins.");
        return;
      }
      const { error: binsErr } = await supabase.from("bins").insert([
        {
          bin_names: form.bin_names,
          options_4_sepration: form.options_4_sepration,
          answers: form.answers,
          Heading: form.question, // using question as heading
          module_id: Number(moduleId),
          language_id: Number(languageId),
          chapter_id: chapterId != null ? Number(chapterId) : null,
          type: "bins",
          classification: form.classification || null,
        },
      ]);
      error = binsErr;
    }

    if (error) {
      alert("❌ Failed: " + error.message);
    } else {
      alert("✅ Question added!");
      setForm({ question: "", heading: "", subheading: "", answer: "", o1: "", o2: "", o3: "", o4: "", correct: "", options: "", side1: "", side2: "", words: "", correct_order: "", selectedAnswer: "", bin_names: "", options_4_sepration: "", answers: "", classification: "modulepractice" });
      setImageFile(null);
      setPreviewUrl(null);
      setImage1File(null);
      setImage1Preview(null);
      setImage2File(null);
      setImage2Preview(null);
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
                const newType = e.target.value;
                setType(newType);
                setSelectedCorrect([]);
                if (newType === "translate") {
                  setForm({ ...form, heading: "Type the Answer", correct: "", question: "", subheading: "", answer: "" });
                } else {
                  setForm({ ...form, correct: "" });
                }
              }}
              className="w-full border rounded p-2 text-black"
            >
              <option value="mcq">MCQ</option>
              <option value="mcq_image">MCQ with Image</option>
              <option value="fill_in_blank">Fill in the Blank</option>
              <option value="match">Match</option>
              <option value="rearrange">Rearrange</option>
              <option value="translate">Translate</option>
              <option value="binary">Binary Choice</option>
              <option value="bins">Bins</option>
              <option value="multimcq">Multiple Correct (MCQ)</option>
            </select>
          </div>

          {/* Question Field - hide for rearrange, translate, binary, and bins (these have their own) */}
          {type !== "rearrange" && type !== "translate" && type !== "binary" && type !== "bins" && (
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
          )}

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
          {(type === "mcq_image" || type === "match" || type === "translate") && (
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

          {/* Translate Type */}
          {type === "translate" && (
            <>
              <div>
                <Label>Heading</Label>
                <Input
                  type="text"
                  name="heading"
                  value={form.heading}
                  onChange={handleChange}
                  placeholder="Type the Answer"
                />
              </div>
              <div>
                <Label>Subheading</Label>
                <Input
                  type="text"
                  name="subheading"
                  value={form.subheading}
                  onChange={handleChange}
                  placeholder="e.g., Formal greeting"
                />
              </div>
              <div>
                <Label>Question</Label>
                <Textarea
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Type 'How are you?' in Telugu."
                />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., ఎలా ఉన్నారు?"
                />
              </div>
            </>
          )}

          {/* Binary Type */}
          {type === "binary" && (
            <>
              <div>
                <Label>Heading</Label>
                <Input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g., Choose the Correct Word"
                />
              </div>
              <div>
                <Label>Subheading</Label>
                <Input
                  type="text"
                  name="subheading"
                  value={form.subheading}
                  onChange={handleChange}
                  placeholder="e.g., Which means 'big'?"
                />
              </div>
              <div>
                <Label>Option 1</Label>
                <Input
                  type="text"
                  name="o1"
                  value={form.o1}
                  onChange={handleChange}
                  placeholder="e.g., పెద్ద (big)"
                />
              </div>
              <div>
                <Label>Option 2</Label>
                <Input
                  type="text"
                  name="o2"
                  value={form.o2}
                  onChange={handleChange}
                  placeholder="e.g., చిన్న (small)"
                />
              </div>
              <div>
                <Label>Correct Answer</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selectedAnswer"
                      value="o1"
                      checked={form.selectedAnswer === "o1"}
                      onChange={handleChange}
                    />
                    Option 1
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selectedAnswer"
                      value="o2"
                      checked={form.selectedAnswer === "o2"}
                      onChange={handleChange}
                    />
                    Option 2
                  </label>
                </div>
              </div>
              <div>
                <Label>Image 1 (optional)</Label>
                <Input type="file" accept="image/*" onChange={handleImage1Change} />
                {image1Preview && (
                  <img src={image1Preview} alt="Image 1 Preview" className="mt-2 max-h-40" />
                )}
              </div>
              <div>
                <Label>Image 2 (optional)</Label>
                <Input type="file" accept="image/*" onChange={handleImage2Change} />
                {image2Preview && (
                  <img src={image2Preview} alt="Image 2 Preview" className="mt-2 max-h-40" />
                )}
              </div>
            </>
          )}

          {/* Bins Type */}
          {type === "bins" && (
            <>
              <div>
                <Label>Heading</Label>
                <Input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g., Sort into Living (+) or Non-Living (-)"
                />
              </div>
              <div>
                <Label>Bin Names (comma separated)</Label>
                <Input
                  type="text"
                  name="bin_names"
                  value={form.bin_names}
                  onChange={handleChange}
                  placeholder="e.g., +Living Things, -Non-Living Things"
                />
              </div>
              <div>
                <Label>Options (comma separated with markers)</Label>
                <Textarea
                  name="options_4_sepration"
                  value={form.options_4_sepration}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., నాన్న(+), చెట్టు(+), పుస్తకం(-), బండి(-), పిల్లి(+), గది(-)"
                />
              </div>
              <div>
                <Label>Answers (formatted)</Label>
                <Textarea
                  name="answers"
                  value={form.answers}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., +Living Things=నాన్న(+), చెట్టు(+), పిల్లి(+); -Non-Living Things=పుస్తకం(-), బండి(-), గది(-)"
                />
              </div>
            </>
          )}

          {/* Rearrange Type */}
          {type === "rearrange" && (
            <>
              <div>
                <Label>Words (comma separated)</Label>
                <Textarea
                  name="words"
                  value={form.words}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., నేను, ఒక, విద్యార్థిని."
                />
              </div>
              <div>
                <Label>Correct Order (comma separated)</Label>
                <Textarea
                  name="correct_order"
                  value={form.correct_order}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., నేను, ఒక, విద్యార్థిని."
                />
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
