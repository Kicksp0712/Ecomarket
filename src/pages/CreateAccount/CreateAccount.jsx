import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { collection, doc, getDoc, query, setDoc, where } from 'firebase/firestore';
import { FiUpload } from 'react-icons/fi';
import { UserData } from '../../Context/UserContext';

const CreateAccount = () => {
  
  const {user} = UserData();
  const [showPass, setShowPass] = useState(false);
  const removeFirebaseLetters = (text) => {
    return text.slice(10).replace('auth/', '');
  };
  //Toggle Password Show
  const toggleShowPass = () => {
    setShowPass(!showPass);
  };

  

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      image: '',
    },
    validationSchema: yup.object({
      name: yup
      .string()
      .max(40,"El nombre no puede tener mas de 20 caracteres")
      .required('Su nombre es requerido'),
      email: yup
        .string()
        .required("El email del usuario es requerido")
        .email('Ingresa un email valido!'),
      password: yup
        .string()
        .min(8, 'Contraseña debe tener al menos 8 caracteres!')
        .required("La contraseña es obligatoria!"),
      image: yup.string().required('La imagen es obligatoria!'),
      //cardnumber: yup.string().matches(/^(\d{4}-){3}\d{4}$|^\d{16}$/gm, 'Numero de tarjeta invalida')
    }),
    onSubmit:  (values) => {

     
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (res) => {
          await setDoc(doc(db, 'users', res.user.uid), {
            ...values,
          });
        })
        .then(async () => {
          await setTimeout(() => {
            navigate('/');
          }, 2000);
          toast.success(
            `Bienvenido a E-comarket ${values.name}, diviertete!`
          );
         
        })
        .catch((e) => {
          toast.error(`${removeFirebaseLetters(e.message)}`);
        });
    },
  });
  function encode() {
    var selectedfile = document.getElementById('file').files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result;
        formik.setFieldValue('image', srcData);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }

  let navigate = useNavigate();
  React.useEffect(() => {
    if (Object.keys(user).length > 0) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className='max-w-screen-xl p-1  mx-auto sm:px-6 lg:px-8 bg-primary'>
      <Toaster />
      <div className='w-2/5 mx-auto'>
        <form
          action=''
          className='p-8 space-y-1 rounded-lg shadow-lg shadow-black border-2 border-gray-200 bg-white'
        >
          <div className='flex items-center justify-center text-center flex-col'>
            <img src='/ecomarket.png' alt='logo' width={300} height={300} />
            <p className='text-2xl font-medium'>
              {' '}
              Crea tu cuenta en Mercaius
            </p>
          </div>
          <div>
            <div className='w-full flex justify-between items-center'>
              <label htmlFor='name' className='text-lg font-medium'>
                Foto de perfil
              </label>
              {formik.values.image && (
                <img
                  src={formik.values.image}
                  alt='profile'
                  className='rounded-full w-16 h-16 border-4 border-primary'
                />
              )}
            </div>

            <div className='relative mt-1'>
              <div className='flex items-center gap-[10px] focus:outline-none  sm:w-full'>
                <label
                  className='relative w-full cursor-pointer'
                  htmlFor='file'
                >
                  <p className=' text-[14px] text-[#00000080] font-[500] bg-white flex items-center justify-center gap-[6px] h-12 rounded overflow-hidden border border-gray-400/70 shadow-md '>
                    <span>
                      <FiUpload />
                    </span>{' '}
                    {formik.values.image ? 'Re-Upload' : 'Upload'}
                  </p>
                  <input
                    accept='.png, .jpg, .jpeg'
                    onChange={encode}
                    className='hidden'
                    type='file'
                    name='file'
                    id='file'
                  />
                  {/* <span className='absolute bottom-0 my-auto'> {}</span> */}
                </label>
              </div>
              {formik.touched.image && Boolean(formik.errors.image) && (
                <div  auto className='font-semibold text-primary'>
                  {formik.errors.image}
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor='name' className='text-lg font-medium' >
              Nombre
            </label>

            <div className='relative mt-1'>
              <input
                type='text'
                id='name'
                className='w-full p-2 pr-12 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                placeholder='Enter your name.'
                value={formik.values.name}
                onChange={formik.handleChange}
                maxLength="40"
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
              {formik.touched.name && Boolean(formik.errors.name) && (
                <div className='font-semibold text-primary'>
                  {formik.errors.name}
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor='email' className='text-lg font-medium'>
              Correo
            </label>

            <div className='relative mt-1'>
              <input
                type='email'
                id='email'
                className='w-full p-2 pr-12 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                placeholder='Enter your email.'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

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
                placeholder='Enter password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

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
            className='block w-full px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg transition-all hover:scale-105'
            onClick={formik.handleSubmit}
          >
            Registrar
          </button>

          <p className='text-lg text-center text-black'>
            Ya tienes una cuenta? &nbsp;
            <Link className='text-primary font-medium text-lg' to='/login'>
              Ingresar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
