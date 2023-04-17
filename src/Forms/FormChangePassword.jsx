import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {  EmailAuthProvider, reauthenticateWithCredential, updatePassword,getAuth } from "firebase/auth";
import { UserAuth } from "../Context/AuthContext";
import { TextInput } from "flowbite-react";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("Se requiere la contraseña actual"),
    newPassword: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("Se requiere la nueva contraseña"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Deben concidir las contraseñas")
        .required("Se requiere confirmar la contraseña"),
});

const FormChangePassword = ({openModal}) => {
    const {userAuth:user} = UserAuth();
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const credential = EmailAuthProvider.credential(user.email,values.currentPassword);
            await reauthenticateWithCredential(user,credential);
            await updatePassword(user,values.newPassword);
            resetForm();
            toast.success("Se ha cambiado la contraseña correctamente");
            openModal(false);
        } catch (error) {
            toast.error("Contraseña actual incorrecta");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, values, handleChange }) => (
                <Form>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">

                        <div >
                            <label htmlFor="currentPassword">Contraseña Actual</label>
                            <TextInput type="text" id="currentPassword" name="currentPassword" value={values.currentPassword} onChange={handleChange} />
                            <ErrorMessage name="currentPassword" component="div" className="form-errors " />
                        </div>
                        <div>
                            <label htmlFor="newPassword">Nueva contraseña</label>
                            <TextInput type="text" id="newPassword" name="newPassword" value={values.newPassword} onChange={handleChange} />
                            <ErrorMessage name="newPassword" component="div" className="form-errors" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirmacion contraseña</label>
                            <TextInput type="text" id="confirmPassword" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} />

                            <ErrorMessage name="confirmPassword" component="div" className="form-errors" />
                        </div>
                        <input type="submit" className="w-full button-custom" />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default FormChangePassword;
