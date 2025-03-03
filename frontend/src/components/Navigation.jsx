import React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (event) => {
      event.preventDefault();
      const path = event.currentTarget.getAttribute("href");
      if (path) navigate(path);
    };

    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => link.addEventListener("click", handleNavigation));

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleNavigation)
      );
    };
  }, [navigate]);

  return (
    <nav className="navigation-container">
      <div className="settings-container-popper" id="popper"></div>
      <div className="setting-icon-btn">
        <svg
          id="settings-btn-icon"
          width="57"
          height="56"
          viewBox="0 0 57 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M51.2373 12.7907C51.2772 12.4995 51.298 12.2027 51.2999 11.9003C51.2996 10.366 50.7294 8.88442 49.6962 7.73379C48.663 6.58316 47.2379 5.84253 45.6883 5.6509C44.1387 5.45928 42.5713 5.82983 41.28 6.69301C39.9888 7.5562 39.0626 8.85267 38.6753 10.3391C38.288 11.8256 38.4661 13.3998 39.1763 14.7664C39.8865 16.1329 41.0799 17.1979 42.5326 17.7614C43.9852 18.3249 45.5973 18.3481 47.0661 17.8268C48.535 17.3055 49.7598 16.2754 50.5105 14.9299L50.5247 14.9019C50.881 14.2579 51.129 13.5467 51.2373 12.7907Z"
            fill="#F8F8F8"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </nav>
  );
};

export default Navigation;
