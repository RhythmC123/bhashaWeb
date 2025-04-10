import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon } from 'lucide-react';
import { supabase } from '../../supabaseClient';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('FlashCard'); // Default to FlashCard

  useEffect(() => {
    // Fetch all questions from the database
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  // Function to handle form submission for creating a new question
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value;
    const answer = e.target.answer.value;
  
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          type: selectedType,
          prompt,
          answer,
        },
      ])
      .select(); // Use .select() to ensure the inserted data is returned
  
    if (error) {
      console.error('Error creating question:', error);
    } else {
      // Ensure data is iterable (should be an array or empty array)
      if (Array.isArray(data)) {
        // Refresh the question list after creation
        setQuestions([...questions, ...data]);
      } else {
        console.error('Error: data is not an array or empty');
      }
    }
  };
  

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            <Link href="https://www.instagram.com/learnwithbhasha?igsh=YjdhaHh4amU1YWdj">
              <InstagramIcon size={32} color="white" />
            </Link>
            <Link href="">
              <TwitterIcon size={32} color="white" />
            </Link>
            <Link href="/">
              <span className={styles.navItem}>Home</span>
            </Link>
            <Link href="/">
              <span className={styles.navItem}>About</span>
            </Link>
            <Link href="/admin">
              <span className={styles.navItem}>Admin</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link href="/admin">Home</Link>
            </li>
            <li>
              <Link href="/admin/modules">Modules</Link>
            </li>
            <li>
              <Link href="/admin/questions">Questions</Link>
            </li>
            <li>
              <Link href="/admin/languages">Languages</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>Manage Questions</h1>
        <p className={styles.subtext}>
          View, manage, and create questions for your modules.
        </p>

        {/* Display List of Questions */}
        <h2 className={styles.subheading}>Current Questions</h2>
        {loading ? (
          <p>Loading questions...</p>
        ) : questions.length > 0 ? (
          <ul>
            {questions.map((question) => (
              <li key={question.id} className={styles.questionItem}>
                <p>
                  <strong>Type:</strong> {question.type}
                </p>
                <p>
                  <strong>Prompt:</strong> {question.prompt}
                </p>
                <p>
                  <strong>Answer:</strong> {question.answer}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions found. Create a new question below.</p>
        )}

        {/* Form to Create New Question */}
        <h2 className={styles.subheading}>Create a New Question</h2>
        <form onSubmit={handleCreateQuestion} className={styles.questionForm}>
          <label>
            <strong>Question Type:</strong>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.selectField}
            >
              <option value="FlashCard">FlashCard</option>
              <option value="MCQ">MCQ</option>
              <option value="Text">Text</option>
            </select>
          </label>

          <label>
            <strong>Prompt:</strong>
            <input
              type="text"
              name="prompt"
              placeholder="Enter question prompt"
              className={styles.inputField}
            />
          </label>

          <label>
            <strong>Answer:</strong>
            <textarea
              name="answer"
              placeholder="Enter the answer"
              className={styles.textArea}
            />
          </label>

          <button type="submit" className={styles.createButton}>
            Create Question
          </button>
        </form>
      </main>
    </div>
  );
}

export default Questions;
