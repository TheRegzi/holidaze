import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

/**
 * The error page content which displays a 404 error message when the user is on a route that doesn't exist.
 * Includes an error icon, explanation text, and a button to navigate back to the home page.
 *
 * @returns {JSX.Element} The rendered error page.
 */
function ErrorPage() {
  return (
    <div>
      <div className="mt-20 text-center">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-9xl text-red"
          aria-label="Error icon"
          role="img"
        />
      </div>
      <div className="align-center mx-auto justify-center text-center">
        <h1 className="my-7 font-nunito text-3xl font-semibold text-shadow-lg">
          Woops...
        </h1>
        <p className="mx-auto w-[350px] text-left font-openSans sm:w-sm">
          The page you're looking for doesn't exist (error 404).
        </p>
        <p className="mx-auto w-[350px] text-left font-openSans sm:w-sm">
          Please check the URL or return to the homepage.
        </p>
      </div>
      <div className="mx-auto text-center">
        <Link
          to="/"
          className="my-8 inline-block rounded-lg bg-accent px-5 py-2 font-montserrat text-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
