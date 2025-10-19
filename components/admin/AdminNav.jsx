// components/AdminNav.jsx
"use client";
import Link from "next/link";
import { InstagramIcon, TwitterIcon } from "lucide-react"; // or wherever you're importing them from
import styles from "./AdminNav.module.css"; // assuming you'll style it separately

export default function AdminNav() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
       
        <div className={styles.navLinks}>
             <div className={styles.logo}>
            <Link href="/">
                <img src="/images/bhasha.jpeg" alt="Bhasha Logo" className={styles.logoImage} />
            </Link>
        </div>

          <Link href="/">
            <span className={styles.navItem}>Back to Website</span>
          </Link>
          <Link href="/">
            <span className={styles.navItem}>Manage Courses</span>
          </Link>
          <Link href="/admin/people">
            <span className={styles.navItem}>People management</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
    