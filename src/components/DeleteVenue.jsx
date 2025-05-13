import { useNavigate } from "react-router-dom";
import { useDeleteVenue } from "../api/venues/delete";

function DeleteVenue({ id }) {
  const navigate = useNavigate();
  const { loading, success, error, deleteVenue } = useDeleteVenue({
    id,
    onSuccess: () => {
      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    },
  });

  return (
    <div>
      <button
        className="mt-2 w-[170px] rounded-lg border-2 border-red bg-white p-2 font-montserrat font-semibold text-red shadow-lg transition-transform hover:scale-105"
        onClick={deleteVenue}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete venue"}
      </button>
      {success && (
        <div className="text-md mt-2 font-openSans font-semibold text-green">
          {success} Redirecting to profile.
        </div>
      )}
      {error && (
        <div className="text-md mt-2 font-openSans font-semibold text-red">
          {error}
        </div>
      )}
    </div>
  );
}

export default DeleteVenue;
