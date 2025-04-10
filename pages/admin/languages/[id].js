import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../../supabaseClient';
import styles from '../../../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon } from "lucide-react";

function SpecificLanguagePage() {
  const [modules, setModules] = useState([]);
  const [language, setLanguage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [moduleNumber, setModuleNumber] = useState('');
  const [newLanguageName, setNewLanguageName] = useState('');
  const router = useRouter();
  const { id } = router.query; // Access the language ID from the URL

  // Fetch language data and modules when the languageId is available
  useEffect(() => {
    if (id) {
      // Fetch the language data
      const fetchLanguageData = async () => {
        const { data: languageData, error: languageError } = await supabase
          .from('languages')
          .select('*')
          .eq('id', id)
          .single();
        
        if (languageError) console.error('Error fetching language:', languageError);
        else setLanguage(languageData);

        // Fetch modules for this language
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('language_id', id)
          .order('module_number', { ascending: true });

        if (modulesError) console.error('Error fetching modules:', modulesError);
        else setModules(modulesData);
      };

      fetchLanguageData();
    }
  }, [id]);

  // Handle module creation
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name) {
      alert('Please enter a module name');
      return;
    }

    const selectedLanguageId = id; // Automatically use the current language's ID

    const { data, error } = await supabase
      .from('modules')
      .insert([{
        title: name,
        description,
        module_number: parseInt(moduleNumber) || null,
        language_id: selectedLanguageId
      }])
      .select();

    if (error) {
      console.error('Error creating module:', error);
      return;
    }

    // Reset form and refresh modules
    setName('');
    setDescription('');
    setModuleNumber('');
    fetchModules();
  };

  const fetchModules = async () => {
    const { data: modulesData, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('language_id', id)
      .order('module_number', { ascending: true });

    if (modulesError) console.error('Error fetching modules:', modulesError);
    else setModules(modulesData);
  };

  if (!language) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj">
              <InstagramIcon size={32} color='white' />
            </Link>
            <Link href="">
              <TwitterIcon size={32} color='white' />
            </Link>
            <Link href="/"> <span className={styles.navItem}>Home</span></Link>
            <Link href="/"> <span className={styles.navItem}>About</span></Link>
            <Link href="/admin"> <span className={styles.navItem}>Admin</span></Link>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link href="/admin">Home</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>{language.name} - Modules</h1>
        <p className={styles.subtext}>Click on a module to edit its content.</p>

        <div className={styles.courseList}>
          {modules.length === 0 ? (
            <p>No modules found for this language.</p>
          ) : (
            modules.map((mod) => (
              <div
                key={mod.id}
                className={styles.courseCard}
                onClick={() => router.push(`/admin/languages/${id}/${mod.id}`)} // Navigate to module details page
              >
                <h3>Module {mod.module_number}: {mod.title}</h3>
                <p>{mod.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Module Creation Interface */}
        <div className={styles.moduleContainer}>
          <h2 className={styles.moduleTitle}>Create a New Module</h2>
          <form onSubmit={handleCreate} className={styles.moduleForm}>
            <input
              type="text"
              placeholder="Module Name"
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className={styles.textArea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Module Number"
              className={styles.inputField}
              value={moduleNumber}
              onChange={(e) => setModuleNumber(e.target.value)}
            />

            <button type="submit" className={styles.createButton}>Create Module</button>
          </form>
        </div>

      </main>
    </div>
  );
}

export default SpecificLanguagePage;
