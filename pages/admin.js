import React, { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';
import AdminNav from '@/components/admin/AdminNav';
import SideBarAdmin from '@/components/admin/SideBarAdmin';

import Courses from '@/components/admin/Courses';
import Languages from '@/components/admin/Languages';
import Subscribers from '@/components/admin/Subscribers';
import Website from '@/components/admin/Website';
import ActivityLogs from '@/components/admin/ActivityLogs';
import ContactRequests from '@/components/admin/ContactRequests';
// Add other components similarly

function AdminPanel() {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  // You can skip fetching languages here unless needed

  const renderContent = () => {
    switch (selectedSection) {
      case 'courses':
        return <Courses />;
      case 'languages':
        return <Languages />;
      case 'subscribers':
        return <Subscribers />;
      case 'website':
        return <Website />;
      case 'activity':
        return <ActivityLogs />;
      case 'contact':
        return <ContactRequests />;

      default:
        return (
          <div className={styles.mainText}>
            Welcome to the Admin Dashboard. Select a section to manage.
            <br />
            <div className="d-flex flex-wrap gap-3 mr-4 mb-4">
            <button onClick={() => setSelectedSection('courses')} className={styles.actionButton}>Courses</button>
            <button onClick={() => setSelectedSection('languages')} className={styles.actionButton}>Languages</button>
            <button onClick={() => setSelectedSection('subscribers')} className={styles.actionButton}>Subscribers</button>
            <button onClick={() => setSelectedSection('website')} className={styles.actionButton}>Manage Website</button>
            <button onClick={() => setSelectedSection('activity')} className={styles.actionButton}>Track Activity</button>
            <button onClick={() => setSelectedSection('contact')} className={styles.actionButton}>Contact Requests</button>
          </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <AdminNav />

      <div className={styles.contentWrapper}>
        <SideBarAdmin
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />

        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
