import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const Login = ({ user }) => {
  

  const [showPass, setShowPass] = useState(false);
  const removeFirebaseLetters = (text) => {
    return text.slice(10).replace('auth/', '');
  };

  //Toggle Password Show
  const toggleShowPass = () => {
    setShowPass(!showPass);
  };
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required('Correo es requerido')
        .email('Porfavor ingresa un correo valido!'),
      password: yup
        .string()
        .min(8, 'Ingresa una contraseña de 8 caracteres!')
        .required('Contraseña requerida!'),
    }),
    onSubmit: async (values) => {
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        toast.success(`Bienvenido, ${user?.user.email}.`);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        toast.error(`${removeFirebaseLetters(error.message)}`);
      }
    },
  });
  React.useEffect(() => {
    if (Object.keys(user).length > 0) {
      navigate('/login');
    }
  }, [user, navigate]);
  return (
    <div className=' px-4  mx-auto sm:px-6 lg:px-5 bg-primary'>
      <Toaster />
      <div className='p-2 w-2/5 mx-auto'>
        {/* Image + Headings  */}

        {/* Form  */}
        <form
          action=''
          className='p-8 space-y-2 rounded-lg shadow-lg shadow-black border-2 border-gray-200 bg-white'
        >
          <div className='flex items-center justify-center text-center flex-col'>
            <img src='/ecomarket.png' alt='logo' width={300} height={300} />
          </div>
          <div>
            <label htmlFor='email' className='text-lg font-medium'>
              Correo
            </label>

            <div className='relative mt-1'>
              <input
                type='email'
                id='email'
                className='w-full p-2  text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                placeholder='Ingresa tu correo.'
                value={formik.values.email}
                onChange={formik.handleChange}
              />

              <span className='absolute inset-y-0 inline-flex items-center right-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5 text-primary'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
              </span>
              {formik.touched.email && Boolean(formik.errors.email) && (
                <div className='font-semibold text-primary'>
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor='password' className='text-lg font-medium'>
              Contraseña
            </label>

            <div className='relative mt-1'>
              <input
                type={showPass ? 'text' : 'password'}
                id='password'
                className='w-full p-2 pr-12 text-sm border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                placeholder='Ingresa la contraseña'
                value={formik.values.password}
                onChange={formik.handleChange}
              />

              {showPass && (
                <span className='absolute inset-y-0 inline-flex items-center right-4'>
                  <AiFillEye
                    className='w-5 h-5 text-primary cursor-pointer'
                    onClick={toggleShowPass}
                  />
                </span>
              )}

              {!showPass && (
                <span className='absolute inset-y-0 inline-flex items-center right-4'>
                  <AiFillEyeInvisible
                    className='w-5 h-5 text-primary cursor-pointer'
                    onClick={toggleShowPass}
                  />
                </span>
              )}
              {formik.touched.password && Boolean(formik.errors.password) && (
                <div className='font-semibold text-primary'>
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>
          {/* Buttons  */}
          <button
            type='submit'
            className='block w-full px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg transition-all hover:scale-105'
            onClick={formik.handleSubmit}
          >
            Ingresar
          </button>

          <p className='text-lg text-center text-black'>
            No tienes cuenta? &nbsp;
            <Link
              className='text-primary font-medium text-lg'
              to='/create-account'
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
