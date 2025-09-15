import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionsTab from "./QuestionsTab";
import IntroBlocks from "./IntroBlocks";
import Structure from "./Structure";
import { Example } from "@react-three/drei";
import Examples from "./Examples";

export default function Courses({
  language,
  selectedModule,
  setSelectedModule,
  setBreadcrumb,
  setSelectedSection,
  setSelectedLanguage,
}) {
  const [modules, setModules] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [adding, setAdding] = useState(false);
  // selectedModule is lifted to parent to power breadcrumbs
  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedTab, setSelectedTab] = useState("structure");

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

  // Delete a question
  const handleDeleteQuestion = async (q) => {
    const { error } = await supabase
      .from(q.type === "mcq" ? "mcq" : "fillblank") // choose table
      .delete()
      .eq("id", q.id);

    if (error) {
      console.error(error);
      alert("❌ Failed to delete question: " + error.message);
    } else {
      alert("✅ Question deleted!");
      fetchQuestions(selectedModule);
    }
  };

  // Update a question
  const handleUpdateQuestion = async (q) => {
    const { error } = await supabase
      .from(q.type === "mcq" ? "mcq" : "fillblank")
      .update(q)
      .eq("id", q.id);

    if (error) {
      console.error(error);
      alert("❌ Failed to update question: " + error.message);
    } else {
      alert("✅ Question updated!");
      setEditingQuestion(null);
      fetchQuestions(selectedModule);
    }
  };

  // Fetch questions for a module from multiple tables
  const fetchQuestions = async (module) => {
    setQuestions([]);
    setSelectedModule(module);

    let results = [];

    // Fill in blank questions
    const { data: fib, error: fibError } = await supabase
      .from("fillblank")
      .select("*")
      .eq("module_id", module.id)
      .eq("language_id", module.language_id);

    if (fibError) console.error(fibError);
    else results.push(...fib.map((q) => ({ ...q, type: "fill_in_blank" })));

    // MCQ questions
    const { data: mcq, error: mcqError } = await supabase
      .from("mcq")
      .select("*")
      .eq("module_id", module.id)
      .eq("language_id", module.language_id);

    if (mcqError) console.error(mcqError);
    else results.push(...mcq.map((q) => ({ ...q, type: "mcq" })));

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
          {/* Tabs */}
          <div className="flex gap-4 border-b mb-4">
            {["structure", "intro", "examples", "questions"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`rounded-none border-b-2 ${
                  selectedTab === tab
                    ? "border-blue-600 font-bold"
                    : "border-transparent"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {selectedTab === "intro" && (
            <IntroBlocks moduleId={selectedModule.id} />
          )}


          {selectedTab === "examples" && (
            <Examples moduleId={selectedModule.id} />
          )}

          {selectedTab === "questions" && (
            <QuestionsTab
              selectedModule={selectedModule}
              questions={questions}
              filterType={filterType}
              setFilterType={setFilterType}
              editingQuestion={editingQuestion}
              setEditingQuestion={setEditingQuestion}
              handleUpdateQuestion={handleUpdateQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
              fetchQuestions={fetchQuestions}
            />
          )}

          {selectedTab === "structure" && (
            <Structure moduleId={selectedModule.id} setSelectedTab={setSelectedTab} />
          )}
        </>
      )}
    </div>
  );
}
