"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { clientf } from "@/appollo-client/clientf";
import { SNIPPET_COLLECTION_LIST } from "@/appollo-client/query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const router = useRouter();
  const [snippetCollection, setSnippetCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const handleLogOut = () => {
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokencurr = localStorage.getItem("token");
      if (!tokencurr) {
        router.push("/login");
      }
      setUserProfile(JSON.parse(localStorage.getItem("userProfile")));
      setToken(tokencurr);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      getSnippets();
    }
  }, [userProfile, searchTerm, selectedLanguage]);

  async function getSnippets() {
    setLoading(true);
    const variables = {
      filters: {
        users_permissions_user: {
          documentId: {
            eq: userProfile?.documentId,
          },
        },
        or:
          searchTerm && selectedLanguage
            ? [
                {
                  language: {
                    eq: selectedLanguage,
                  },
                },
                {
                  smartcategories: {
                    contains: searchTerm,
                  },
                },
                {
                  snippet: {
                    contains: searchTerm,
                  },
                },
                {
                  title: {
                    contains: searchTerm,
                  },
                },
                {
                  subheading: {
                    contains: searchTerm,
                  },
                },
              ]
            : searchTerm
            ? [
                {
                  smartcategories: {
                    contains: searchTerm,
                  },
                },
                {
                  snippet: {
                    contains: searchTerm,
                  },
                },
                {
                  title: {
                    contains: searchTerm,
                  },
                },
                {
                  subheading: {
                    contains: searchTerm,
                  },
                },
              ]
            : selectedLanguage
            ? [
                {
                  language: {
                    eq: selectedLanguage,
                  },
                },
              ]
            : null,
      },
    };

    try {
      let productData = await clientf.request(
        SNIPPET_COLLECTION_LIST,
        variables
      );
      const { snipStashes } = productData;
      setSnippetCollection(snipStashes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching snippets:", error);
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Right Buttons */}
      <div className={styles.topActions}>
        <button
          className={styles.addButton}
          onClick={() => router.push("/snip-stash-creation")}
        >
          ➕ Add Snippet
        </button>
        <button className={styles.logoutButton} onClick={handleLogOut}>
          🚪 Logout
        </button>
      </div>
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search Title, Subheading, Snippets..."
          className={styles.searchBox}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className={styles.languageSelect}
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="c++">C++</option>
          <option value="php">PHP</option>
          <option value="HTML">HTML</option>
        </select>
      </div>
      {/* Snippet List */}
      <div className={styles.snippetList}>
        {loading ? (
          <div className="loader"></div> // Show loader when loading is true
        ) : snippetCollection.length === 0 ? (
          <p>No snippets found!</p>
        ) : (
          snippetCollection.map((item) => (
            <div key={item?.documentId} className={styles.snippetCard}>
              {/* <h2 className={styles.snippetTitle}>{item?.title}</h2> */}
              <div className={styles.snippetHeader}>
                <h2 className={styles.snippetTitle}>{item?.title}</h2>
                <div className={styles.badges}>
                  <span className={styles.languageBadge}>{item?.language}</span>
                  {item?.smartcategories && (
                    <span className={styles.categoryBadge}>
                      {item?.smartcategories}
                    </span>
                  )}
                </div>
              </div>
              <h4 className={styles.snippetSubheading}>{item?.subheading}</h4>

              <pre className={styles.codeBlock}>
                <code>{item?.snippet}</code>
              </pre>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
