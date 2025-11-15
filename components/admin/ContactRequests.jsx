import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import styles from './Subscribers.module.css';

function ContactRequests() {
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactRequests = async () => {
      console.log("📡 Fetching contact requests from Supabase...");
      const { data, error } = await supabase
        .from('support')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching contact requests:', error);
      } else {
        console.log("✅ Contact requests fetched successfully:", data);
        setContactRequests(data || []);
      }

      setLoading(false);
    };

    fetchContactRequests();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📬 Contact Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : contactRequests.length === 0 ? (
        <p>No contact requests yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Attached Images</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {contactRequests.map((request, index) => (
              <tr key={request.id}>
                <td>{index + 1}</td>
                <td>{request.name || '—'}</td>
                <td>{request.username || '—'}</td>
                <td>
                  <a href={`mailto:${request.email}`} className="text-blue-500 hover:underline">
                    {request.email || '—'}
                  </a>
                </td>
                <td>{request.subject || '—'}</td>
                <td className="max-w-md">
                  <div className="truncate" title={request.message}>
                    {request.message || '—'}
                  </div>
                </td>
                <td>
                  {request.attached_imgs ? (
                    <a href={request.attached_imgs} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View
                    </a>
                  ) : '—'}
                </td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContactRequests;