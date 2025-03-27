import React from 'react';
import styles from '../styles/Map.module.css';

function Map() {
  const modules = [
    { id: 1, name: "Introduction", completed: true },
    { id: 2, name: "Basic Phrases", completed: false },
    { id: 3, name: "Numbers", completed: false }
  ];

  return (
    <div className={styles.mapContainer}>
      <h1 className={styles.heading}>Course Progress</h1>
      <div className={styles.mapGrid}>
        {modules.map((module, index) => (
          <div key={module.id} className={`${styles.moduleBox} ${module.completed ? styles.completed : ''}`}>
            {module.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
