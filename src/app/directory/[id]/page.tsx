"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../page.module.css"; // Global styles
import Papa from "papaparse";

interface Lab {
  id: number;
  department: string;
  professor: string;
  contact: string;
  name: string;
  major: string;
  applicationLink: string;
  description: string;
}

interface CsvRow {
  Department: string;
  Professor: string;
  Contact: string;
  Name: string;
  Major: string;
  Apply: string;
  Description: string;
}

export default function LabProfile() {
  const { id } = useParams();
  const [lab, setLab] = useState<Lab | null>(null);

  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmDz9hjnoVXz6sgthlfFxb9HLI8bNDqXa7VGPG1hgCTisC5i1N28FgWR0qmHqAHBepV1fE5_YpIbyq/pub?output=csv";

    Papa.parse<CsvRow>(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const labs: Lab[] = results.data.map((row, index) => ({
          id: index + 1,
          department: row.Department || "Unknown",
          professor: row.Professor || "Unknown",
          contact: row.Contact || "N/A",
          name: row.Name || "Unknown",
          major: row.Major || "N/A",
          applicationLink: row.Apply || "#",
          description: row.Description || "No description available.",
        }));

        const foundLab = labs.find((lab) => lab.id === Number(id));
        setLab(foundLab || null);
      },
    });
  }, [id]);

  if (!lab) {
    return <p className={styles.loading}>Loading lab details...</p>;
  }

  // Custom styles for this page (extending module CSS)
  const customStyles = {
    labTitle: {
      fontSize: "2.5rem",
      color: "#1a365d",
      fontWeight: "bold",
    },
    labDepartment: {
      fontSize: "1.2rem",
      color: "#666",
      marginTop: "5px",
    },
    labDescription: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "#333",
      marginBottom: "20px",
    },
    contactSection: {
      marginTop: "30px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
    },
    applyButton: {
      backgroundColor: "#1a365d",
      color: "white",
      padding: "12px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "all 0.3s ease",
    },
    contactButton: {
      backgroundColor: "#1a365d",
      color: "white",
      padding: "12px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.labTitle} style={customStyles.labTitle}>
          {lab.name}
        </h1>
        <p className={styles.labDepartment} style={customStyles.labDepartment}>
          {lab.department}
        </p>
      </header>

      <section className={styles.labContent}>
        <p
          className={styles.labDescription}
          style={customStyles.labDescription}
        >
          {lab.description}
        </p>

        <div
          className={styles.contactSection}
          style={customStyles.contactSection}
        >
          <h3>Contact Details</h3>
          <p>Email: {lab.contact}</p>
        </div>

        <div className={styles.buttonGroup} style={customStyles.buttonGroup}>
          <a
            href={lab.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className={styles.applyButton}
              style={customStyles.applyButton}
            >
              Apply!
            </button>
          </a>
          <a href={`mailto:${lab.contact}`}>
            <button
              className={styles.contactButton}
              style={customStyles.contactButton}
            >
              Contact
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
