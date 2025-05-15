import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth/registerUser";
import { useNavigate } from "react-router-dom";

/**
 * Register page component that displays a register form for registering a user.
 * It collects username, email, password (with confirmation).
 * One also need to choose if it should be a customer or venue manager account.
 * Handles loading, error and success registration states.
 *
 * @returns {JSX.Element} The rendered register page.
 */
function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const labelClass = "font-nunito text-lg font-bold text-black";
  const inputClass =
    "rounded-lg border-2 border-accentLight2 bg-white px-4 py-2 text-md font-openSans text-darkGrey shadow-md focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const isCustomer = role === "customer";
  const isVenueManager = role === "venueManager";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="my-8 text-center font-nunito text-3xl font-semibold text-shadow-lg">
        Register
      </h1>
      <form
        className="mx-auto flex w-1/2 w-xs flex-col justify-center gap-4 sm:w-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter username"
          />
        </div>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Select Account type</label>
          <div className="mx-auto flex w-full gap-0">
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 ${isCustomer ? "z-20 -mr-3 border-2 border-accent bg-primary font-semibold text-darkGrey shadow-lg" : "border-2 border-darkGrey bg-white font-semibold text-gray-700"}`}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 ${isVenueManager ? "z-20 -ml-3 border-2 border-accent bg-primary font-semibold text-darkGrey shadow-lg" : "border-2 border-darkGrey bg-white font-semibold text-gray-700"}`}
              onClick={() => setRole("venueManager")}
            >
              Venue Manager
            </button>
          </div>
          {isCustomer && (
            <div className="mt-2 pt-2">
              <h1 className={labelClass}>Customer account</h1>
              <p className="mt-2 font-openSans text-sm text-darkGrey">
                With a <b>Customer account</b>, you can browse, search for, and
                book venues for your next get-away!
              </p>
            </div>
          )}
          {isVenueManager && (
            <div className="mt-2 pt-2">
              <h1 className={labelClass}>Venue Manager account</h1>
              <p className="mt-2 font-openSans text-sm text-darkGrey">
                A <b>Venue Manager account</b> is for creating venues and
                managing them!
              </p>
            </div>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="mx-auto mt-4 w-36 rounded bg-accent py-2 font-montserrat font-semibold text-black"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && (
        <div className="mx-auto mt-6 w-56 rounded-lg border-2 border-red p-3 text-center font-semibold text-red">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-center font-semibold text-green">
          Registered! Redirecting...
        </div>
      )}
      <p className="my-5 text-center font-openSans text-sm text-darkGrey">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-red">
          Log in here!
        </Link>
      </p>
    </div>
  );
}

export default Register;
