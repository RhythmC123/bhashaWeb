import React, { useEffect, useState } from 'react'
import styles from '../styles/Admin.module.css'

import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

import AdminNav from '@/components/admin/AdminNav'
import SideBarAdmin from '@/components/admin/SideBarAdmin'

import Courses from '@/components/admin/Courses'
import Languages from '@/components/admin/Languages'
import Subscribers from '@/components/admin/Subscribers'
import Website from '@/components/admin/Website'
import ActivityLogs from '@/components/admin/ActivityLogs'
import ContactRequests from '@/components/admin/ContactRequests'
import QTPage from '@/components/admin/QTPage'

function AdminPanel() {
  const session = useSession()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState('dashboard')
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])

  // Redirect if no session
  useEffect(() => {
    if (session === null) router.push('/login')
  }, [session])

  // Update breadcrumb whenever selection changes
  useEffect(() => {
    const crumbs = []
    if (selectedLanguage) {
      crumbs.push({
        name: selectedLanguage.name,
        onClick: () => {
          setSelectedModule(null)
          setSelectedSection('courses')
          setBreadcrumb([{ name: selectedLanguage.name, onClick: () => {
            setSelectedSection('languages')
            setSelectedLanguage(null)
            setSelectedModule(null)
            setBreadcrumb([])
          }}])
        }
      })
    }
    if (selectedModule) {
      crumbs.push({
        name: selectedModule.title,
        onClick: () => {
          // stay in module, could later open module detail page
        }
      })
    }
    setBreadcrumb(crumbs)
  }, [selectedLanguage, selectedModule])

  const renderContent = () => {
    switch (selectedSection) {
      case 'courses':
        return (
          <Courses
            language={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            setSelectedSection={setSelectedSection}
            setBreadcrumb={setBreadcrumb}
          />
        )
      case 'languages':
        return (
          <Languages
            onSelectLanguage={(lang) => {
              setSelectedLanguage(lang)
              setSelectedSection('courses')
            }}
          />
        )
      case 'subscribers':
        return <Subscribers />
      case 'website':
        return <Website />
      case 'question':
        return <QTPage />
      case 'activity':
        return <ActivityLogs />
      case 'contact':
        return <ContactRequests />
      default:
        return (
          <div className={styles.mainText}>
            Welcome to the Admin Dashboard. Select a section to manage.
            <br />
            <div className="d-flex flex-wrap gap-3 mr-4 mb-4">
              <button
                onClick={() => setSelectedSection('courses')}
                className={styles.actionButton}
              >
                Courses
              </button>
              <button
                onClick={() => setSelectedSection('languages')}
                className={styles.actionButton}
              >
                Languages
              </button>
              <button
                onClick={() => setSelectedSection('subscribers')}
                className={styles.actionButton}
              >
                Subscribers
              </button>
              <button
                onClick={() => setSelectedSection('website')}
                className={styles.actionButton}
              >
                Manage Website
              </button>
              <button
                onClick={() => setSelectedSection('activity')}
                className={styles.actionButton}
              >
                Track Activity
              </button>
              <button
                onClick={() => setSelectedSection('contact')}
                className={styles.actionButton}
              >
                Contact Requests
              </button>
            </div>
          </div>
        )
    }
  }

  if (session === undefined) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <AdminNav />

      <div className={styles.contentWrapper}>
        <SideBarAdmin
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />

        <div className='flex-1 p-8 h-vh-100'>

        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="mb-4 text-gray-700 flex items-center gap-1">
            {breadcrumb.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <button
                  onClick={item.onClick}
                  className="text-blue-600 hover:underline"
                >
                  {item.name}
                </button>
                {idx < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        )}


        <main className={styles.mainContent}>{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
