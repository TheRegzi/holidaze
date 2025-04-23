import SearchBar from "../components/Searchbar";

function Home() {
  return (
    <div className="relative">
      <img
        className="h-[700px] w-full object-cover object-[center_60%]"
        src="/assets/derick-mckinney-GhX9SH0bNcc-unsplash.jpg"
      />
      <h1 className="absolute left-1/2 top-14 w-xs -translate-x-1/2 bg-black/50 p-3 text-center font-rancho text-5xl text-white sm:w-sm">
        Ready for your next holiday?
      </h1>
      <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 -translate-y-1/4 bg-black/50 sm:w-auto md:-translate-y-1/2">
        <SearchBar />
      </div>
    </div>
  );
}

export default Home;
