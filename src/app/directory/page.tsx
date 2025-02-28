// app/directory/page.tsx
"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from "react";
import styles from "../page.module.css"; // Import your CSS module for styling
import Papa from "papaparse";

interface Lab {
  id: number;
  name: string;
  department: string;
  description: string;
  profName: string;
  relevantMajors: string[];  // Add array of relevant majors
  focusAreas: string[];      // Add array of focus areas
}

interface CsvRow {
  Name: string;
  Department: string;
  Description: string;
  Professor: string;
}

interface Filters {
  departments: {
    [key: string]: boolean;
  };
  focus: {
    [key: string]: boolean;
  };
  majors: {
    [key: string]: boolean;
  };
}

// Enhanced keyword mapping for better major-lab matching
const majorKeywords: { [key: string]: string[] } = {
  "Computer Science": [
    "computer science",
    "programming",
    "software",
    "algorithms",
    "AI",
    "machine learning",
    "data science",
    "artificial intelligence",
    "computational",
    "database",
    "web development",
    "cybersecurity",
    "computer vision",
    "natural language processing"
  ],
  "Electrical Engineering": [
    "electrical",
    "circuits",
    "electronics",
    "signal processing",
    "embedded systems",
    "power systems",
    "microelectronics",
    "control systems",
    "semiconductor",
    "VLSI",
    "communications",
    "RF",
    "wireless"
  ],
  "Mechanical Engineering": [
    "mechanical",
    "robotics",
    "dynamics",
    "thermodynamics",
    "materials",
    "fluid mechanics",
    "heat transfer",
    "CAD",
    "manufacturing",
    "aerospace",
    "automotive",
    "biomechanics",
    "mechatronics"
  ],
  "Chemical Engineering": [
    "chemical",
    "process",
    "materials science",
    "polymers",
    "reaction engineering",
    "separation processes",
    "catalysis",
    "biochemical",
    "nanotechnology",
    "electrochemistry"
  ],
  "Biology": [
    "biology",
    "molecular",
    "cellular",
    "genetics",
    "biochemistry",
    "microbiology",
    "immunology",
    "neuroscience",
    "physiology",
    "biotechnology",
    "genomics",
    "proteomics"
  ],
  "Chemistry": [
    "chemistry",
    "organic",
    "inorganic",
    "analytical",
    "synthesis",
    "physical chemistry",
    "spectroscopy",
    "materials chemistry",
    "biochemistry",
    "pharmaceutical"
  ],
  "Physics": [
    "physics",
    "quantum",
    "optics",
    "mechanics",
    "theoretical",
    "astrophysics",
    "particle physics",
    "condensed matter",
    "nuclear",
    "plasma",
    "computational physics"
  ],
  "Mathematics": [
    "mathematics",
    "mathematical",
    "statistics",
    "computational",
    "analysis",
    "algebra",
    "topology",
    "probability",
    "optimization",
    "numerical methods",
    "differential equations"
  ]
};

// Enhanced analysis function with scoring
const analyzeLabForMajors = (description: string, department: string): string[] => {
  const scores: { [key: string]: number } = {};
  const descriptionLower = description.toLowerCase();
  const departmentLower = department.toLowerCase();

  // Initialize scores
  Object.keys(majorKeywords).forEach(major => {
    scores[major] = 0;
  });

  // Score based on department (higher weight)
  Object.keys(majorKeywords).forEach(major => {
    if (departmentLower.includes(major.toLowerCase())) {
      scores[major] += 3; // Higher weight for department match
    }
  });

  // Score based on keywords in description
  Object.entries(majorKeywords).forEach(([major, keywords]) => {
    keywords.forEach(keyword => {
      if (descriptionLower.includes(keyword.toLowerCase())) {
        scores[major] += 1;
      }
    });
  });

  // Return majors with scores above threshold (adjust as needed)
  const threshold = 2; // Minimum score to be considered relevant
  return Object.entries(scores)
    .filter(([_, score]) => score >= threshold)
    .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
    .map(([major, _]) => major);
};

// Helper function to analyze lab description and extract focus areas
const analyzeLabForFocus = (description: string): string[] => {
  const focusKeywords: { [key: string]: string[] } = {
    "Artificial Intelligence": ["artificial intelligence", "AI", "machine learning", "deep learning", "neural networks"],
    "Data Science": ["data science", "big data", "analytics", "statistical analysis", "data mining"],
    "Biotechnology": ["biotechnology", "genetic engineering", "molecular biology", "cell culture"],
    "Robotics": ["robotics", "automation", "control systems", "mechatronics"],
    "Materials Science": ["materials", "nanomaterials", "polymers", "composites"],
    "Environmental Science": ["environmental", "sustainability", "climate", "ecology"],
    "Quantum Computing": ["quantum", "quantum mechanics", "quantum computing"],
    "Medical Research": ["medical", "biomedical", "clinical", "therapeutic", "drug discovery"]
  };

  const focusAreas: string[] = [];
  const descriptionLower = description.toLowerCase();

  Object.entries(focusKeywords).forEach(([focus, keywords]) => {
    if (keywords.some(keyword => descriptionLower.includes(keyword))) {
      focusAreas.push(focus);
    }
  });

  return focusAreas;
};

export default function Directory() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    departments: {
      "Engineering": false,
      "Natural Sciences": false,
      "Computer & Data Sciences": false,
      "Life Sciences": false,
      "Physical Sciences": false,
      "Applied Sciences": false,
      "Mathematical Sciences": false,
      "Biomedical Sciences": false,
    },
    focus: {
      "Artificial Intelligence": false,
      "Data Science": false,
      "Biotechnology": false,
      "Robotics": false,
      "Materials Science": false,
      "Environmental Science": false,
      "Quantum Computing": false,
      "Medical Research": false,
    },
    majors: {
      // Engineering
      "Mechanical Engineering": false,
      "Electrical Engineering": false,
      "Chemical Engineering": false,
      "Computer Engineering": false,
      "Biomedical Engineering": false,
      "Civil Engineering": false,
      "Aerospace Engineering": false,
      "Environmental Engineering": false,
      "Materials Engineering": false,
      "Industrial Engineering": false,
      // Computer & Data Sciences
      "Computer Science": false,
      "Data Science": false,
      "Software Engineering": false,
      "Information Technology": false,
      // Life Sciences
      "Biology": false,
      "Biochemistry": false,
      "Molecular Biology": false,
      "Neuroscience": false,
      "Biotechnology": false,
      // Physical Sciences
      "Physics": false,
      "Chemistry": false,
      "Astronomy": false,
      "Earth Sciences": false,
      // Mathematical Sciences
      "Mathematics": false,
      "Applied Mathematics": false,
      "Statistics": false,
      "Computational Mathematics": false,
    },
  });

  // Helper function to map specific majors to broader departments
  const getMajorDepartment = (major: string): string => {
    const departmentMap: { [key: string]: string } = {
      // Engineering Department
      "Mechanical Engineering": "Engineering",
      "Electrical Engineering": "Engineering",
      "Chemical Engineering": "Engineering",
      "Computer Engineering": "Engineering",
      "Biomedical Engineering": "Engineering",
      "Civil Engineering": "Engineering",
      "Aerospace Engineering": "Engineering",
      "Environmental Engineering": "Engineering",
      "Materials Engineering": "Engineering",
      "Industrial Engineering": "Engineering",
      
      // Computer & Data Sciences Department
      "Computer Science": "Computer & Data Sciences",
      "Data Science": "Computer & Data Sciences",
      "Software Engineering": "Computer & Data Sciences",
      "Information Technology": "Computer & Data Sciences",
      
      // Life Sciences Department
      "Biology": "Life Sciences",
      "Biochemistry": "Life Sciences",
      "Molecular Biology": "Life Sciences",
      "Neuroscience": "Life Sciences",
      "Biotechnology": "Life Sciences",
      
      // Physical Sciences Department
      "Physics": "Physical Sciences",
      "Chemistry": "Physical Sciences",
      "Astronomy": "Physical Sciences",
      "Earth Sciences": "Physical Sciences",
      
      // Mathematical Sciences Department
      "Mathematics": "Mathematical Sciences",
      "Applied Mathematics": "Mathematical Sciences",
      "Statistics": "Mathematical Sciences",
      "Computational Mathematics": "Mathematical Sciences",
    };
    return departmentMap[major] || "";
  };

  // Fetch labs data
  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmDz9hjnoVXz6sgthlfFxb9HLI8bNDqXa7VGPG1hgCTisC5i1N28FgWR0qmHqAHBepV1fE5_YpIbyq/pub?output=csv";

    Papa.parse<CsvRow>(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const labs = results.data.map((row, index) => {
          const relevantMajors = analyzeLabForMajors(row.Description, row.Department);
          const focusAreas = analyzeLabForFocus(row.Description);
          
          return {
            id: index + 1,
            name: row.Name,
            department: row.Department,
            description: row.Description,
            profName: row.Professor,
            relevantMajors,
            focusAreas,
          };
        });
        setLabs(labs);
        setFilteredLabs(labs);
      },
    });
  }, []); // Empty dependency array for loading once

  // Update department filter for dropdown
  const toggleDepartmentFilter = (department: string) => {
    const newDepartments = Object.keys(filters.departments).reduce((acc, dept) => ({
      ...acc,
      [dept]: dept === department // Only set selected department to true
    }), {});

    setFilters({
      ...filters,
      departments: department === "" ? // If "All Departments" is selected
        Object.keys(filters.departments).reduce((acc, dept) => ({
          ...acc,
          [dept]: false
        }), {}) 
        : newDepartments
    });
  };

  // Update focus filter for dropdown
  const toggleFocusFilter = (focus: string) => {
    const newFocus = Object.keys(filters.focus).reduce((acc, f) => ({
      ...acc,
      [f]: f === focus // Only set selected focus to true
    }), {});

    setFilters({
      ...filters,
      focus: focus === "" ? // If "All Focus Areas" is selected
        Object.keys(filters.focus).reduce((acc, f) => ({
          ...acc,
          [f]: false
        }), {})
        : newFocus
    });
  };

  // Add major filter toggle function
  const toggleMajorFilter = (major: string) => {
    const newMajors = Object.keys(filters.majors).reduce((acc, m) => ({
      ...acc,
      [m]: m === major // Only set selected major to true
    }), {});

    setFilters({
      ...filters,
      majors: major === "" ? // If "All Majors" is selected
        Object.keys(filters.majors).reduce((acc, m) => ({
          ...acc,
          [m]: false
        }), {})
        : newMajors
    });
  };

  // Update filterLabs function to use the department mapping
  const filterLabs = (searchTerm: string) => {
    const filtered = labs.filter((lab) => {
      const searchFields = [
        lab.name?.toLowerCase() || "",
        lab.department?.toLowerCase() || "",
        lab.description?.toLowerCase() || "",
        lab.profName?.toLowerCase() || "",
      ];
      const searchTermLower = searchTerm.toLowerCase();
      
      const selectedDepartment = Object.entries(filters.departments).find(([_, isSelected]) => isSelected);
      const selectedFocus = Object.entries(filters.focus).find(([_, isSelected]) => isSelected);
      const selectedMajor = Object.entries(filters.majors).find(([_, isSelected]) => isSelected);

      // Department matching now checks if the lab's department falls under the broader category
      const departmentMatch = !selectedDepartment || (
        selectedDepartment && 
        (lab.department.includes(selectedDepartment[0]) || 
         lab.relevantMajors.some(major => getMajorDepartment(major) === selectedDepartment[0]))
      );
      
      const focusMatch = !selectedFocus || (selectedFocus && lab.focusAreas.includes(selectedFocus[0]));
      const majorMatch = !selectedMajor || (selectedMajor && lab.relevantMajors.includes(selectedMajor[0]));

      return (
        searchFields.some(field => field.includes(searchTermLower)) &&
        departmentMatch &&
        focusMatch &&
        majorMatch
      );
    });

    setFilteredLabs(filtered);
  };

  // Update useEffect to include all filter dependencies
  useEffect(() => {
    filterLabs(searchTerm);
  }, [searchTerm, filters.departments, filters.focus, filters.majors, labs]);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

              {/* Department Filter Dropdown */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Department</h4>
                </div>
                <select
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                    marginBottom: "1rem"
                  }}
                  onChange={(e) => toggleDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {Object.keys(filters.departments).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Focus Filter Dropdown */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Focus</h4>
                </div>
                <select
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                  }}
                  onChange={(e) => toggleFocusFilter(e.target.value)}
                >
                  <option value="">All Focus Areas</option>
                  {Object.keys(filters.focus).map((focus) => (
                    <option key={focus} value={focus}>
                      {focus}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major Filter Dropdown */}
              <div style={customStyles.filterSection}>
                <div style={customStyles.filterHeader}>
                  <h4 style={customStyles.filterTitle}>Major</h4>
                </div>
                <select
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                    marginBottom: "1rem"
                  }}
                  onChange={(e) => toggleMajorFilter(e.target.value)}
                >
                  <option value="">All Majors</option>
                  {Object.keys(filters.majors).map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
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
