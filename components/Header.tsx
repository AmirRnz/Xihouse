import { FaSearch } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md text-black">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Xi</span>
            <span className="text-slate-700">house</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3  rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link href="/home">
            <li className="header-nav">Home</li>
          </Link>
          <Link href="/home">
            <li className="header-nav">About</li>
          </Link>
          <Link href="/home">
            <li className="header-nav">Sign In</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
