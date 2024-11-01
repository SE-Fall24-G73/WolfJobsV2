/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../../store/UserStore";
import NavBarItem from "./NavBarItem";

const NavBar = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.role);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn && role === "Applicant") {
      axios
        .get("http://localhost:8000/api/v1/users/fetchapplications")
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
      <div className="relative items-center hidden ml-auto lg:flex">
        <nav className="text-sm font-semibold leading-6 text-slate-700 ">
          <ul className="flex space-x-8">
            {isLoggedIn && <NavBarItem link="/profile" text="Profile" />}
            {isLoggedIn && role == "Applicant" && (
              <NavBarItem link="/resume" text="Upload Resume" />
            )}
            {isLoggedIn && role === "Applicant" && (
              <NavBarItem
                link="/notifications"
                text={`Notifications (${notificationCount})`}
              />
            )}
            {isLoggedIn && <NavBarItem link="/logout" text="Log Out" />}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NavBar;