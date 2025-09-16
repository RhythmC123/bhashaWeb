"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/supabaseClient";
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Image as ImageIcon,
  Globe,
  Star,
  Eye,
  Upload
} from "lucide-react";

export default function Stories({ language, setBreadcrumb, setSelectedSection, setSelectedLanguage }) {
  const [stories, setStories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [newStory, setNewStory] = useState({
    language_id: language?.id || "",
    title: "",
    story: "",
    level: "",
    cover_img: "",
  });

  // Fetch languages & stories
  useEffect(() => {
    fetchLanguages();
    if (language?.id) {
      fetchStories(language.id);
      setNewStory((prev) => ({ ...prev, language_id: language.id }));
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

  // Fetch stories for a given language
  const fetchStories = async (langId) => {
    if (!langId) return;

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("language_id", Number(langId))
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setStories(data);
  };

  // Add a new story
  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!newStory.language_id) {
      alert("Please select a language.");
      return;
    }

    let coverImageUrl = newStory.cover_img;

    // If a new image is selected, upload it
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `story-cover-${Date.now()}.${fileExt}`;
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

      coverImageUrl = publicURL;
    }

    const { error } = await supabase.from("stories").insert([
      {
        ...newStory,
        language_id: Number(newStory.language_id),
        cover_img: coverImageUrl,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to add story: " + error.message);
    } else {
      alert("✅ Story added successfully!");
      setNewStory({
        language_id: language?.id || "",
        title: "",
        story: "",
        level: "",
        cover_img: "",
      });
      fetchStories(language.id);
      setAdding(false);
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  // Update story
  const handleUpdateStory = async (e) => {
    e.preventDefault();
    if (!editingStory) return;

    let coverImageUrl = editingStory.cover_img;

    // If a new image is selected, upload it
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `story-cover-${Date.now()}.${fileExt}`;
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

      coverImageUrl = publicURL;
    }

    const { error } = await supabase
      .from("stories")
      .update({
        ...editingStory,
        cover_img: coverImageUrl,
      })
      .eq("id", editingStory.id);

    if (error) {
      console.error(error);
      alert("Failed to update story: " + error.message);
    } else {
      alert("✅ Story updated successfully!");
      setEditingStory(null);
      fetchStories(language.id);
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  // Delete story
  const handleDeleteStory = async (storyId) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", storyId);

    if (error) {
      console.error(error);
      alert("❌ Could not delete story");
    } else {
      fetchStories(language.id);
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
      }
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Back navigation (simplified for tab context)
  const handleBack = () => {
    if (selectedStory) {
      setSelectedStory(null);
    }
  };

  // Filter stories based on search
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BookOpen className="text-purple-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {selectedStory ? selectedStory.title : 
                 language ? `${language.name} Stories` : "Stories"}
              </h1>
              <p className="text-gray-400 text-lg">
                {selectedStory ? "Story Details" : 
                 "Manage your language stories"}
              </p>
            </div>
          </div>
          
          {!selectedStory && (
            <Button
              onClick={() => setAdding(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Story
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search stories..."
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

        {/* Add/Edit Story Form */}
        {(adding || editingStory) && (
          <Card className="mb-8 bg-gray-800/50 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {editingStory ? "Edit Story" : "Add New Story"}
              </h2>
              <form onSubmit={editingStory ? handleUpdateStory : handleAddStory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Title</Label>
                    <Input
                      type="text"
                      placeholder="Story title"
                      value={editingStory ? editingStory.title : newStory.title}
                      onChange={(e) => editingStory ? 
                        setEditingStory({...editingStory, title: e.target.value}) :
                        setNewStory({ ...newStory, title: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Level</Label>
                    <select
                      value={editingStory ? editingStory.level : newStory.level}
                      onChange={(e) => editingStory ? 
                        setEditingStory({...editingStory, level: e.target.value}) :
                        setNewStory({ ...newStory, level: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-2 block">Story Content</Label>
                  <Textarea
                    placeholder="Write your story here..."
                    value={editingStory ? editingStory.story : newStory.story}
                    onChange={(e) => editingStory ? 
                      setEditingStory({...editingStory, story: e.target.value}) :
                      setNewStory({ ...newStory, story: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[200px]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Cover Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {(previewUrl || (editingStory && editingStory.cover_img)) && (
                    <div className="mt-4">
                      <img
                        src={previewUrl || editingStory.cover_img}
                        alt="Cover preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl"
                  >
                    {loading ? 'Saving...' : (editingStory ? 'Update Story' : 'Add Story')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (editingStory) {
                        setEditingStory(null);
                      } else {
                        setAdding(false);
                        setNewStory({
                          language_id: language?.id || "",
                          title: "",
                          story: "",
                          level: "",
                          cover_img: "",
                        });
                      }
                      setImageFile(null);
                      setPreviewUrl(null);
                    }}
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
        {!selectedStory ? (
          /* Stories List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story) => (
              <Card
                key={story.id}
                className="group bg-gray-800/50 border-gray-600 hover:border-purple-500/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer overflow-hidden"
                onClick={() => setSelectedStory(story)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <BookOpen className="text-purple-400" size={24} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStory(story);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStory(story.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {story.cover_img && (
                    <div className="mb-4">
                      <img
                        src={story.cover_img}
                        alt={story.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {story.story}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(story.level)}`}>
                        {story.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Story ID</span>
                      <span className="text-purple-400 font-semibold">#{story.id}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Click to view</span>
                      <Eye size={16} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State for Stories */}
            {filteredStories.length === 0 && (
              <Card className="col-span-full bg-gray-800/50 border-gray-600 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm ? 'No stories found' : 'No stories yet'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm 
                      ? `No stories match "${searchTerm}". Try a different search term.`
                      : 'Get started by adding your first story.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setAdding(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
                    >
                      <Plus size={20} className="mr-2" />
                      Add Your First Story
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Story Details */
          <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <BookOpen className="text-purple-400" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedStory.title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedStory.level)}`}>
                        {selectedStory.level}
                      </span>
                      <span className="text-gray-400">Story #{selectedStory.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingStory(selectedStory)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteStory(selectedStory.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {selectedStory.cover_img && (
                <div className="mb-6">
                  <img
                    src={selectedStory.cover_img}
                    alt={selectedStory.title}
                    className="w-full max-w-md h-64 object-cover rounded-lg mx-auto"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedStory.story}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
