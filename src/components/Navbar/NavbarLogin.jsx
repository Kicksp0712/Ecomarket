import React from "react";
import { Link, useNavigate } from 'react-router-dom';

function NavbarLogin() {
    let navigate = useNavigate();
    return (
        <>
            <nav className='bg-Base px-2 sm:px-4 py-1 fixed w-full top-0 z-50 dark:bg-gray-900 border-b-4 border-primary shadow-xl'>
                <div className='container flex flex-wrap items-center justify-between mx-auto'>
                    
                    <Link to='/' className='flex items-center'>
                        <div className="flex flex-row align-middle ">
                            <img src='/ecomarket.png' className=' h-8 mr-3 sm:h-9' alt='Logo' />

                        </div>
                    </Link>
                    <button
                        type='submit'
                        className='inline-flex px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg transition-all hover:scale-105'
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </nav>
        </>
    );

}


export {NavbarLogin};