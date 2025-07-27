import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import styles from './Subscribers.module.css';

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      console.log("📡 Fetching subscribers from Supabase...");
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching subscribers:', error);
      } else {
        console.log("✅ Subscribers fetched successfully:", data);
        setSubscribers(data);
      }

      setLoading(false);
    };

    fetchSubscribers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📬 Subscribers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr key={subscriber.id}>
                <td>{index + 1}</td>
                <td>{subscriber.name || '—'}</td>
                <td>{subscriber.email}</td>
                <td>{new Date(subscriber.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Subscribers;
