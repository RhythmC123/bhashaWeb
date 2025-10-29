import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionsTab from "./QuestionsTab";
import IntroBlocks from "./IntroBlocks";
import Structure from "./Structure";
import Examples from "./Examples";
import Stories from "./Stories";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Globe,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";

export default function Courses({
  language,
  selectedModule,
  setSelectedModule,
  setBreadcrumb,
  setSelectedSection,
  setSelectedLanguage,
}) {
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedTab, setSelectedTab] = useState("structure");

  const [newModule, setNewModule] = useState({
    language_id: language?.id || "",
    title: "",
    description: "",
    module_number: "",
  });

  // Fetch languages & chapters
  useEffect(() => {
    fetchLanguages();
    if (language?.id) {
      fetchChapters(language.id);
      setNewModule((prev) => ({ ...prev, language_id: language.id }));
    }
  }, [language]);

  // Refetch modules when selected chapter changes
  useEffect(() => {
    if (language?.id && selectedChapter?.chapter_id != null) {
      fetchModules(language.id, selectedChapter.chapter_id);
    } else {
      setModules([]);
    }
  }, [selectedChapter]);

  // Fetch all languages
  const fetchLanguages = async () => {
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("id");
    if (error) console.error(error);
    else setLanguages(data);
  };

  // Fetch chapters for a given language
  const fetchChapters = async (langId) => {
    if (!langId) return;

    const { data, error } = await supabase
      .from("chapter")
      .select("*")
      .eq("language_id", Number(langId))
      .order("chapter_id", { ascending: true });

    if (error) console.error(error);
    else setChapters(data || []);
  };

  // Fetch modules for a given language, optionally filtered by chapter
  const fetchModules = async (langId, chapterId) => {
    if (!langId) return;

    let query = supabase
      .from("modules")
      .select("*")
      .eq("language_id", Number(langId))
      .order("module_number", { ascending: true });

    if (chapterId != null) {
      query = query.eq("chapter_id", Number(chapterId));
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setModules(data || []);
  };

  // Compute the next module number for the current language
  const getNextModuleNumber = () => {
    if (!modules || modules.length === 0) return 1;
    const existingNumbers = modules
      .map((m) => Number(m.module_number) || 0)
      .filter((n) => Number.isFinite(n));
    const maxNum = existingNumbers.length ? Math.max(...existingNumbers) : 0;
    return maxNum + 1;
  };

  // Add a new module
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModule.language_id) {
      alert("Please select a language.");
      return;
    }
    if (!selectedChapter || selectedChapter.chapter_id == null) {
      alert("Please select a chapter first.");
      return;
    }

    // Auto-assign module_number if not provided
    const finalModuleNumber = newModule.module_number
      ? Number(newModule.module_number)
      : getNextModuleNumber();

    const { error } = await supabase.from("modules").insert([
      {
        ...newModule,
        language_id: Number(newModule.language_id),
        module_number: Number(finalModuleNumber),
        chapter_id: Number(selectedChapter.chapter_id),
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
      fetchModules(language.id, selectedChapter.chapter_id);
      setAdding(false);
    }
  };

  // Sync module_number to equal the module id (ensures stable order by ID)
  const handleSyncModuleNumbers = async () => {
    if (!language?.id) return;
    const { data: mods, error } = await supabase
      .from("modules")
      .select("id")
      .eq("language_id", Number(language.id))
      .order("id", { ascending: true });
    if (error) {
      console.error(error);
      alert("Failed to fetch modules for sync");
      return;
    }
    // Update each module's module_number to equal its id
    for (const m of mods || []) {
      const { error: upErr } = await supabase
        .from("modules")
        .update({ module_number: m.id })
        .eq("id", m.id);
      if (upErr) {
        console.error(upErr);
        alert("Failed during sync at module id " + m.id);
        return;
      }
    }
    await fetchModules(language.id);
    alert("✅ Module numbers synced to match module IDs");
  };

  // Delete a question
  const handleDeleteQuestion = async (q) => {
    let tableName;
    switch (q.type) {
      case "mcq":
      case "multimcq":
        tableName = "mcq";
        break;
      case "fill_in_blank":
        tableName = "fillblank";
        break;
      case "match":
        tableName = "match";
        break;
      case "rearrange":
        tableName = "rearrange";
        break;
      case "translate":
        tableName = "Translate";
        break;
      case "binary":
        tableName = "binary";
        break;
      case "bins":
        tableName = "bins";
        break;
      default:
        alert("❌ Unknown question type, cannot delete.");
        return;
    }

    const { error } = await supabase
      .from(tableName)
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
    let tableName;
    switch (q.type) {
      case "mcq":
      case "multimcq":
        tableName = "mcq";
        break;
      case "fill_in_blank":
        tableName = "fillblank";
        break;
      case "match":
        tableName = "match";
        break;
      case "rearrange":
        tableName = "rearrange";
        break;
      case "translate":
        tableName = "Translate";
        break;
      case "binary":
        tableName = "binary";
        break;
      case "bins":
        tableName = "bins";
        break;
      default:
        alert("❌ Unknown question type, cannot update.");
        return;
    }

    const { error } = await supabase
      .from(tableName)
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

    // Match questions
    try {
      const { data: matchQs, error: matchErr } = await supabase
        .from("match")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!matchErr && matchQs) {
        results.push(
          ...matchQs.map((q) => ({ ...q, type: "match" }))
        );
      }
    } catch (e) {
      // ignore if table missing
    }

    // Rearrange questions
    try {
      const { data: rearrQs, error: rearrErr } = await supabase
        .from("rearrange")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!rearrErr && rearrQs) {
        results.push(
          ...rearrQs.map((q) => ({ ...q, type: "rearrange" }))
        );
      }
    } catch (e) {
      // ignore if table missing
    }

    // Translate questions
    try {
      const { data: transQs, error: transErr } = await supabase
        .from("Translate")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!transErr && transQs) {
        results.push(
          ...transQs.map((q) => ({ ...q, type: "translate" }))
        );
      }
    } catch (e) {
      // ignore if table missing
    }

    // Binary questions
    try {
      const { data: binQs, error: binErr } = await supabase
        .from("binary")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!binErr && binQs) {
        results.push(
          ...binQs.map((q) => ({ ...q, type: "binary" }))
        );
      }
    } catch (e) {
      // ignore if table missing
    }

    // Bins questions
    try {
      const { data: binsQs, error: binsErr } = await supabase
        .from("bins")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!binsErr && binsQs) {
        results.push(
          ...binsQs.map((q) => ({ ...q, type: "bins" }))
        );
      }
    } catch (e) {
      // ignore if table missing
    }

    // Multi-correct questions (optional table)
    try {
      const { data: multi, error: multiError } = await supabase
        .from("multi")
        .select("*")
        .eq("module_id", module.id)
        .eq("language_id", module.language_id);
      if (!multiError && multi) {
        results.push(...multi.map((q) => ({ ...q, type: "multi" })));
      }
    } catch (e) {
      // table may not exist; ignore
    }

    setQuestions(results);
  };

  // Back navigation
  const handleBack = () => {
    if (selectedModule) {
      setSelectedModule(null);
    } else if (selectedChapter) {
      setSelectedChapter(null);
      setModules([]);
    } else {
      setSelectedSection('languages');
      setSelectedLanguage(null);
      setSelectedModule(null);
      setSelectedChapter(null);
      setBreadcrumb([]);
    }
  };

  // Filter chapters/modules based on search
  const filteredChapters = chapters.filter((ch) =>
    (ch.chapter_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ch.chapter_id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <BookOpen className="text-orange-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {selectedModule
                  ? selectedModule.title
                  : selectedChapter
                    ? `${language?.name || ''} • Chapter ${selectedChapter.chapter_id}${selectedChapter.chapter_name ? `: ${selectedChapter.chapter_name}` : ''}`
                    : language
                      ? `${language.name} Chapters`
                      : "Chapters"}
              </h1>
              <p className="text-gray-400 text-lg">
                {selectedModule
                  ? "Module Details"
                  : selectedChapter
                    ? "Manage modules for this chapter"
                    : "Manage your chapters"}
              </p>
            </div>
          </div>
          
          {!selectedModule && selectedChapter && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setNewModule((prev) => ({
                    ...prev,
                    module_number: String(getNextModuleNumber()),
                  }));
                  setAdding(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={20} className="mr-2" />
                Add Module
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl"
          >
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Add Module Form */}
      {adding && (
        <Card className="mb-8 bg-gray-800/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Module</h2>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Module Number</Label>
                  <Input
                    type="number"
                    placeholder="1, 2, 3..."
                    value={newModule.module_number}
                    onChange={(e) => setNewModule({ ...newModule, module_number: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required={false}
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Title</Label>
                  <Input
                    type="text"
                    placeholder="Module title"
                    value={newModule.title}
                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block">Description</Label>
                <Input
                  type="text"
                  placeholder="Module description"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl"
                >
                  {loading ? 'Adding...' : 'Add Module'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setAdding(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content Area */}
      {!selectedModule && !selectedChapter && (
        /* Chapters List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChapters.map((ch) => (
            <Card
              key={ch.id}
              className="group bg-gray-800/50 border-gray-600 hover:border-orange-500/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden"
              onClick={() => setSelectedChapter(ch)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <BookOpen className="text-orange-400" size={24} />
                  </div>
                  <div className="text-sm text-gray-400">
                    Chapter ID: {ch.chapter_id}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {ch.chapter_name || `Chapter ${ch.chapter_id}`}
                </h3>
                
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Click to view modules</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State for Chapters */}
          {filteredChapters.length === 0 && (
            <Card className="col-span-full bg-gray-800/50 border-gray-600 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No chapters found' : 'No chapters yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `No chapters match "${searchTerm}". Try a different search term.`
                    : 'Create chapters in your database to organize modules.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!selectedModule && selectedChapter && (
        /* Modules List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="group bg-gray-800/50 border-gray-600 hover:border-orange-500/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden"
              onClick={() => fetchQuestions(module)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <BookOpen className="text-orange-400" size={24} />
                  </div>
                  <div className="text-sm text-gray-400">
                    Module #{module.module_number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {module.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Module ID</span>
                    <span className="text-orange-400 font-semibold">#{module.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-600">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Click to manage</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State for Modules */}
          {filteredModules.length === 0 && (
            <Card className="col-span-full bg-gray-800/50 border-gray-600 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No modules found' : 'No modules yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `No modules match "${searchTerm}". Try a different search term.`
                    : 'Get started by adding your first module.'
                  }
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setAdding(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Your First Module
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {selectedModule && (
        /* Module Details with Tabs */
        <div>
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-600 mb-6">
            {["structure", "intro", "examples", "questions", "stories"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`rounded-none border-b-2 px-6 py-3 ${
                  selectedTab === tab
                    ? "border-orange-500 text-orange-400 font-bold"
                    : "border-transparent text-gray-400 hover:text-white"
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
            <Structure moduleId={selectedModule.id} languageId={selectedModule.language_id} setSelectedTab={setSelectedTab} />
          )}

          {selectedTab === "stories" && (
            <Stories 
              language={language}
              setBreadcrumb={setBreadcrumb}
              setSelectedSection={setSelectedSection}
              setSelectedLanguage={setSelectedLanguage}
            />
          )}
        </div>
      )}
    </div>
  );
}
