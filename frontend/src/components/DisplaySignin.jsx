import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import ButtonWithSound from "./ButtonWithSound.jsx";
import Alert from "./Alert.jsx";
import { useNavigate } from "react-router-dom";

export default function DisplayAuth() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [view, setView] = useState("login");

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
    <>
      <GlobalStyle />
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col mobile-bg"
        style={{
          backgroundImage: "url('src/assets/images/bg-login.png')",
          fontFamily: "'Jersey 20', sans-serif",
        }}
      >
        {/* Authentication Section */}
        <div className="rounded-lg p-6 w-96 h-auto mx-auto mt-[8rem] ml-80 ">
          <div className="relative flex flex-col items-center mb-1">
            <div
              style={{
                backgroundImage: "url('src/assets/images/coin.gif')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "200px",
                height: "200px",
                position: "absolute",
                top: "-80%",
              }}
            ></div>

            <div
              style={{
                backgroundImage: "url('src/assets/images/final-logo.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "400px",
                height: "150px",
              }}
            ></div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mb-6 gap-8">
            <h2
              className={` font-semibold text-center mb-4 cursor-pointer ${
                view === "signup"
                  ? "text-black border-b-2 border-black pb-2"
                  : "text-gray-500"
              }`}
              onClick={() => setView("signup")}
              style={{
                whiteSpace: "nowrap",
                padding: "0 10px",
                fontSize: "2rem",
              }}
            >
              CREATE ACCOUNT
            </h2>
            <h2
              className={` font-semibold text-center mb-4 cursor-pointer ${
                view === "login"
                  ? "text-black border-b-2 border-black pb-2"
                  : "text-gray-500"
              }`}
              onClick={() => setView("login")}
              style={{
                whiteSpace: "nowrap",
                padding: "0 10px",
                fontSize: "2rem",
              }}
            >
              LOG IN
            </h2>
          </div>

          {/* Login Form */}
          {view === "login" && (
            <>
              <StyledInput>
                <div className="input-container">
                  <input
                    type="text"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username" className="label">
                    Enter Username or Email
                  </label>
                  <div className="underline" />
                </div>
              </StyledInput>

              <StyledInput>
                <div className="input-container">
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" className="label">
                    Enter Password
                  </label>
                  <div className="underline" />
                </div>
              </StyledInput>

              <div className="flex mb-3 relative items-center justify-center">
                <StyledButton onClick={handleLogin}>
                  LOG IN ACCOUNT
                </StyledButton>
              </div>
            </>
          )}

          {/* Sign Up Form */}
          {view === "signup" && (
            <>
              <StyledInput>
                <div className="input-container">
                  <input type="text" id="signup-username" required />
                  <label htmlFor="signup-username" className="label">
                    Enter Username
                  </label>
                  <div className="underline" />
                </div>
              </StyledInput>

              <StyledInput>
                <div className="input-container">
                  <input type="email" id="signup-email" required />
                  <label htmlFor="signup-email" className="label">
                    Enter Email
                  </label>
                  <div className="underline" />
                </div>
              </StyledInput>

              <StyledInput>
                <div className="input-container">
                  <input type="password" id="signup-password" required />
                  <label htmlFor="signup-password" className="label">
                    Enter Password
                  </label>
                  <div className="underline" />
                </div>
              </StyledInput>

              <div className="mb-3 relative flex items-center justify-center">
                <StyledButton onClick={() => console.log("Sign Up clicked")}>
                  CREATE ACCOUNT
                </StyledButton>
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
    </>
  );
}

const StyledButton = styled.button`
  --bg: #c14600;
  --hover-bg: rgb(237, 107, 0);
  --hover-text: #fff;
  color: #fff;
  cursor: pointer;
  border: 1px solid var(--bg);
  border-radius: 4px;
  padding: 0.6em 2em;
  background: var(--bg);
  transition: 0.2s;
  font-size: 1.5rem;
  width: 80%;
  max-width: 250px;

  &:hover {
    color: var(--hover-text);
    transform: translate(-0.25rem, -0.25rem);
    background: var(--hover-bg);
    box-shadow: 0.25rem 0.25rem var(--bg);
  }

  &:active {
    transform: translate(0);
    box-shadow: none;
  }
`;

export const StyledInput = styled.div`
  .input-container {
    position: relative;
    margin: 1rem auto;
    width: 100%;
    max-width: 320px;
  }

  .input-container input {
    font-size: 1.5rem;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 0.75rem;
    background-color: transparent;
    outline: none;
    transition: border-color 0.3s ease;
    color: #000 !important;
  }

  .input-container .label {
    position: absolute;
    top: 1rem;
    left: 0.5rem;
    color: #000;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .input-container input:focus ~ .label,
  .input-container input:valid ~ .label {
    top: -1rem;
    font-size: 1rem;
  }

  .input-container input:hover {
    border-bottom: 2px solid #555;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .mobile-bg {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 100vh;
      width: 100vw;
    }

    .rounded-lg {
      width: 90%;
      margin: 0 auto;
      padding: 1rem;
      margin-top: 6rem;
    }

    .absolute div {
      width: 120px;
      height: 120px;
    }

    .absolute div:nth-child(2) {
      width: 250px;
      height: 100px;

    .flex {
      flex-direction: column;
      align-items: center;
    }

    .gap-8 {
      gap: 1rem;
    }

    .text-center {
      font-size: 1.5rem;
    }

    .input-container {
      max-width: 100%;
    }

    .input-container input {
      font-size: 1.2rem;
    }

    .input-container .label {
      font-size: 1.2rem;
    }

    .input-container input:focus ~ .label,
    .input-container input:valid ~ .label {
      font-size: 1rem;
    }

    .input-container input:hover {
      border-bottom: 2px solid #555;
    }

    .flex.mb-3.relative.items-center.justify-center {
      margin-top: 1rem;
    }

    .absolute {
      right: 10%;
      top: 30%;
    }
  }
`;
