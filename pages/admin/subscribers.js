import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';
import { InstagramIcon, TwitterIcon } from "lucide-react";
import styles from '../../styles/Admin.module.css';

function SubscriberList() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch subscriber data when component mounts
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('id, name, email, subscribed, created_at')
      .order('created_at', { ascending: false });  // Sorting by sign-up date

    if (error) {
      setError('Failed to fetch subscribers.');
      console.error(error);
    } else {
      setSubscribers(data);
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
        <h1 className={styles.heading}>Subscribers</h1>
        <p className={styles.subtext}>View, manage, and schedule emails here.</p>

        {/* Display Subscribers Table */}
        <section className={styles.subscribersTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>S.No</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Email</th>
                <th className={styles.tableHeader}>Subscribed</th>
                <th className={styles.tableHeader}>Date Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length > 0 ? (
                subscribers.map((subscriber, index) => (
                  <tr key={subscriber.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>{subscriber.name}</td>
                    <td className={styles.tableCell}>{subscriber.email}</td>
                    <td className={styles.tableCell}>{subscriber.subscribed ? 'Yes' : 'No'}</td>
                    <td className={styles.tableCell}>
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.tableCell}>No subscribers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default SubscriberList;
