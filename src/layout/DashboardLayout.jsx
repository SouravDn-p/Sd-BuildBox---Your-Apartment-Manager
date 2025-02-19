import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import authHook from "../pages/useHook/authHook";
import {
  FaUser,
  FaBullhorn,
  FaMoneyBill,
  FaHistory,
  FaUserShield,
  FaHome,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { Vortex } from "react-loader-spinner";

const DashboardLayout = () => {
  const { user, userData, setUserData, loading, setLoading, signOutUser } =
    authHook();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetch(`https://buildbox-server-side.vercel.app/user/${user?.email}`)
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, [user]);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/login", { state: { from: location } });
      })
      .catch((err) => {
        console.error("Sign-Out error:", err.message);
      });
  };

  const navLinks = {
    user: [
      { path: "profile", label: "My Profile", icon: <FaUser /> },
      { path: "announcements", label: "Announcements", icon: <FaBullhorn /> },
    ],
    member: [
      { path: "profile", label: "My Profile", icon: <FaUser /> },
      { path: "make-payment", label: "Make Payment", icon: <FaMoneyBill /> },
      {
        path: "payment-history",
        label: "Payment History",
        icon: <FaHistory />,
      },
      { path: "announcements", label: "Announcements", icon: <FaBullhorn /> },
    ],
    admin: [
      { path: "profile", label: "Admin Profile", icon: <FaUserShield /> },
      { path: "manage-members", label: "Manage Members", icon: <FaUser /> },
      {
        path: "make-announcement",
        label: "Make Announcement",
        icon: <FaBullhorn />,
      },
      {
        path: "agreement-requests",
        label: "Agreement Requests",
        icon: <FaHistory />,
      },
      {
        path: "manage-coupons",
        label: "Manage Coupons",
        icon: <FaMoneyBill />,
      },
    ],
  };

  const navOptions = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`
          }
        >
          <span className="mr-3">
            <FaHome />
          </span>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/apartment"
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded ${
              isActive
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`
          }
        >
          <span className="mr-3">
            <MdApartment />
          </span>
          Apartment
        </NavLink>
      </li>
    </>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-800 via-purple-900 to-black">
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-indigo-900 to-purple-900 text-white  shadow-md z-40 transition-transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative w-64 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {userData?.role === "admin"
              ? "Admin Dashboard"
              : userData?.role === "member"
              ? "Member Dashboard"
              : "User Dashboard"}
          </h1>
          {user && (
            <img
              src={user?.photoURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-700"
            />
          )}
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="border-b">{navOptions}</ul>
          <ul className="space-y-2">
            {navLinks[userData?.role]?.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={`/dashboard/${link.path}`}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-4 rounded ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="p-4">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          className="btn btn-ghost btn-circle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>

      <main
        className={`flex-1 bg-slate-600 shadow-md transition-transform ${
          isSidebarVisible ? "md:ml-64" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
