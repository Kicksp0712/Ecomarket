import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { IoMdArrowRoundBack,IoIosLogOut } from "react-icons/io";
import { UserData } from "../../Context/UserContext";
import { NotificationTray } from "../NotificationTray/NotificationTray";
import { Tooltip } from "flowbite-react";
const Navbar = () => {
  let { user } = UserData();

  const [open, setOpen] = useState(false);
  const logout = () => {
    signOut(auth);
    setTimeout(() => {
      window.location = "/login";
    }, 1500);
  };
  let navigate = useNavigate();

  return (
    <nav className="bg-Base px-2 sm:px-4 py-1 fixed w-full top-0 z-50 dark:bg-gray-900 border-b-4 border-primary shadow-xl">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div
          className={`${
            window.location.pathname === "/" ||
            window.location.pathname === "/login"
              ? "hidden"
              : ""
          } hover:scale-125 transition-transform  absolute cursor-pointer left-0 m-2 border-primary border-2 rounded-full`}
        >
          <IoMdArrowRoundBack onClick={() => navigate(-1)} />
        </div>
        <Link to="/" className="flex items-center">
          <div className="flex flex-row align-middle ">
            <img src="/ecomarket.png" className=" h-8 mr-3 sm:h-9" alt="Logo" />
          </div>
        </Link>

        <div className="flex flex-row items-center space-x-5">
          <NotificationTray user={user}  />

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className=" justify-end p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={() => setOpen((prev) => !prev)}
            onBlur={() =>
              setTimeout(() => {
                setOpen(false);
              }, 250)
            }
          >
            <img
              src={user?.image}
              alt={user?.uid}
              className="rounded-full  w-10 h-10 border-4 border-primary"
            />
            {/* Menu */}
            <div
              className={`md:block md:w-auto absolute top-9   transition-all ${
                !open && "hidden"
              }`}
              id="navbar-default"
            >
              <ul className="flex flex-col  m-1 p-4 mt-4 border border-gray-100 space-y-2 rounded-lg bg-primary font-bold text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to={`/user/${user?.uid}`}
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 text-white hover:border hover:border-white"
                    aria-current="page"
                  >
                    {user?.name}
                  </Link>
                </li>
                <hr></hr>
                <li>
                  <Link
                    to="/"
                    className={`${
                      window.location.pathname === "/" ? "hidden" : ""
                    } block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all`}
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-post"
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all"
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Publicar venta
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-posts"
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all"
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Publicaciones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account"
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all"
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Cuenta
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales"
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all"
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Ventas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/purchases"
                    className="block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white transition-all"
                    aria-current="page"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Compras
                  </Link>
                </li>
               
              </ul>
            </div>
          </button>
          
          <Tooltip placement="bottom" arrow={false} content="Cerrar sesion">

          <IoIosLogOut onClick={logout} className="  text-primary text-2xl font-bold cursor-pointer hover:text-lime-900 transition-all duration-700"/>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
