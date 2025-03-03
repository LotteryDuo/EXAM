import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Check() {
  const navigate = useNavigate();
  const userLoggedIn =
    localStorage.getItem("account_id") && localStorage.getItem("token");

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/home");
    } else {
      navigate("/sign-in");
    }
  }, [userLoggedIn, navigate]);

  return null;
}
