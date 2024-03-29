import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { db } from '../../firebase';
import { toast, Toaster } from 'react-hot-toast';
import { doc, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { FiUpload } from 'react-icons/fi';
import moment from 'moment/moment';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Navbar from '../../components/Navbar/Navbar';
import { async } from '@firebase/util';


const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const storage = getStorage();

  const formik = useFormik({
    initialValues: {
      images: [],
      description: '',
    },
    validationSchema: yup.object({
      description: yup.string().required('Descripcion es necesaria'),
      images: yup.array()
        .of(yup.string())
        .min(1, 'Al menos 1 imagen es necesaria')
        .max(4, 'No se permiten mas de 4 imagenes'),
    }),
    onSubmit: (values) => {
      const docRef = doc(collection(db, 'posts'));
      try {
        //Metodo para cargar las imagenes codificadas base64
        uploadImagesStorage(values.images, docRef.id)
          .then(
            urlImages =>
              setDoc(docRef, {
                //urlImagers son las urls de las imagenes
                images: urlImages,
                description: values.description,
                createdAt: moment().format('DD MMM, h:mm a'),
                time: serverTimestamp(),
                contact: user?.email,
                name: user?.name,
              })
          ).then(() =>
            navigate("/")
          );
      } catch (error) {
        console.error(error);
      }


    },
  });

 

  const encode =  (e) => {
    const files = Array.from(e.target.files);
    const images = [];
    if (files.length>4 ){
      toast.error("Solo se permiten hasta cuatro imagenes");
    }
    
    for(let i=0;i<=3;i++){
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        images.push(reader.result);
        formik.setFieldValue(`images`, images);
      });
      reader.readAsDataURL(files[i]);
    }
    
  }

  //Metodo creado por Kevin Duran
  //Carga las imagenes en la carpeta con nombre docRef
  const uploadImagesStorage = async (files, docRef) => {
    const urlsImages = [];
    let urlImageIuploaded = "";
    for (let i = 0; i < files.length; i++) {

      if (files[i].length < 1) {
        continue;
      }
      const storageRef = ref(storage, `images/posts/${docRef}/${i}`);
      const uploadTask = await uploadString(storageRef, files[i], 'data_url');
      urlImageIuploaded = await getDownloadURL(uploadTask.ref);
      urlsImages.push(urlImageIuploaded)
    }

    return new Promise((resolve, reject) => {
      urlsImages.length > 0
        ? resolve(urlsImages)
        : reject(null);
    });
  }



  return (
    <>
      <Navbar user={user} />

      <div className='max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8 bg-primary'>
        <Toaster />
        <div className='max-w-lg mx-auto'>
          <form
            action=''
            className='p-8 mt-6 mb-12 space-y-4 rounded-lg shadow-lg shadow-black border-2 border-gray-200 bg-white'
          >
            <div className='flex items-center justify-center text-center flex-col'>
              <p className='text-2xl font-medium flex items-center space-x-2'>
                <AiFillEdit /> <span>Crear publicacion</span>
              </p>
            </div>
            <div>
              <div className='relative mt-1'>
                <div className='flex items-center gap-[10px] focus:outline-none w-full sm:w-full'>
                  <label className='relative w-full cursor-pointer' htmlFor='file'>

                    {formik.values.images.length > 0 ? (
                      <div className='relative w-full mx-auto flex flex-row gap-6 snap-x snap-mandatory overflow-x-auto pb-8 rounded-lg'>
                        <div className="snap-center shrink-0">
                          <div className="shrink-0 w-4 sm:w-12"></div>
                        </div>
                        {Array.from({ length: formik.values.images.length }).map((_, index) => (

                          <div className="snap-center shrink-0">
                            <img className='shrink-0 w-40 h-40 rounded-lg shadow-xl bg-white'
                              key={index} src={formik.values.images[index]} alt={`Image ${index}`} />
                          </div>
                        ))}
                        <div className="snap-center shrink-0">
                          <div className="shrink-0 w-4 sm:w-12"></div>
                        </div>
                      </div>
                    ) : (
                      <p className=' text-[14px] text-[#00000080] font-[500] bg-white flex items-center justify-center gap-[6px] rounded overflow-hidden border border-gray-400/70 shadow-md h-72'>
                        <span>
                          <FiUpload />
                        </span>{''}
                        {'Subir imagen'}
                      </p>
                    )}
                    <input
                      accept='.jpg, .png, .jpeg'
                      onChange={(e) => encode(e)}
                      className='hidden'
                      type='file'
                      name='file'
                      id='file'
                      multiple

                    />
                    {/* <span className='absolute bottom-0 my-auto'> {}</span> */}
                  </label>
                </div>
                {formik.touched.image && Boolean(formik.errors.image) && (
                  <div className='font-semibold text-primary'>
                    {formik.errors.image}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor='name' className='text-lg font-medium'>
                Descripcion
              </label>

              <div className='relative mt-1'>
                <textarea
                  type='text'
                  id='description'
                  className='w-full p-4 pr-12 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  placeholder='Descripcion de la publicacion'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  rows={10}
                />

                {formik.touched.description &&
                  Boolean(formik.errors.description) && (
                    <div className='font-semibold text-primary'>
                      {formik.errors.description}
                    </div>
                  )}
              </div>
            </div>
            <button
              type='submit'
              className='block w-full px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg transition-all hover:scale-105'
              onClick={formik.handleSubmit}
            >
              Publicar
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default CreatePost;