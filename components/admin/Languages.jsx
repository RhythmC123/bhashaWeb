import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Languages({ onSelectLanguage }) {
  const [languages, setLanguages] = useState([])
  const [newName, setNewName] = useState('')
  const [newFile, setNewFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch languages from Supabase
  useEffect(() => {
    fetchLanguages()
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
      fetchLanguages()
    } catch (err) {
      console.error(err)
      alert('❌ Could not create language')
    } finally {
      setLoading(false)
    }
  }

  // Edit name
  const handleEdit = async (id, name) => {
    const { error } = await supabase
      .from('languages')
      .update({ name })
      .eq('id', id)

    if (error) console.error(error)
    fetchLanguages()
  }

  // Delete language
  const handleDelete = async (id) => {
    if (!confirm('Delete this language?')) return
    const { error } = await supabase.from('languages').delete().eq('id', id)
    if (error) console.error(error)
    fetchLanguages()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Languages Admin</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Language name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setNewFile(e.target.files[0])}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </form>

      {/* Languages grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {languages.map((lang) => (
          <Card
            key={lang.id}
            className="overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => onSelectLanguage && onSelectLanguage(lang)}
          >
            {lang.link ? (
              <img src={lang.link} alt={lang.name} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-semibold">{lang.name}</h3>
              <p className="text-sm text-gray-500">ID: {lang.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
