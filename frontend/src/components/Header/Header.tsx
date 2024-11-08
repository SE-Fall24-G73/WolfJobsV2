/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/UserStore";
import NavBar from "./NavBar";
import NavBarItem from "./NavBarItem";
import axios from "axios";
import { API_ROOT } from "../../api/constants";

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn && role === "Applicant") {
      axios
        .get(`${API_ROOT}/users/fetchapplications`)
        .then((res) => {
          if (res.status === 200) {
            const applications = res.data.application;
            const acceptedCount = applications.filter(
              (app: any) => app.status === "accepted"
            ).length;
            const rejectedCount = applications.filter(
              (app: any) => app.status === "rejected"
            ).length;
            setNotificationCount(acceptedCount + rejectedCount);
          }
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);
        });
    }
  }, [isLoggedIn, role]);

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
            <div className="hidden lg:flex sm:items-center sm:space-x-8">
              <ul className="flex space-x-8">
                {role === "Manager" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Listings" />
                )}
                {role === "Applicant" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Applications" />
                )}
                {isLoggedIn && <NavBarItem link="/explore" text="All Jobs" />}
              </ul>
              <NavBar notificationCount={notificationCount} />
            </div>

            {/* Mobile Menu Button */}
            {isLoggedIn && (
              <>
                <div className="flex flex-row items-center justify-center gap-x-1 lg:hidden">
                  {isLoggedIn && role === "Applicant" && (
                    <>
                      <img
                        src={"/images/bell.png"}
                        alt="Notification"
                        className="w-6 h-6"
                      />
                      <span className="text-gray-500 text-sm">
                        ({notificationCount})
                      </span>
                    </>
                    // <NavBarItem
                    //   link="/notifications"
                    //   text={`Notifications (${notificationCount})`}
                    // />
                  )}
                  <div className="">
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
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu with Animation */}
        {isLoggedIn && (
          <div
            className={`lg:hidden absolute top-[60px] w-full bg-white z-50 overflow-hidden transform transition-all duration-300 ease-in-out origin-top ${
              mobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
          >
            <ul className="px-2 pt-6 pb-6 space-y-3 text-center text-xl">
              {role === "Manager" && (
                <NavBarItem
                  link="/dashboard"
                  text="My Listings"
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              )}
              {role === "Applicant" && (
                <NavBarItem
                  link="/dashboard"
                  text="My Applications"
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              )}
              <NavBarItem
                link="/explore"
                text="All Jobs"
                setMobileMenuOpen={setMobileMenuOpen}
              />
              <NavBarItem
                link="/profile"
                text="Profile"
                setMobileMenuOpen={setMobileMenuOpen}
              />
              {role === "Applicant" && (
                <NavBarItem
                  link="/resume"
                  text="Upload Resume"
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              )}
              <NavBarItem link="/logout" text="Log Out" />
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
