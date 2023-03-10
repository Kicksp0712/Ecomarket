import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const logout = () => {
    signOut(auth);
    setTimeout(() => {
      window.location = '/login';
    }, 1500);
  };
  let navigate = useNavigate();

  return (
    <nav className='bg-Base px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 border-b-4 border-black shadow-xl shadow-primary'>
      <div className='container flex flex-wrap items-center justify-between mx-auto'>
        <a href='/' className='flex items-center'>
          <div class="flex flex-row ...">
            <div>
          <img src='/ecomarket.png' className='h-16 mr-3 sm:h-9' alt='Logo' /></div>
          <div> </div>
          </div>
        </a>
        {Object.keys(user).length > 0 ? (
          <button
            data-collapse-toggle='navbar-default'
            type='button'
            className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-default'
            aria-expanded='false'
            onClick={() => setOpen((prev) => !prev)}
          >
            <img
              src={user?.image}
              alt={user?.uid}
              className='rounded-full w-10 h-10 border-4 border-primary'
            />
          </button>
        ) : (
          <button
            type='submit'
            className='inline-flex px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg transition-all hover:scale-105'
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
        )}
        {open && (
          <div className='w-full md:block md:w-auto' id='navbar-default'>
            <ul className='flex flex-col p-4 mt-4 border border-gray-100 space-y-2 rounded-lg bg-primary font-bold text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
              <li>
                <div
                  className='block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 text-black bg-white'
                  aria-current='page'
                >
                  ~ {user?.name}
                </div>
              </li>
              <li>
                <Link
                  to='/'
                  className='block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white'
                  aria-current='page'
                  onClick={() => setOpen((prev) => !prev)}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to='/create-post'
                  className='block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 hover:text-black hover:bg-white'
                  aria-current='page'
                  onClick={() => setOpen((prev) => !prev)}
                >
                  Publicar venta
                </Link>
              </li>
              <li>
                <div
                  onClick={logout}
                  className='block cursor-pointer py-2 pl-3 pr-4 rounded hover:text-black hover:bg-white md:hover:bg-transparent md:border-0  md:p-0'
                >
                  Salir
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
