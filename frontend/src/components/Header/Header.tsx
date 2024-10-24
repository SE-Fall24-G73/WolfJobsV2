import { useState } from "react";
import { useUserStore } from "../../store/UserStore";
import NavBar from "./NavBar";
import NavBarItem from "./NavBarItem";

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-white backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-200 supports-backdrop-blur:bg-white/95">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between py-4 border-b border-gray-200 lg:px-8 lg:border-0 mx-4 lg:mx-0">
            {/* Logo */}
            <a className="flex-none" href={isLoggedIn ? "/dashboard" : "/"}>
              <img
                alt="logo"
                src="/images/wolfjobs-logo.png"
                className="h-10"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <ul className="flex space-x-8">
                {role === "Manager" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Listings" />
                )}
                {role === "Applicant" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Applications" />
                )}
                {isLoggedIn && <NavBarItem link="/explore" text="All Jobs" />}
              </ul>
              <NavBar />
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isLoggedIn && mobileMenuOpen && (
          <div className="sm:hidden">
            <ul className="px-2 pt-2 pb-3 space-y-1">
              {role === "Manager" && isLoggedIn && (
                <NavBarItem link="/dashboard" text="My Listings" />
              )}
              {role === "Applicant" && isLoggedIn && (
                <NavBarItem link="/dashboard" text="My Applications" />
              )}
              {isLoggedIn && <NavBarItem link="/explore" text="All Jobs" />}
              {/* Include other menu items if needed */}
            </ul>

            <NavBar />
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
