// import React, { useEffect } from "react";
// import { Outlet, Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/authContext/AuthProvider";
// import Loader from "../Loader";

// const Protected = () => {

//   const {authState} = useAuth()
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!authState.accessToken) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   return (
//     <div>
//       <Outlet />
//     </div>
//   );

// };

// export default Protected;

import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import Loader from "../Loader";

const Protected = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadComponent();
  }, [authState.accessToken, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!authState.accessToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Protected;
