import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserAuth } from '../../Context/AuthContext';
import { TextInput } from 'flowbite-react';
import * as Yup from "yup";

import { EmailAuthProvider,reauthenticateWithCredential ,deleteUser } from 'firebase/auth';

const validationSchema = Yup.object().shape({
    password : Yup.string().min(8,"La contraseña debe contener 8 caracteres").required("Se requiere la contraseña")
})


const DeleteAccountConfirmation = ({ openModal }) => {
  const {userAuth:user} = UserAuth();
  const handleDeleteAccount = async (values, { setSubmitting, setErrors }) => {
    const { password } = values;
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user,credential);
      await deleteUser(user);
      openModal(false);
    } catch (error) {
      console.error(error);
      setErrors({ password: 'Contraseña incorrecta.' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
        <p className="mb-4 text-red-600">
          ¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible y se perderán todos los datos
          asociados a su cuenta.
        </p>
        <Formik initialValues={{ password: '' }} validationSchema={validationSchema} onSubmit={handleDeleteAccount}>
          {({ isSubmitting, values, handleChange }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="password">Ingrese su contraseña para confirmar:</label>
                <TextInput type="password" name="password" className="form-control" value={values.password} onChange={handleChange}/>
                <ErrorMessage name="password" component="div" className="form-errors" />
              </div>
              <input type="submit" className="w-full button-custom" disabled={isSubmitting} value={" Eliminar Cuenta"}/>
               
          
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default DeleteAccountConfirmation;
