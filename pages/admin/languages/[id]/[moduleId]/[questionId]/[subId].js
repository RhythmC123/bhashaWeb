import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../../../styles/Admin.module.css';

function QuestionDetailsPage() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { query } = useRouter();
  const { questionId } = query; // Extract questionId from the URL

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .single();  // Fetch the specific question

        if (error) {
          console.error('Error fetching question:', error);
        } else {
          setQuestion(data);
        }
        setLoading(false);
      };

      fetchQuestion();
    }
  }, [questionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
      </header>

      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link href="/admin">Home</Link></li>
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <h1>Question Details</h1>
        <h2>{question.prompt}</h2>
        <p>{question.answer}</p>
        <p><strong>Type:</strong> {question.type}</p>
        <p><strong>Module ID:</strong> {question.module_id}</p>
      </main>
    </div>
  );
}

export default QuestionDetailsPage;
