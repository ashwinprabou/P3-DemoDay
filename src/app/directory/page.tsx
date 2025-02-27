// app/directory/page.tsx
"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from "react";
import styles from "../page.module.css"; // Import your CSS module for styling
import Papa from "papaparse";

interface Lab {
  id: number;
  name: string;
  department: string;
  //description: string;
  //matchScore: number;
  //funding: number; // Add funding property
}

interface CsvRow {
  Name: string;
  Department: string;
  Description: string;
  matchScore: string;
  funding: string;
  Professor: string;
}

interface Filters {
  departments: {
    [key: string]: boolean;
  };
  focus: {
    [key: string]: boolean;
  };
  funding: {
    min: number;
    max: number;
  };
}

export default function Directory() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    departments: {
      Biology: false,
      Physics: false,
      "Computer Science": false,
    },
    focus: {
      "Focus 1": false,
      "Focus 2": false,
      "Focus 3": false,
    },
    funding: {
      min: 1000,
      max: 10000,
    },
  });

  // Fetch labs data
  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmDz9hjnoVXz6sgthlfFxb9HLI8bNDqXa7VGPG1hgCTisC5i1N28FgWR0qmHqAHBepV1fE5_YpIbyq/pub?output=csv";

    Papa.parse<CsvRow>(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const labs = results.data.map((row, index) => ({
          id: index + 1,
          name: row.Name,
          department: row.Department,
          description: row.Description,
          profName: row.Professor,
          //matchScore: parseInt(row.matchScore),
          funding: parseInt(row.funding),
        }));
        setLabs(labs);
        setFilteredLabs(labs);
      },
    });
  }, []); // Empty dependency array for loading once

  // Filter labs based on search term and funding
  const filterLabs = (searchTerm: string) => {
    const filtered = labs.filter((lab) => {
      const name = lab.name?.toLowerCase() || "";
      const department = lab.department?.toLowerCase() || "";
      //const description = lab.description?.toLowerCase() || "";

      return (
        name.includes(searchTerm.toLowerCase()) ||
        department.includes(searchTerm.toLowerCase())
        //description.includes(searchTerm.toLowerCase())
        //lab.funding >= minFunding
      );
    });

    setFilteredLabs(filtered);
  };

  // Update filtered labs when search term or funding filter changes
  useEffect(() => {
    filterLabs(searchTerm);
  }, [searchTerm, filters.funding.min, labs]);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle department filter
  const toggleDepartmentFilter = (department: string) => {
    setFilters({
      ...filters,
      departments: {
        ...filters.departments,
        [department]: !filters.departments[department],
      },
    });
  };

  // Toggle focus filter
  const toggleFocusFilter = (focus: string) => {
    setFilters({
      ...filters,
      focus: {
        ...filters.focus,
        [focus]: !filters.focus[focus],
      },
    });
  };

  // Custom styles for this page (extending module CSS)
  const customStyles = {
    header: {
      backgroundColor: "white",
      padding: "1rem",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    } as const,
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    } as const,
    logo: {
      display: "flex",
      alignItems: "center",
    } as const,
    homeButton: {
      backgroundColor: "#e2e8f0",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      color: "#4a5568",
      border: "none",
      cursor: "pointer",
    } as const,
    pageContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1.5rem 1rem",
    } as const,
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    } as const,
    searchContainer: {
      position: "relative",
    } as const,
    searchIcon: {
      position: "absolute",
      left: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#a0aec0",
    } as const,
    searchInput: {
      paddingLeft: "2.5rem",
      paddingRight: "0.75rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      width: "100%",
    } as const,
    contentLayout: {
      display: "flex",
      gap: "1.5rem",
    } as const,
    filtersPanel: {
      width: "16rem",
      backgroundColor: "#fef9c3",
      borderRadius: "0.5rem",
      padding: "1rem",
    } as const,
    filterSection: {
      marginBottom: "1.5rem",
    } as const,
    filterHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.5rem",
    } as const,
    filterTitle: {
      fontWeight: "600",
    } as const,
    filterOptions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    } as const,
    filterOption: {
      display: "flex",
      alignItems: "center",
    } as const,
    checkbox: {
      marginRight: "0.5rem",
    } as const,
    fundingRange: {
      display: "flex",
      justifyContent: "space-between",
    } as const,
    labsContent: {
      flex: "1",
    } as const,
    labsSection: {
      backgroundColor: "#fef9c3",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    } as const,
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#1a365d",
      marginBottom: "1rem",
    } as const,
    sectionDescription: {
      color: "#4a5568",
      marginBottom: "1rem",
    } as const,
    labsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.5rem",
    } as const,
    labCard: {
      backgroundColor: "white",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    } as const,
    labCardContent: {
      padding: "1rem",
    } as const,
    labCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    } as const,
    labName: {
      fontSize: "1.125rem",
      fontWeight: "bold",
      color: "#1a365d",
    } as const,
    matchScore: {
      backgroundColor: "#f0fff4",
      color: "#22543d",
      fontSize: "0.75rem",
      fontWeight: "600",
      padding: "0.125rem 0.625rem",
      borderRadius: "9999px",
    } as const,
    lowMatchScore: {
      backgroundColor: "#f7fafc",
      color: "#4a5568",
    } as const,
    department: {
      fontSize: "0.875rem",
      color: "#718096",
      marginTop: "0.25rem",
    } as const,
    description: {
      marginTop: "0.5rem",
      color: "#4a5568",
    } as const,
    viewProfileButton: {
      marginTop: "1rem",
      width: "100%",
      backgroundColor: "#1a365d",
      color: "white",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
    } as const,
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div style={customStyles.pageContent}>
          <div style={customStyles.pageHeader}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#1a365d",
              }}
            >
              Recommended Labs
            </h2>
            <div style={customStyles.searchContainer}>
              <div style={customStyles.searchIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                style={customStyles.searchInput}
                placeholder="Search for labs..."
              />
            </div>
          </div>

          <div style={customStyles.contentLayout}>
            {/* Filters Panel */}
            <div style={customStyles.filtersPanel}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Filters:
              </h3>

              {/* Department Filter */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Department</h4>
                </div>
                <div style={customStyles.filterOptions}>
                  {Object.keys(filters.departments).map((dept) => (
                    <div key={dept} style={customStyles.filterOption}>
                      <input
                        id={`department-${dept}`}
                        name={`department-${dept}`}
                        type="checkbox"
                        checked={filters.departments[dept]}
                        onChange={() => toggleDepartmentFilter(dept)}
                        style={customStyles.checkbox}
                      />
                      <label
                        htmlFor={`department-${dept}`}
                        style={{ fontSize: "0.875rem" }}
                      >
                        {dept}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Filter */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Focus</h4>
                </div>
                <div style={customStyles.filterOptions}>
                  {Object.keys(filters.focus).map((focus) => (
                    <div key={focus} style={customStyles.filterOption}>
                      <input
                        id={`focus-${focus}`}
                        name={`focus-${focus}`}
                        type="checkbox"
                        checked={filters.focus[focus]}
                        onChange={() => toggleFocusFilter(focus)}
                        style={customStyles.checkbox}
                      />
                      <label
                        htmlFor={`focus-${focus}`}
                        style={{ fontSize: "0.875rem" }}
                      >
                        {focus}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding Filter */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Funding</h4>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="range"
                    min={1000}
                    max={10000}
                    value={filters.funding.min}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        funding: {
                          ...filters.funding,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                    style={{ width: "100%" }}
                  />
                  <div style={customStyles.fundingRange}>
                    <span style={{ fontWeight: "500" }}>
                      ${filters.funding.min}
                    </span>
                    <span style={{ fontWeight: "500" }}>
                      ${filters.funding.max}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Labs Grid */}
            <div style={customStyles.labsContent}>
              <div style={customStyles.labsSection}>
                <h3 style={customStyles.sectionTitle}>
                  Recommended Labs for You
                </h3>
                <p style={customStyles.sectionDescription}>
                  Based on your transcript and resume, we recommend these labs
                  as potential matches for your interests and skills.
                </p>

                <div style={customStyles.labsGrid}>
                  {filteredLabs.map((lab) => (
                    <div key={lab.id} style={customStyles.labCard}>
                      <div style={customStyles.labCardContent}>
                        <div style={customStyles.labCardHeader}>
                          <h4 style={customStyles.labName}>{lab.name}</h4>
                        </div>
                        <p style={customStyles.department}>{lab.department}</p>
                        <a href={`/directory/${lab.id}`}>
                          <button style={customStyles.viewProfileButton}>
                            View Profile
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
