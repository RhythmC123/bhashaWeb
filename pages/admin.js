import React from 'react';
import Link from 'next/link';
import styles from '../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon, PlusCircle } from "lucide-react";
import { useRouter } from 'next/router';

function AdminPanel() {
  const router = useRouter();

  const courses = [
    { id: 1, name: "Spanish Basics", modified: "2025-03-20" },
    { id: 2, name: "French Intermediate", modified: "2025-03-18" }
  ];

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
            <li><Link href="/admin/modules">Modules</Link></li>
            <li><Link href="/admin/questions">Questions</Link></li>
            <li><Link href="/admin/languages">Languages</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.heading}>Manage Your Courses</h1>
        <p className={styles.subtext}>Create and manage modules efficiently.</p>

        {/* Add Course Button */}
        <div className={styles.addCourseContainer}>
          <button className={styles.addCourseButton}>
            <PlusCircle size={50} />
          </button>
        </div>

        {/* Course List */}
        <div className={styles.courseList}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard} onClick={() => router.push('/map')}>
              <h3>{course.name}</h3>
              <p>Last Modified: {course.modified}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
