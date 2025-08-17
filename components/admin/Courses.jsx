import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Courses({ language, setBreadcrumb, setSelectedSection, setSelectedLanguage }) {
  const [modules, setModules] = useState([])
  const [languages, setLanguages] = useState([])
  const [adding, setAdding] = useState(false)
  const [newModule, setNewModule] = useState({
    language_id: language?.id || '',
    title: '',
    description: '',
    module_number: ''
  })

  // Fetch languages & modules
  useEffect(() => {
    fetchLanguages()
    if (language?.id) {
      fetchModules(language.id)
      setNewModule(prev => ({ ...prev, language_id: language.id }))
    }
  }, [language])

  // Fetch all languages
  const fetchLanguages = async () => {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('id')
    if (error) console.error(error)
    else setLanguages(data)
  }

  // Fetch modules for a given language
  const fetchModules = async (langId) => {
    if (!langId) return

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('language_id', Number(langId)) // ⚡ ensure number type
      .order('module_number', { ascending: true })

    if (error) console.error(error)
    else setModules(data)
  }

  // Add a new module
  const handleAddModule = async (e) => {
    e.preventDefault()
    if (!newModule.language_id) {
      alert('Please select a language.')
      return
    }

    const { error } = await supabase.from('modules').insert([{
      ...newModule,
      language_id: Number(newModule.language_id),
      module_number: Number(newModule.module_number)
    }])

    if (error) {
      console.error(error)
      alert('Failed to add module: ' + error.message)
    } else {
      alert('✅ Module added successfully!')
      setNewModule({
        language_id: language?.id || '',
        title: '',
        description: '',
        module_number: ''
      })
      fetchModules(newModule.language_id)
      setAdding(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language ? `Modules for ${language.name}` : 'Modules'}
        </h2>
        <Button onClick={() => setAdding(prev => !prev)}>
          {adding ? 'Cancel' : '➕ Add Module'}
        </Button>
      </div>

      {/* Add Module Form */}
      {adding && (
        <form onSubmit={handleAddModule} className="border rounded-lg text-black p-4 mb-6 bg-gray-50">
          {!language && (
            <div className="mb-4">
              <Label>Select Language</Label>
              <select
                value={newModule.language_id}
                onChange={(e) =>
                  setNewModule({ ...newModule, language_id: e.target.value })
                }
                className="w-full border rounded p-2"
              >
                <option value="">-- Select a language --</option>
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
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
                setNewModule({ ...newModule, module_number: e.target.value })
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
                setNewModule({ ...newModule, description: e.target.value })
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
          {modules.map(mod => (
            <Card
              key={mod.id}
              className="overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition"
              onClick={() => {
                // Update breadcrumb when clicking module
                setBreadcrumb([
                  {
                    name: language.name,
                    onClick: () => {
                      setSelectedSection('courses')
                      setBreadcrumb([{ name: language.name, onClick: () => {
                        setSelectedSection('languages')
                        setSelectedLanguage(null)
                        setBreadcrumb([])
                      }}])
                    }
                  },
                  {
                    name: mod.title,
                    onClick: () => {
                      // optional: open module detail page
                    }
                  }
                ])
              }}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">
                  {mod.module_number}. {mod.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{mod.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
