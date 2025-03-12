import React, { useState } from "react";
import Input from "./Input";
import ButtonWithSound from "./ButtonWithSound.jsx";
import Alert from "./Alert.jsx";
import { useNavigate } from "react-router-dom";

export default function DisplayAuth() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [view, setView] = useState("login"); // "login" or "signup"

  // State for login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
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
        body: JSON.stringify({ username, PASSWORD: password }),
      });

      const res = await response.json();

      if (res.success) {
        sessionStorage.setItem("username", res.data.username);
        sessionStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        setAlert({ type: "error", message: "Incorrect Username or Password" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="flex h-screen w-screen bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/bg-login.png')",
        fontFamily: "'Jersey 20', sans-serif" /* Custom Font */,
      }}
    >
      <div className="rounded-lg p-6 w-96 h-auto mx-auto mt-40 ml-80">
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-6 gap-8">
          <h2
            className={`text-2xl pl-5 pr-5 pb-3 font-semibold text-center mb-4 cursor-pointer ${
              view === "signup"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setView("signup")}
          >
            CREATE ACCOUNT
          </h2>
          <h2
            className={`text-2xl pl-5 pr-5 pb-3 font-semibold text-center mb-4 cursor-pointer ${
              view === "login"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setView("login")}
          >
            LOG IN
          </h2>
        </div>

        {/* Login Form */}
        {view === "login" && (
          <>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border-b-2 border-black bg-transparent text-[18px] text-black mb-3 focus:outline-none"
              />
            </div>

            <div className="mb-3 relative">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-b-2 border-black bg-transparent text-[18px] text-black mb-3 focus:outline-none"
              />
            </div>

            <div className="flex mb-3 relative items-center justify-center">
              <button
                onClick={handleLogin}
                style={{ backgroundColor: "#41644A" }}
                className="w-40 text-1xl"
              >
                LOG IN ACCOUNT
              </button>
            </div>
          </>
        )}

        {/* Sign Up Form */}
        {view === "signup" && (
          <>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full p-2 border-b-2 border-black bg-transparent text-[18px] text-black mb-3 focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full p-2 border-b-2 border-black bg-transparent text-[18px] text-black mb-3 focus:outline-none"
              />
            </div>

            <div className="mb-3 relative">
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full p-2 border-b-2 border-black bg-transparent text-[18px] text-black mb-3 focus:outline-none"
              />
            </div>

            <div className="mb-3 relative flex items-center justify-center">
              <button
                onClick={() => console.log("Sign Up clicked")}
                style={{ backgroundColor: "#C14600" }}
                className="w-40"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </>
        )}

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
}
