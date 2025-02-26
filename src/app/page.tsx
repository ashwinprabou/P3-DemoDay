// app/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default function Landing() {
  return (
    <div className={styles.container}>
      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Logo and Tagline */}
        <div className={styles.logoSection}>
          <h1 className={styles.logoText}>
            <span className={styles.labConnect}>LabConnect</span>{" "}
            <span className={styles.ucsc}>UCSC</span>
          </h1>

          <div className={styles.taglineContainer}>
            <p className={styles.tagline}>
              Discover Research, Unlock Opportunities
            </p>
            <div className={styles.divider}></div>
            <p className={styles.tagline}>
              The #1 spot to find research across UCSC
            </p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className={styles.uploadSection}>
          <div>
            <button className={styles.uploadButton}>
              <svg
                className={styles.uploadIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Upload your transcript or resume
            </button>
          </div>

          {/* File Upload Display */}
          <div className={styles.fileDisplay}>
            <div className={styles.fileContainer}>
              <div className={styles.fileHeader}>FILE NAME</div>
              <div className={styles.fileContent}>
                <span className={styles.fileName}>
                  Firstname_Lastname_Resume.pdf
                </span>
                <button className={styles.deleteButton}>
                  <svg
                    className={styles.deleteIcon}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div>
            <Link href="/directory" passHref>
              <button className={styles.connectButton}>Connect!</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
