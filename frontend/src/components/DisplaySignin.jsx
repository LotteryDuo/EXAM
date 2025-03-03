import React from "react";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert.jsx";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonWithSound from "./ButtonWithSound.jsx";

export default function displaySignIn(root) {
  const navigator = useNavigate();
  const [alert, setAlert] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      console.error("Email or password is missing!");
      setAlert({ type: "error", message: "Email or password is missing!" });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/v1/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
        },
        body: JSON.stringify({
          username: username,
          PASSWORD: password,
        }),
      });

      const res = await response.json();

      if (res.success) {
        console.log(res);
        sessionStorage.setItem("username", res.data.username);
        sessionStorage.setItem("token", res.data.token);

        navigator("/home");
      } else {
        console.error(res.message);
        setAlert({ type: "error", message: "Incorrect Username or Password" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showPassword = () => {
    let passwordInput = document.getElementById("login-password");

    passwordInput.type === "password"
      ? (passwordInput.type = "text")
      : (passwordInput.type = "password");
  };

  return (
    <div className=" flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="bg-black shadow-lg rounded-lg p-6 w-96 h-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login to your Account!
        </h2>

        {/* Email/Username Input */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Enter Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="enter-email-username"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="mb-3 relative">
          <Input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Show Password Checkbox */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="show-password-login"
            className="mr-2"
            onChange={showPassword}
          />
          <label
            htmlFor="show-password-login"
            className="text-sm text-gray-600"
          >
            Show Password
          </label>
        </div>

        {/* Password Input */}
        <div className="mb-3 relative">
          <ButtonWithSound
            onClick={handleLogin}
            className="bg-blue-500 w-full hover:bg-blue-600"
          >
            Login
          </ButtonWithSound>
        </div>

        {/* Button Container (Add buttons here dynamically) */}
        <div className="flex justify-center" id="btn-container"></div>

        {/* Account Section */}
        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account?</p>
        </div>

        {/* Sign-Up Section */}
        <div className="text-center mt-2">
          <p
            id="sign-up-paragraph"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign Up
          </p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
