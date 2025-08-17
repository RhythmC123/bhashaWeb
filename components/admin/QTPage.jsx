import React, { useState, useMemo } from "react";

/* --- Reusable visual preview component (your existing styled templates) --- */
function QuestionTemplate({ type, data }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
      {type === "mcq" && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">MCQ Question</h3>
          {data.image ? (
            <img
              src={data.image}
              alt="question"
              className="mb-4 w-full max-w-xs rounded-lg shadow-md"
            />
          ) : null}
          <p className="mb-4 text-gray-700">{data.question}</p>
          <ul className="space-y-2">
            {data.options.map((option, index) => (
              <li
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  option === data.correct ? "ring-2 ring-offset-2 ring-indigo-200" : ""
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        </>
      )}

      {type === "fillBlank" && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Fill in the Blank</h3>
          <p className="mb-4 text-gray-700">
            {data.question?.split("___").map((part, index, arr) =>
              index < arr.length - 1 ? (
                <span key={index} className="flex items-center space-x-2">
                  <span>{part}</span>
                  <input
                    type="text"
                    placeholder="..."
                    className="border-b-2 border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition-all"
                  />
                </span>
              ) : (
                part
              )
            )}
          </p>
        </>
      )}

      {type === "imageTranslation" && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Image Translation</h3>
          <img
            src={data.image}
            alt="Question"
            className="mb-4 w-full max-w-xs rounded-lg shadow-md"
          />
          <ul className="space-y-2">
            {data.options.map((option, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* --- Helper that creates an object matching the `public.mcq` table columns --- */
function makeMcqRow({ image, question, o1, o2, o3, o4, correct, module_id, language_id }) {
  // Keep nulls explicit if empty, parse module/language to numbers if provided
  return {
    image: image?.trim() || null,
    question: question?.trim() || null,
    o1: o1?.trim() || null,
    o2: o2?.trim() || null,
    o3: o3?.trim() || null,
    o4: o4?.trim() || null,
    correct: correct?.trim() || null,
    module_id: module_id ? Number(module_id) : null,
    language_id: language_id ? Number(language_id) : null,
  };
}

/* --- Main page component with template selector, form, preview and save --- */
export default function QTPage() {
  const [type, setType] = useState("mcq"); // 'mcq' | 'fillBlank' | 'imageTranslation'

  /* MCQ form fields (maps to DB) */
  const [mcq, setMcq] = useState({
    image: "",
    question: "",
    o1: "",
    o2: "",
    o3: "",
    o4: "",
    correct: "", // should equal one of o1..o4
    module_id: "",
    language_id: "",
  });

  /* Simple fillBlank & imageTranslation quick state so preview works */
  const [fillBlank, setFillBlank] = useState({ sentence: "React is a ___ library for building UIs.", correct: "JavaScript" });
  const [imageTranslation, setImageTranslation] = useState({
    image: "https://via.placeholder.com/300",
    options: ["Cat", "Dog", "Bird", "Fish"],
    correct: "Cat",
  });

  /* Derived data for preview to reuse QuestionTemplate */
  const mcqPreviewData = useMemo(
    () => ({
      image: mcq.image,
      question: mcq.question || "Your question preview will appear here.",
      options: [mcq.o1 || "Option 1", mcq.o2 || "Option 2", mcq.o3 || "Option 3", mcq.o4 || "Option 4"],
      correct: mcq.correct,
    }),
    [mcq]
  );

  /* Validation (basic) */
  function validateMcq() {
    const opts = [mcq.o1, mcq.o2, mcq.o3, mcq.o4].map((s) => s?.trim() || "");
    if (!mcq.question?.trim()) return { ok: false, error: "Question text is required." };
    if (opts.some((o) => !o)) return { ok: false, error: "All 4 options must be filled." };
    if (!mcq.correct?.trim()) return { ok: false, error: "Correct answer must be selected." };
    if (!opts.includes(mcq.correct.trim())) return { ok: false, error: "Correct answer must match one of the options." };
    return { ok: true };
  }

  /* Example save handler - calls your API endpoint to insert into DB (adjust URL & auth) */
  async function handleSaveMcq(e) {
    e.preventDefault();
    const v = validateMcq();
    if (!v.ok) {
      alert(v.error);
      return;
    }
    const payload = makeMcqRow(mcq);

    try {
      // Replace '/api/mcq' with your real backend endpoint that inserts into public.mcq
      const res = await fetch("/api/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }
      const saved = await res.json();
      alert("Saved! id: " + (saved.id ?? "unknown"));
      // optional: reset or update state
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Question Templates</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Template</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg shadow-sm border focus:ring-2 focus:ring-indigo-200"
            >
              <option value="mcq">MCQ</option>
              <option value="fillBlank">Fill in the Blank</option>
              <option value="imageTranslation">Image Translation</option>
            </select>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Editor / Form */}
          <div>
            {type === "mcq" && (
              <form onSubmit={handleSaveMcq} className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-4">Create MCQ (DB fields)</h3>

                <label className="block text-sm text-gray-600 mt-2">Image URL (image)</label>
                <input
                  value={mcq.image}
                  onChange={(e) => setMcq((s) => ({ ...s, image: e.target.value }))}
                  className="mt-1 w-full rounded-md p-2 border"
                  placeholder="https://..."
                />

                <label className="block text-sm text-gray-600 mt-4">Question (question)</label>
                <textarea
                  value={mcq.question}
                  onChange={(e) => setMcq((s) => ({ ...s, question: e.target.value }))}
                  className="mt-1 w-full rounded-md p-2 border"
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-sm text-gray-600">Option 1 (o1)</label>
                    <input
                      value={mcq.o1}
                      onChange={(e) => setMcq((s) => ({ ...s, o1: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Option 2 (o2)</label>
                    <input
                      value={mcq.o2}
                      onChange={(e) => setMcq((s) => ({ ...s, o2: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Option 3 (o3)</label>
                    <input
                      value={mcq.o3}
                      onChange={(e) => setMcq((s) => ({ ...s, o3: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Option 4 (o4)</label>
                    <input
                      value={mcq.o4}
                      onChange={(e) => setMcq((s) => ({ ...s, o4: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                    />
                  </div>
                </div>

                <label className="block text-sm text-gray-600 mt-4">Correct (correct)</label>
                <select
                  value={mcq.correct}
                  onChange={(e) => setMcq((s) => ({ ...s, correct: e.target.value }))}
                  className="mt-1 w-full rounded-md p-2 border"
                >
                  <option value="">-- choose correct option --</option>
                  <option value={mcq.o1}>{mcq.o1 || "Option 1"}</option>
                  <option value={mcq.o2}>{mcq.o2 || "Option 2"}</option>
                  <option value={mcq.o3}>{mcq.o3 || "Option 3"}</option>
                  <option value={mcq.o4}>{mcq.o4 || "Option 4"}</option>
                </select>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-sm text-gray-600">Module ID (module_id)</label>
                    <input
                      value={mcq.module_id}
                      onChange={(e) => setMcq((s) => ({ ...s, module_id: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Language ID (language_id)</label>
                    <input
                      value={mcq.language_id}
                      onChange={(e) => setMcq((s) => ({ ...s, language_id: e.target.value }))}
                      className="mt-1 w-full rounded-md p-2 border"
                      placeholder="e.g. 1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  >
                    Save MCQ
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMcq({
                        image: "",
                        question: "",
                        o1: "",
                        o2: "",
                        o3: "",
                        o4: "",
                        correct: "",
                        module_id: "",
                        language_id: "",
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            {type === "fillBlank" && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-4">Fill in the Blank Editor</h3>
                <textarea
                  value={fillBlank.sentence}
                  onChange={(e) => setFillBlank((s) => ({ ...s, sentence: e.target.value }))}
                  className="mt-1 w-full rounded-md p-2 border"
                  rows={3}
                />
                <label className="text-sm text-gray-600 mt-3">Answer</label>
                <input
                  value={fillBlank.correct}
                  onChange={(e) => setFillBlank((s) => ({ ...s, correct: e.target.value }))}
                  className="mt-1 w-full rounded-md p-2 border"
                />
              </div>
            )}

            {type === "imageTranslation" && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-4">Image Translation Editor</h3>
                <label className="text-sm text-gray-600">Image URL</label>
                <input
                  value={imageTranslation.image}
                  onChange={(e) =>
                    setImageTranslation((s) => ({ ...s, image: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md p-2 border"
                />
                <label className="text-sm text-gray-600 mt-3">Options (comma separated)</label>
                <input
                  value={imageTranslation.options.join(", ")}
                  onChange={(e) =>
                    setImageTranslation((s) => ({ ...s, options: e.target.value.split(",").map(x => x.trim()) }))
                  }
                  className="mt-1 w-full rounded-md p-2 border"
                />
                <label className="text-sm text-gray-600 mt-3">Correct</label>
                <input
                  value={imageTranslation.correct}
                  onChange={(e) =>
                    setImageTranslation((s) => ({ ...s, correct: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md p-2 border"
                />
              </div>
            )}
          </div>

          {/* RIGHT: Preview */}
          <div>
            <div className="sticky top-8">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Preview</h4>

              {type === "mcq" && (
                <QuestionTemplate type="mcq" data={mcqPreviewData} />
              )}

              {type === "fillBlank" && (
                <QuestionTemplate type="fillBlank" data={fillBlank} />
              )}

              {type === "imageTranslation" && (
                <QuestionTemplate type="imageTranslation" data={imageTranslation} />
              )}

              {/* Quick debug: show DB-ready object */}
              {type === "mcq" && (
                <div className="mt-4 bg-white p-4 rounded-lg text-sm text-gray-700 shadow">
                  <div className="font-medium mb-2">DB payload (preview)</div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(makeMcqRow(mcq), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
