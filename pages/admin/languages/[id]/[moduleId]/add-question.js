import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../../../supabaseClient';
import Link from 'next/link';
import styles from '../../../../../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon } from "lucide-react";

function AddQuestionPage() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState('FlashCard');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  
  // Extract both languageId and moduleId from the URL
  const { languageId, moduleId } = router.query;

  // Fetch existing questions for the module when the component mounts
  useEffect(() => {
    if (moduleId) {
      const fetchQuestions = async () => {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('module_id', moduleId);

        if (error) {
          console.error('Error fetching questions:', error);
        } else {
          setQuestions(data);
        }
      };

      fetchQuestions();
    }
  }, [moduleId]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!prompt || !answer) {
      alert('Please enter a prompt and an answer');
      return;
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          type,
          prompt,
          answer,
          module_id: moduleId,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding question:', error);
      return;
    }

    // After adding the question, fetch the updated list of questions
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { ...data[0] },
    ]);

    // Clear the form fields after adding a question
    setPrompt('');
    setAnswer('');

    // Optionally, you can focus the input field again
    // document.getElementById('prompt-input').focus();
  };

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
        <h1 className={styles.heading}>Add Question to Module {moduleId}</h1>

        {/* Add Question Form */}
        <form onSubmit={handleAddQuestion} className={styles.moduleForm}>
          <input
            type="text"
            placeholder="Question Prompt"
            className={styles.inputField}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            id="prompt-input"
          />
          <textarea
            placeholder="Answer"
            className={styles.textArea}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          
          <select
            className={styles.inputField}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="FlashCard">FlashCard</option>
            <option value="MCQ">Multiple Choice</option>
            <option value="Text">Text</option>
          </select>

          <button type="submit" className={styles.createButton}>Add Question</button>
        </form>

        {/* Display Existing Questions */}
        <div className={styles.questionsList}>
          <h2 className={styles.subHeading}>Questions in this Module</h2>
          {questions.length === 0 ? (
            <p>No questions available for this module.</p>
          ) : (
            <ul>
              {questions.map((question) => (
                <li key={question.id} className={styles.questionCard}>
                    <p><strong>ID:</strong> {question.id}</p>
                  <h3>{question.prompt}</h3>
                  <p>{question.answer}</p>
                  <p><strong>Type:</strong> {question.type}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddQuestionPage;
