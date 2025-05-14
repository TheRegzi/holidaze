import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth/loginUser";

/**
 * Login page component that displays the form with fields for e-mail and password.
 * It handles user authentication, and manages errors, loading, and success states.
 *
 * @returns {JSX.Element} The rendered login page.
 */
function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const labelClass = "font-nunito text-lg font-bold text-black";
  const inputClass =
    "rounded-lg border-2 border-accentLight2 bg-white px-4 py-2 text-md font-openSans text-darkGrey shadow-md focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("accessToken", data.data.accessToken);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="my-8 text-center font-nunito text-3xl font-semibold text-shadow-lg">
        Login
      </h1>
      <form
        className="mx-auto flex w-1/2 w-xs flex-col justify-center gap-4 sm:w-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter e-mail"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter password"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="mx-auto mt-4 w-36 rounded bg-accent py-2 font-montserrat font-semibold text-black"
        >
          {loading ? "Logging  in..." : "Log in"}
        </button>
      </form>
      {error && (
        <div className="mx-auto mt-6 w-56 rounded-lg border-2 border-red p-3 text-center font-semibold text-red">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-center font-semibold text-green">
          Logged in! Redirecting...
        </div>
      )}
      <p className="mt-5 text-center font-openSans text-sm text-darkGrey">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-red">
          Register here!
        </Link>
      </p>
    </div>
  );
}

export default Login;
