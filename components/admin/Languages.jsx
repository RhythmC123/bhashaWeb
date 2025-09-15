import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Globe, 
  Users, 
  BookOpen, 
  Upload, 
  Search,
  Filter,
  MoreVertical,
  Check,
  X
} from 'lucide-react'

export default function Languages({ onSelectLanguage }) {
  const [languages, setLanguages] = useState([])
  const [newName, setNewName] = useState('')
  const [newFile, setNewFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [languageStats, setLanguageStats] = useState({})

  // Fetch languages from Supabase
  useEffect(() => {
    fetchLanguages()
    fetchLanguageStats()
  }, [])

  const fetchLanguages = async () => {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setLanguages(data)
    }
  }

  const fetchLanguageStats = async () => {
    try {
      // Fetch module counts for each language
      const { data: modules } = await supabase
        .from('modules')
        .select('language_id')
      
      const stats = {}
      modules?.forEach(module => {
        stats[module.language_id] = (stats[module.language_id] || 0) + 1
      })
      setLanguageStats(stats)
    } catch (error) {
      console.error('Error fetching language stats:', error)
    }
  }

  // Upload file to Supabase storage and return public URL
  const uploadImage = async (file) => {
    if (!file) return null

    const filePath = `languages/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('images') // 👈 make sure you have a bucket called "images"
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    return data.publicUrl
  }

  // Create a new language
  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = null
      if (newFile) {
        imageUrl = await uploadImage(newFile)
      }

      const { error } = await supabase.from('languages').insert([
        {
          name: newName,
          link: imageUrl,
        },
      ])

      if (error) throw error

      setNewName('')
      setNewFile(null)
      setShowAddForm(false)
      fetchLanguages()
      fetchLanguageStats()
    } catch (err) {
      console.error(err)
      alert('❌ Could not create language')
    } finally {
      setLoading(false)
    }
  }

  // Start editing
  const startEdit = (id, name) => {
    setEditingId(id)
    setEditingName(name)
  }

  // Save edit
  const saveEdit = async () => {
    if (!editingName.trim()) return
    
    const { error } = await supabase
      .from('languages')
      .update({ name: editingName })
      .eq('id', editingId)

    if (error) {
      console.error(error)
      alert('❌ Could not update language')
    } else {
      setEditingId(null)
      setEditingName('')
      fetchLanguages()
    }
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  // Delete language
  const handleDelete = async (id) => {
    if (!confirm('Delete this language? This will also delete all associated modules and content.')) return
    const { error } = await supabase.from('languages').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('❌ Could not delete language')
    } else {
      fetchLanguages()
      fetchLanguageStats()
    }
  }

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get language flag emoji (simplified mapping)
  const getLanguageFlag = (name) => {
    const flagMap = {
      'hindi': '🇮🇳',
      'bengali': '🇧🇩',
      'telugu': '🇮🇳',
      'marathi': '🇮🇳',
      'tamil': '🇮🇳',
      'gujarati': '🇮🇳',
      'urdu': '🇵🇰',
      'kannada': '🇮🇳',
      'odia': '🇮🇳',
      'malayalam': '🇮🇳',
      'punjabi': '🇮🇳',
      'assamese': '🇮🇳',
      'sanskrit': '🇮🇳',
      'english': '🇺🇸',
      'spanish': '🇪🇸',
      'french': '🇫🇷',
      'german': '🇩🇪',
      'chinese': '🇨🇳',
      'japanese': '🇯🇵',
      'korean': '🇰🇷'
    }
    return flagMap[name.toLowerCase()] || '🌍'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Globe className="text-orange-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Languages</h1>
              <p className="text-gray-400 text-lg">Manage your language courses</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            Add Language
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Globe className="text-orange-400" size={24} />
                </div>
                <div>
                  <p className="text-orange-300 text-sm font-medium">Total Languages</p>
                  <p className="text-3xl font-bold text-white">{languages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <BookOpen className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-green-300 text-sm font-medium">Total Modules</p>
                  <p className="text-3xl font-bold text-white">
                    {Object.values(languageStats).reduce((sum, count) => sum + count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-purple-300 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-white">
                    {Object.keys(languageStats).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search languages..."
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

      {/* Add Language Form */}
      {showAddForm && (
        <Card className="mb-8 bg-gray-800/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Language</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">Language Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Hindi, Bengali, Tamil"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Language Image</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewFile(e.target.files[0])}
                      className="bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl"
                >
                  {loading ? 'Adding...' : 'Add Language'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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

      {/* Languages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLanguages.map((lang) => (
          <Card
            key={lang.id}
            className="group bg-gray-800/50 border-gray-600 hover:border-orange-500/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden"
            onClick={() => onSelectLanguage && onSelectLanguage(lang)}
          >
            {/* Language Image */}
            <div className="relative h-48 overflow-hidden">
              {lang.link ? (
                <img 
                  src={lang.link} 
                  alt={lang.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getLanguageFlag(lang.name)}</div>
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    startEdit(lang.id, lang.name)
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2"
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(lang.id)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Language Flag */}
              <div className="absolute top-3 left-3 text-2xl">
                {getLanguageFlag(lang.name)}
              </div>
            </div>

            <CardContent className="p-4">
              {/* Language Name */}
              {editingId === lang.id ? (
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-gray-700 border-gray-600 text-white text-lg font-semibold"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={cancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {lang.name}
                </h3>
              )}

              {/* Language Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Modules</span>
                  <span className="text-orange-400 font-semibold">
                    {languageStats[lang.id] || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">
                    {(languageStats[lang.id] || 0) > 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">ID</span>
                  <span className="text-gray-300 font-mono">#{lang.id}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectLanguage && onSelectLanguage(lang)
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 transition-all duration-300"
                >
                  <BookOpen size={16} className="mr-2" />
                  Manage Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLanguages.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Globe className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No languages found' : 'No languages yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? `No languages match "${searchTerm}". Try a different search term.`
                : 'Get started by adding your first language course.'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Language
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
