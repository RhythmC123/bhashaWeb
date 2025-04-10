import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../../supabaseClient';
import styles from '../../../../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon } from "lucide-react";
import Link from 'next/link';

function SpecificModulePage() {
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  const { id, moduleId } = router.query; // Access the language ID and module ID from the URL

  useEffect(() => {
    if (id && moduleId) {
      // Fetch the module data
      const fetchModuleData = async () => {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();
        
        if (moduleError) console.error('Error fetching module:', moduleError);
        else setModule(moduleData);

        // Fetch the questions for the module
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('module_id', moduleId);

        if (questionsError) console.error('Error fetching questions:', questionsError);
        else setQuestions(questionsData);
      };

      fetchModuleData();
    }
  }, [id, moduleId]);

  if (!module) return <p>Loading module...</p>;

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
            <li><Link href={`/admin/languages/${id}`}>Modules</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>{module.title} - Questions</h1>
        <p className={styles.subtext}>Click on a question to edit or add a new one.</p>

        <div className={styles.courseList}>
          {questions.length === 0 ? (
            <p>No questions found for this module.</p>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className={styles.courseCard}
                onClick={() => router.push(`/admin/questions/${question.id}`)} // Navigate to question details page
              >
                <h3>{question.text}</h3>
                <p>{question.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Option to add a new question */}
        <div className={styles.moduleContainer}>
        <Link href={`/admin/languages/${id}/${moduleId}/add-question`}>
            <button className={styles.createButton}>Add a Question</button>
        </Link>
        </div>
      </main>
    </div>
  );
}

export default SpecificModulePage;
