import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient';
import styles from '../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon, PlusCircle } from "lucide-react";

function AdminPanel() {
  const router = useRouter();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching languages:', error);
      } else {
        setLanguages(data);
      }

      setLoading(false);
    };

    fetchLanguages();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj">
              <InstagramIcon size={32} />
            </Link>
            <Link href="">
              <TwitterIcon size={32} />
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
            <li><Link href="/admin/subscribers">Subscriber list</Link></li>
            {/* <li><Link href="/admin/preview">Preview app</Link></li> */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>Manage Your Courses</h1>
        <p className={styles.subtext}>Create and manage modules efficiently.</p>

        <button
          className={styles.addCourseButton}
          onClick={() => router.push('/admin/create-language')}
        >
          <PlusCircle size={50} />
        </button>

        {/* Course List */}
        <div className={styles.courseList}>
          {loading ? (
            <p>Loading...</p>
          ) : languages.length === 0 ? (
            <p>No languages found.</p>
          ) : (
            languages.map(lang => (
              <div
                key={lang.id}
                className={styles.courseCard}
                onClick={() => router.push(`/admin/languages/${lang.id}`)}
              >
                <h3>{lang.name}</h3>
                <p>
                  Created: {new Date(lang.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
