import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Courses({
  language,
  setBreadcrumb,
  setSelectedSection,
  setSelectedLanguage,
}) {
  const [modules, setModules] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");


  const [newModule, setNewModule] = useState({
    language_id: language?.id || "",
    title: "",
    description: "",
    module_number: "",
  });

  // Fetch languages & modules
  useEffect(() => {
    fetchLanguages();
    if (language?.id) {
      fetchModules(language.id);
      setNewModule((prev) => ({ ...prev, language_id: language.id }));
    }
  }, [language]);

  // Fetch all languages
  const fetchLanguages = async () => {
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("id");
    if (error) console.error(error);
    else setLanguages(data);
  };

  // Fetch modules for a given language
  const fetchModules = async (langId) => {
    if (!langId) return;

    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("language_id", Number(langId))
      .order("module_number", { ascending: true });

    if (error) console.error(error);
    else setModules(data);
  };

  // Add a new module
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModule.language_id) {
      alert("Please select a language.");
      return;
    }

    const { error } = await supabase.from("modules").insert([
      {
        ...newModule,
        language_id: Number(newModule.language_id),
        module_number: Number(newModule.module_number),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to add module: " + error.message);
    } else {
      alert("✅ Module added successfully!");
      setNewModule({
        language_id: language?.id || "",
        title: "",
        description: "",
        module_number: "",
      });
      fetchModules(newModule.language_id);
      setAdding(false);
    }
  };

  // Fetch questions for a module from multiple tables
  const fetchQuestions = async (module) => {
    setQuestions([]);
    setSelectedModule(module);

    let results = [];

    // Example: Fill in blank questions
    const { data: fib, error: fibError } = await supabase
      .from("fillblank")
      .select("*")
      .eq("module_id", module.id)
      .eq("language_id", module.language_id);

    if (fibError) console.error(fibError);
    else
      results.push(
        ...fib.map((q) => ({ ...q, type: "fill_in_blank" }))
      );

    // Example: MCQ questions
    const { data: mcq, error: mcqError } = await supabase
      .from("mcq")
      .select("*")
      .eq("module_id", module.id)
      .eq("language_id", module.language_id);

    if (mcqError) console.error(mcqError);
    else
      results.push(
        ...mcq.map((q) => ({ ...q, type: "mcq" }))
      );

    // Add more tables (true/false, coding, etc.) similarly

    setQuestions(results);
  };

  return (
    <div className="p-6">
      {!selectedModule ? (
        <>
          {/* Module List */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {language ? `Modules for ${language.name}` : "Modules"}
            </h2>
            <Button onClick={() => setAdding((prev) => !prev)}>
              {adding ? "Cancel" : "➕ Add Module"}
            </Button>
          </div>

          {/* Add Module Form */}
          {adding && (
            <form
              onSubmit={handleAddModule}
              className="border rounded-lg text-black p-4 mb-6 bg-gray-50"
            >
              {!language && (
                <div className="mb-4">
                  <Label>Select Language</Label>
                  <select
                    value={newModule.language_id}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        language_id: e.target.value,
                      })
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="">-- Select a language --</option>
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <Label>Module Number</Label>
                <Input
                  type="number"
                  value={newModule.module_number}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      module_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({ ...newModule, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label>Description</Label>
                <Input
                  type="text"
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit">Save Module</Button>
            </form>
          )}

          {/* List of Modules */}
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <Card
                  key={mod.id}
                  className="overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition"
                  onClick={() => fetchQuestions(mod)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">
                      {mod.module_number}. {mod.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {mod.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Questions List */}
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
              <option value="fillblank">Fill in the Blank</option>
            </select>

            <Button onClick={() => setSelectedModule(null)}>⬅ Back</Button>
          </div>

          

          {questions.length === 0 ? (
            <p className="text-gray-500">No questions found for this module.</p>
          ) : (
            <div className="space-y-4">
              {questions
                .filter((q) => filterType === "all" || q.type === filterType)
                .map((q, idx) => (
                <Card key={idx} className="p-4">
                  <h3 className="font-semibold">
                    Q{idx + 1} ({q.type})
                  </h3>
                  <p className="text-gray-700 mt-2">{q.question}</p>

                  {q.type === "mcq" && (
                    <ul className="list-disc ml-6 mt-2">
                      {["o1", "o2", "o3", "o4"].map((key, i) =>
                        q[key] ? <li key={i}>{q[key]}</li> : null
                      )}
                    </ul>
                  )}


                  {q.type === "fill_in_blank" && (
                    <p className="text-sm text-gray-500 mt-2">
                      (User must fill in the missing part)
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() =>
                window.location.href = `/add-question?module_id=${selectedModule.id}&language_id=${selectedModule.language_id}`
              }
              className="bg-green-600 hover:bg-green-700"
            >
              ➕ Add Question
            </Button>
          </div>

        </>
      )}
    </div>
  );
}
