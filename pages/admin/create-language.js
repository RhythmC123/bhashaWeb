import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';
import { InstagramIcon, TwitterIcon } from "lucide-react";
import styles from '../../styles/Admin.module.css';

function CreateLanguage() {
  const [languageName, setLanguageName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if language name is provided
    if (!languageName.trim()) {
      setError('Language name cannot be empty.');
      return;
    }

    // Insert new language into Supabase
    const { data, error } = await supabase
      .from('languages')
      .insert([{ name: languageName }]);

    if (error) {
      setError('Failed to create language.');
      console.error(error);
    } else {
      // On success, redirect to the admin page
      router.push('/admin');
    }
  };

  return (
    <div className={styles.container}>
        {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj">
              <InstagramIcon size={32} color='white'/>
            </Link>
            <Link href="">
              <TwitterIcon size={32} color='white'/>
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
            <li><Link href="/admin" >Home</Link></li>
          </ul>
        </nav>
      </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
        <h1 className={styles.heading}>Create a New Language</h1>
        <p className={styles.subtext}>Add a new language to start building modules.</p>

        <div className={styles.moduleContainer}>
            <form onSubmit={handleSubmit} className={styles.moduleForm}>
            <label htmlFor="language" className={styles.moduleTitle}>Language Name:</label>
            <input
                type="text"
                id="language"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. Spanish"
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" className={styles.createButton}>
                Create Language
            </button>
            </form>
        </div>
        </main>
    </div>
  );
}

export default CreateLanguage;
