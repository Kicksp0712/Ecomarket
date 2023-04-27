import React, { createContext } from "react";
import { Formik } from "formik";
import * as yup from 'yup';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TextInput, Label } from "flowbite-react";
import { toast } from "react-hot-toast";


const FormUser = ({ openModal,user,setUserDoc}) => {

    
    const initialValues = {
        name: user?.name ? user?.name : "",
        phone: user?.phone ? user?.phone: "",
    }

    const validationSchema = yup.object({
        name: yup
            .string()
            .max(40, "El nombre no puede tener mas de 20 caracteres")
            .required('Su nombre es requerido'),
        phone: yup.number().min(10, "El numero tiene que ser de 10 digitos"),
    })


    const onSubmit = async (values) => {
        if((user?.name === values?.name) && (user?.phone === values?.phone)){
            return;
        }
        const docUserRef = doc(db, 'users', user?.uid);
        await updateDoc(docUserRef,values).then(()  => {
            setUserDoc({...user,...values});
            toast.success("Se ha actualizado los datos");
        }).catch((reason) => {
            console.error(reason);
            toast.success("No se ha logrado actualizar los datos, intentelo de nuevo");
        });
        openModal(false);

    }


    return (
        <>
            <Formik enableReinitialize={true} validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
                {
                    ({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) =>
                    (
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                
                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="name"
                                            value="Name"
                                        />
                                    </div>
                                    <TextInput
                                        id="name"
                                        placeholder="Nombre de usuario"
                                        required={true}
                                        onChange={handleChange}
                                        value={values.name}
                                    />
                                </div>
                                {touched.name && Boolean(errors.name) && (
                                    <div className="form-errors">
                                        {errors.name}
                                    </div>
                                )}
                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="phone"
                                            value="Phone"
                                        />
                                    </div>
                                    <TextInput
                                        id="phone"
                                        type="number"
                                        required={true}
                                        placeholder="Numero telefonico"
                                        onChange={handleChange}
                                        value={values.phone}
                                    />
                                </div>
                                {touched.phone && Boolean(errors.phone) && (
                                    <div className="form-errors">
                                        {errors.phone}
                                    </div>
                                )}
                                <div>
                                    <input type="submit" className="w-full button-custom cursor-pointer" />
                                </div>
                            </div>
                        </form>

                    )
                }


            </Formik>
        </>
    )



}

export { FormUser };