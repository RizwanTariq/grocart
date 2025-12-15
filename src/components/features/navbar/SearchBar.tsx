import { Search } from "lucide-react";

function SearchBar() {
  return (
    <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2.5 w-1/2 max-w-lg shadow-md">
      <Search className="w-5 h-5 text-gray-500" />
      <input
        type="search"
        placeholder="Search groceries..."
        className="w-full px-3 focus:outline-none text-gray-500 placeholder-gray-500"
      />
    </form>
  );
}

export default SearchBar;
