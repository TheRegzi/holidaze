import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("customer");

  const isCustomer = role === "customer";
  const isVenueManager = role === "venueManager";

  const labelClass = "font-nunito text-lg font-bold text-black";
  const inputClass =
    "font-openSans text-md border-2 border-accentLight2 rounded-md p-2 shadow-lg";

  return (
    <div>
      <h1 className="my-8 text-center font-nunito text-3xl font-semibold text-shadow-lg">
        Register
      </h1>
      <form className="mx-auto flex w-1/2 w-xs flex-col justify-center gap-4 sm:w-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
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
            className={inputClass}
            placeholder="Enter password"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Select Account type</label>
          <div className="mx-auto flex w-full gap-0">
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 ${isCustomer ? "border-2 border-accent bg-primary font-semibold text-darkGrey shadow-lg" : "border-2 border-darkGrey bg-white font-semibold text-gray-700"}`}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 ${isVenueManager ? "border-2 border-accent bg-primary font-semibold text-darkGrey shadow-lg" : "border-2 border-darkGrey bg-white font-semibold text-gray-700"}`}
              onClick={() => setRole("venueManager")}
            >
              Venue Manager
            </button>
          </div>
          {isCustomer && (
            <div className="mt-2 py-2">
              <h1 className="text-md mb-2 font-bold text-black">
                Customer account
              </h1>
              <p className="font-openSans text-sm text-darkGrey">
                As a <b>Customer</b>, you can browse, search for, and book
                venues for your next get-away!
              </p>
            </div>
          )}
          {isVenueManager && (
            <div className="mt-2 py-2">
              <h1 className="text-md mb-2 font-nunito font-bold text-black">
                Venue Manager account
              </h1>
              <p className="font-openSans text-sm text-darkGrey">
                A <b>Venue Manager account</b> is for creating venues and
                managing them!
              </p>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mx-auto mt-4 w-36 rounded bg-accent py-2 font-montserrat font-semibold text-black"
        >
          Register
        </button>
      </form>
      <p className="mt-5 text-center font-openSans text-sm text-darkGrey">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-red">
          Log in here!
        </Link>
      </p>
    </div>
  );
}

export default Register;
