"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import styles from "./snip_stash.module.css";
import { errorCodes } from "@apollo/client/invariantErrorCodes";
import { handleSnipForm } from "@/services/snip-stash";

const SnipStashCreation = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    title: "",
    subheading: "",
    snippet: "",
    language: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subheading: Yup.string().required("Subheading is required"),
    snippet: Yup.string().required("Snippet is required"),
    language: Yup.string().required("Language is required"),
  });
  function generateTagsFromSnippet(snippet) {
    if (!snippet) return "";

    const lowerSnippet = snippet.toLowerCase();
    const tags = new Set();

    if (lowerSnippet.includes("for") || lowerSnippet.includes("while")) {
      tags.add("loop");
    }

    if (
      lowerSnippet.includes("fetch") ||
      lowerSnippet.includes("axios") ||
      lowerSnippet.includes("xmlhttprequest")
    ) {
      tags.add("API");
    }

    if (lowerSnippet.includes("try") || lowerSnippet.includes("catch")) {
      tags.add("error handling");
    }

    if (lowerSnippet.includes(".map") || lowerSnippet.includes(".filter")) {
      tags.add("array ops");
    }

    if (lowerSnippet.includes("console.log")) {
      tags.add("debugging");
    }

    return Array.from(tags).join(", ");
  }

  const handleSubmit = (values, resetForm) => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    setLoading(true);
    const smartTags = generateTagsFromSnippet(values?.snippet);
    if (smartTags) {
      values.smartcategories = smartTags;
    }
    values.users_permissions_user = userProfile?.documentId;
    // your API call can go here
    handleSnipForm(values)
      .then((res) => {
        setLoading(false);
        toast.success("Snippet created successfully!");
        resetForm();
        router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  return (
    <>
      <div className={styles.container}>
        {/* {loading && <p>Loading...</p>} */}
        {loading && (
          <div className="loader"></div> // Show loader when loading is true
        )}
        <div className={styles.card}>
          <div className={styles.headerButtons}>
            <button
              onClick={() => router.push("/")}
              className={styles.backButton}
            >
              Back
            </button>
          </div>
          <h2 className={styles.title}>Create a Snippet</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Title
                  </label>
                  <Field
                    name="title"
                    className={styles.input}
                    placeholder="Enter title"
                  />
                  {touched.title && errors.title && (
                    <div className={styles.error}>{errors.title}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subheading" className={styles.label}>
                    Subheading
                  </label>
                  <Field
                    name="subheading"
                    className={styles.input}
                    placeholder="Enter subheading"
                  />
                  {touched.subheading && errors.subheading && (
                    <div className={styles.error}>{errors.subheading}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="snippet" className={styles.label}>
                    Snippet
                  </label>
                  <Field
                    name="snippet"
                    as="textarea"
                    className={styles.input}
                    placeholder="Enter your snippet here"
                    rows="6"
                  />
                  {touched.snippet && errors.snippet && (
                    <div className={styles.error}>{errors.snippet}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="language" className={styles.label}>
                    Language
                  </label>
                  <Field as="select" name="language" className={styles.input}>
                    <option value="">Select Language</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="c++">C++</option>
                    <option value="php">PHP</option>
                    <option value="HTML">HTML</option>
                  </Field>
                  {touched.language && errors.language && (
                    <div className={styles.error}>{errors.language}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  // disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

const SnipStashSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SnipStashCreation />
  </Suspense>
);

export default SnipStashSuspense;
