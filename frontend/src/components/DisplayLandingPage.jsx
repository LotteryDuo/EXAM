import React from "react";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert.jsx";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonWithSound from "./ButtonWithSound.jsx";

export default function displaySignIn(root) {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div
        className="w-screen h-screen bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url('src/assets/images/Landing-Page.png')" }}
      ></div>
    </div>
  );
}
