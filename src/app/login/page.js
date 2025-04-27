"use client";

import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { loginUser, registerUser } from "@/services/login";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import styles from "./login.module.css";
export default function Login() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

  const handleLoginSubmit = (values, resetForm) => {
    setLoading(true);
    const payload = {
      identifier: values?.email,
      password: values?.password,
    };

    loginUser(payload)
      .then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.jwt);
        localStorage.setItem("userProfile", JSON.stringify(res.user));
        toast.success("Logged in successfully!");
        resetForm();
        router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message?.response?.data?.error?.message);
      });
  };

  const handleRegisterSubmit = (values, resetForm) => {
    setLoading(true);
    const payload = {
      username: values?.user,
      email: values?.email,
      password: values?.password,
    };

    registerUser(payload)
      .then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.jwt);
        localStorage.setItem("userProfile", JSON.stringify(res.user));
        toast.success("Signed up successfully!");
        resetForm();
        router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message?.response?.data?.error?.message);
      });
  };

  return (
    <div className={styles.authLoginPanel}>
      <div className={styles.authContainer}>
        <div className={styles.authRow}>
          <div className={styles.authLeft}>
            <div className={styles.authLeftPanel}></div>
          </div>

          <div className={styles.authRight}>
            {loading && (
              <div className="loader"></div> // Show loader when loading is true
            )}
            <div className={styles.authRightPanel}>
              <div className={styles.authTabContainer}>
                <Tabs defaultIndex={0} onSelect={(index) => console.log(index)}>
                  {/* Tab Header */}
                  <TabList className={styles.authTabList}>
                    <Tab
                      className={styles.authTab}
                      onClick={() => {
                        setCount(0);
                        setShowPassword(false);
                      }}
                    >
                      Log In
                    </Tab>
                    <Tab
                      className={styles.authTab}
                      onClick={() => {
                        setCount(1);
                        setShowPassword(false);
                      }}
                    >
                      Sign Up
                    </Tab>
                  </TabList>

                  {/* LOGIN TAB PANEL */}
                  <TabPanel>
                    <h1 className={styles.authHeading}>Welcome back</h1>
                    <p className={styles.authSubheading}>
                      Good to see you again
                    </p>
                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validationSchema={Yup.object({
                        email: Yup.string()
                          .email("Invalid Email")
                          .required("Email is required"),
                        password: Yup.string()
                          .matches(passwordRules, {
                            message:
                              "Password must include lowercase, uppercase, number, and special character",
                          })
                          .min(6, "Password must be at least 6 characters")
                          .required("Password is required"),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        handleLoginSubmit(values, resetForm);
                      }}
                    >
                      {({ errors, touched }) => (
                        <Form className={styles.authForm}>
                          <div className="form-floating mb-3">
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              className={styles.formControl}
                              id="Email"
                            />
                            <label htmlFor="Email">Email</label>
                            {touched.email && errors.email && (
                              <div className={styles.authError}>
                                {errors.email}
                              </div>
                            )}
                          </div>

                          <div className="form-floating mb-3">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter Password"
                              className={styles.formControl}
                              id="Password"
                            />
                            <label htmlFor="Password">Password</label>
                            {touched.password && errors.password && (
                              <div className={styles.authError}>
                                {errors.password}
                              </div>
                            )}
                          </div>

                          <button type="submit" className={styles.authBtn}>
                            LOGIN
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>

                  {/* SIGNUP TAB PANEL */}
                  <TabPanel>
                    <h1 className={styles.authHeading}>Hello there,</h1>
                    <p className={styles.authSubheading}>
                      We are excited to see you here
                    </p>
                    <Formik
                      initialValues={{
                        user: "",
                        email: "",
                        password: "",
                        confirm_password: "",
                      }}
                      validationSchema={Yup.object({
                        user: Yup.string().required("User Name is required"),
                        email: Yup.string()
                          .email("Invalid Email")
                          .required("Email is required"),
                        password: Yup.string()
                          .matches(passwordRules, {
                            message:
                              "Password must include lowercase, uppercase, number, and special character",
                          })
                          .min(6, "Password must be at least 6 characters")
                          .required("Password is required"),
                        confirm_password: Yup.string()
                          .required("Confirm Password is required")
                          .oneOf(
                            [Yup.ref("password"), null],
                            "Passwords must match"
                          ),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        handleRegisterSubmit(values, resetForm);
                      }}
                    >
                      {({ errors, touched }) => (
                        <Form className={styles.authForm}>
                          <div className="form-floating mb-3">
                            <Field
                              type="text"
                              name="user"
                              placeholder="Enter User Name"
                              className={styles.formControl}
                              id="userName"
                            />
                            <label htmlFor="userName">User Name</label>
                            {touched.user && errors.user && (
                              <div className={styles.authError}>
                                {errors.user}
                              </div>
                            )}
                          </div>

                          <div className="form-floating mb-3">
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              className={styles.formControl}
                              id="Email"
                            />
                            <label htmlFor="Email">Email</label>
                            {touched.email && errors.email && (
                              <div className={styles.authError}>
                                {errors.email}
                              </div>
                            )}
                          </div>

                          <div className="form-floating mb-3">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter Password"
                              className={styles.formControl}
                              id="Password"
                            />
                            <label htmlFor="Password">Password</label>
                            {touched.password && errors.password && (
                              <div className={styles.authError}>
                                {errors.password}
                              </div>
                            )}
                          </div>

                          <div className="form-floating mb-4">
                            <Field
                              className={styles.formControl}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Confirm Password"
                              name="confirm_password"
                              id="confirmPassword"
                            />
                            <label htmlFor="confirmPassword">
                              Confirm Password
                            </label>
                            {touched.confirm_password &&
                              errors.confirm_password && (
                                <div className={styles.authError}>
                                  {errors.confirm_password}
                                </div>
                              )}
                          </div>

                          <button type="submit" className={styles.authBtn}>
                            SIGN UP
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
