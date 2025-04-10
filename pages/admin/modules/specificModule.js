import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../../supabaseClient';  // Update path as needed
import styles from '../../../styles/Admin.module.css';  // Update path as needed
import { InstagramIcon, TwitterIcon } from "lucide-react";

function SpecificModule() {
  const router = useRouter();
  const { languageId, moduleId } = router.query;  // Capture dynamic route segments
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) return;

    // Fetch module data
    const fetchModuleData = async () => {
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (moduleError) console.error('Error fetching module:', moduleError);
      else setModule(moduleData);

      // Fetch questions for this module
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('module_id', moduleId);

      if (questionsError) console.error('Error fetching questions:', questionsError);
      else setQuestions(questionsData);

      setLoading(false);
    };

    fetchModuleData();
  }, [moduleId]);

  if (loading) return <p>Loading...</p>;

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
            <li><Link href="/admin/modules">Modules</Link></li>
            <li><Link href="/admin/questions">Questions</Link></li>
            <li><Link href="/admin/languages">Languages</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>Module: {module.title}</h1>
        <p className={styles.subtext}>Questions for this module:</p>

        {/* Display questions */}
        {questions.length === 0 ? (
          <p>No questions available for this module.</p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className={styles.courseCard}>
              <h3>{question.prompt}</h3>
              <p>Answer: {question.answer}</p>
            </div>
          ))
        )}

        {/* Option to add a new question */}
        <Link href={`/admin/languages/${languageId}/${moduleId}/addQuestion`}>
          <button className={styles.createButton}>Add Question</button>
        </Link>
      </main>
    </div>
  );
}

export default SpecificModule;
