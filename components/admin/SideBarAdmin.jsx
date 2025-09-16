// components/SideBarAdmin.jsx
import { LayoutDashboard, Users, Globe, Mail, Settings, Activity, Monitor, QrCode, BookOpen, MapPinned } from 'lucide-react';
import styles from './Sidebar.module.css';
import QTPage from './QTPage';

const SideBarAdmin = ({ selectedSection, setSelectedSection }) => {
  const navItems = [
    { label: 'Dashboard', key: 'dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Courses', key: 'courses', icon: <Monitor size={18} /> },
    { label: 'Languages', key: 'languages', icon: <Globe size={18} /> },
    { label: 'Map', key: 'map', icon: <MapPinned size={18} /> },
    { label: 'Subscribers', key: 'subscribers', icon: <Users size={18} /> },
    { label: 'Contact Requests', key: 'contact', icon: <Mail size={18} /> },
    { label: 'Activity Logs', key: 'activity', icon: <Activity size={18} /> },
    { label: 'Question templates', key: 'question', icon: <QrCode size={18} /> },
    { label: 'Settings', key: 'settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Admin Panel</h2>
      <nav>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li
              key={item.key}
              className={selectedSection === item.key ? styles.active : ''}
              onClick={() => setSelectedSection(item.key)}
            >
              <div className={styles.link}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBarAdmin;
