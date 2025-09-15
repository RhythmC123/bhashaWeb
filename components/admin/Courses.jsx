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
      fetchModules(language.id);
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

  // Back navigation
  const handleBack = () => {
    if (selectedModule) {
      setSelectedModule(null);
      setBreadcrumb([{ name: language.name, onClick: () => {
        setSelectedSection('languages');
        setSelectedLanguage(null);
        setSelectedModule(null);
        setBreadcrumb([]);
      }}]);
    } else {
      setSelectedSection('languages');
      setSelectedLanguage(null);
      setSelectedModule(null);
      setBreadcrumb([]);
    }
  };

  // Filter modules based on search
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
                {selectedModule ? selectedModule.title : 
                 language ? `${language.name} Modules` : "Modules"}
              </h1>
              <p className="text-gray-400 text-lg">
                {selectedModule ? "Module Details" : 
                 "Manage your course modules"}
              </p>
            </div>
          </div>
          
          {!selectedModule && (
            <Button
              onClick={() => setAdding(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Module
            </Button>
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
                    required
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
      {!selectedModule ? (
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
      ) : (
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
            <Structure moduleId={selectedModule.id} setSelectedTab={setSelectedTab} />
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
