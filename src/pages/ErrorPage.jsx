import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div>
      <div className="mt-20 text-center">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-9xl text-red"
        />
      </div>
      <div className="align-center mx-auto w-sm justify-center text-center">
        <h1 className="my-7 font-nunito text-3xl font-semibold text-shadow-lg">
          Woops...
        </h1>
        <p className="text-left font-openSans">
          The page you're looking for doesn't exist (error 404).
        </p>
        <p className="text-left font-openSans">
          Please check the URL or return to the homepage.
        </p>
      </div>
      <div className="mx-auto text-center">
        <Link to={"/"}>
          <button className="my-8 rounded-lg bg-accent px-5 py-3 font-montserrat text-xl font-semibold shadow-lg transition-transform hover:scale-105">
            Go back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
