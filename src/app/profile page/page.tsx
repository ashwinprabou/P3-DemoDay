import React from 'react';
import styles from './profilepage.module.css';  

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.labConnect}>LabConnect</span>
          <span className={styles.ucsc}>UCSC</span>
        </div>
        <button className={styles.homeButton}>Home</button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.leftContent}>
          <h1>Marine Biology Research Lab</h1>
          <p className={styles.description}>
            The Marine Biology Research Lab is dedicated to understanding the complexities of
            marine ecosystems. Our research focuses on the impact of climate change on
            marine life and the development of sustainable fishing practices.
          </p>

          <section className={styles.contactDetails}>
            <h2>Contact Details</h2>
            <p>Phone: (123) 456 7890</p>
            <p>Email: marinebioresearch@gmail.com</p>
          </section>

          <section className={styles.researchers}>
            <h2>Researchers</h2>
            <div className={styles.researcherGrid}>
              <div className={styles.researcher}>
                <div className={styles.researcherAvatar}></div>
                <h3>Dr. Emily Carter</h3>
                <p>Head Researcher</p>
              </div>
              <div className={styles.researcher}>
                <div className={styles.researcherAvatar}></div>
                <h3>Dr. Micheal Lee</h3>
                <p>Marine Biologist</p>
              </div>
              <div className={styles.researcher}>
                <div className={styles.researcherAvatar}></div>
                <h3>Dr. Sandra Kim</h3>
                <p>Scientist</p>
              </div>
            </div>
          </section>

          <div className={styles.bottomSections}>
            <section className={styles.openPositions}>
              <h2>Open Positions</h2>
              <div className={styles.position}>
                <h3>Research Assistant 1</h3>
                <button className={styles.applyButton}>Apply</button>
              </div>
              <div className={styles.position}>
                <h3>Research Assistant 2</h3>
                <button className={styles.applyButton}>Apply</button>
              </div>
            </section>

            <section className={styles.projects}>
              <h2>Projects</h2>
              <div className={styles.projectCards}>
                <div className={styles.projectCard}>
                  <h3>Coral Reef Restoration</h3>
                  <p>A project aimed at restoring damaged coral reefs through the use of innovative marine technologies.</p>
                </div>
                <div className={styles.projectCard}>
                  <h3>Marine Mammal Conservation</h3>
                  <p>Focused on the preservation of marine mammal habitats and reducing human impacts on these species.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.map}>
            {/* Map placeholder */}
            <div className={styles.mapMarker}></div>
          </div>
        </div>
      </main>

      <div className={styles.actionButtons}>
        <button className={styles.contactLab}>Contact Lab</button>
        <button className={styles.backToDirectory}>Back to Lab Directory</button>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className={styles.footerContact}>Contact us at: info@labconnect.ucsc.edu</p>
      </footer>
    </div>
  );
};

export default ProfilePage;