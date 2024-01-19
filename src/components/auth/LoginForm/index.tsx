import React, { useState } from "react";

import { useAuth } from "@/contexts/authContext/AuthProvider";

const LoginForm = () => {
  const { login } = useAuth();

  // const [email, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    grant_type: "",
    client_id: "",
    client_secret: "",
  });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, grant_type, client_id, client_secret } =
      formData;
    let formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("grant_type", grant_type);
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    login(formdata);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Login
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded w-full py-2 px-3"
                placeholder="Your Email"
                name="username"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded w-full py-2 px-3"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="md:w-2/3 lg:w-1/2 sm:w-1 text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              LOGIN
            </button>
          </div>
          <p className="text-center">
            <a href="/reset" className="underline">
              Forgot password
            </a>
          </p>
          <p className="text-center">
            New to Reatraunt?{" "}
            <a href="/register" className="underline">
              Click to Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
