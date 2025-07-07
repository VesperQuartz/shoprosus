"use client";
import { useState } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
  ) : (
    <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
  );
};

export default AuthWrapper;
