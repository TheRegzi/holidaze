import { useState } from "react";
import SearchBar from "../components/Searchbar";
import VenueList from "../components/Venues";

/**
 * The home page component, which displays a banner with a search component, and the venues section to display all the venue cards.
 * When searching for a venue, the venues section displays the filtered venue cards.
 *
 * @returns {JSX.Element} The rendered home page.
 */
function Home() {
  const [searchParams, setSearchParams] = useState({
    location: "",
    startDate: "",
    endDate: "",
    guests: "",
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <>
      <div className="relative">
        <img
          className="h-[700px] w-full object-cover object-[center_60%]"
          src="/assets/derick-mckinney-GhX9SH0bNcc-unsplash.jpg"
          loading="lazy"
        />
        <h1 className="absolute left-1/2 top-14 w-xs -translate-x-1/2 bg-black/50 p-3 text-center font-rancho text-5xl text-white sm:w-sm">
          Ready for your next holiday?
        </h1>
        <div className="absolute bottom-0 left-1/2 z-[999] w-full -translate-x-1/2 -translate-y-1/4 bg-black/50 sm:w-auto md:-translate-y-1/2">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <VenueList searchParams={searchParams} />
      </main>
    </>
  );
}

export default Home;
