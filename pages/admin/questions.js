import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';
import { InstagramIcon, TwitterIcon } from "lucide-react";

function questions() {
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

        {/* Module Creation Interface */}
        <div className={styles.moduleContainer}>
          <h2 className={styles.moduleTitle}>Create a New Module</h2>
          <form className={styles.moduleForm}>
            <input type="text" placeholder="Module Name" className={styles.inputField} />
            <textarea placeholder="Description" className={styles.textArea}></textarea>
            <button type="submit" className={styles.createButton}>Create Module</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default questions;
