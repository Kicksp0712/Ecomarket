
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import './ProfileManagement.css';
import { Modal } from "flowbite-react";
import { FormUser } from "../../Forms/FormUser";
import { UserData } from "../../Context/UserContext";
import FormChangePassword from "../../Forms/FormChangePassword";
import DeleteAccountConfirmation from "./DeleteAccontConfirmation";
import { PhotoProfile } from "./PhotoProfile";

const ProfileManagemnt = () => {
    const { user, setUserDoc } = UserData();
    const [openFormUser, setOpenFormUser] = useState(false);
    const [openFormChangeP, setOpenFormChangP] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

    return (
        <>

            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-1/4">

                    <PhotoProfile user={user} setUserDoc={setUserDoc}/>

                    <button className="w-full button-custom" onClick={() => setOpenFormUser(!openFormUser)}>
                        Editar Datos
                    </button>

                    <button className="w-full button-custom" onClick={() => setOpenFormChangP(!openFormChangeP)}>
                        Cambiar Contraseña
                    </button>
                    <button className="w-full button-custom">
                        Cambiar Datos Tarjeta Bancaria
                    </button>
                    <button className="w-full button-custom-alert" onClick={()=> setOpenDeleteConfirmation(!openDeleteConfirmation)}>
                        Eliminar Cuenta
                    </button>
                </div>
            </div>

            <Modal
                onClose={() => { setOpenFormUser(false) }}
                size="lg"
                className="h-full"
                popup={true}
                show={openFormUser}>
                <Modal.Header className="p-5">
                    Modificar datos
                </Modal.Header>
                <Modal.Body>
                    <FormUser user={user} setUserDoc={setUserDoc} openModal={setOpenFormUser} />
                </Modal.Body>
            </Modal>

            <Modal
                onClose={() => { setOpenFormChangP(false) }}
                size="lg"
                className="h-full"
                popup={true}
                show={openFormChangeP}>
                <Modal.Header>
                    Modficar Contraseña
                </Modal.Header>
                <Modal.Body>
                    <FormChangePassword  openModal={setOpenFormChangP} />
                </Modal.Body>
            </Modal>

            <Modal
                onClose={() => { setOpenDeleteConfirmation(false) }}
                size="lg"
                className="h-full"
                popup={true}
                show={openDeleteConfirmation}>
                <Modal.Header>
                    Eliminar Cuenta
                </Modal.Header>
                <Modal.Body>
                    <DeleteAccountConfirmation openModal={setOpenDeleteConfirmation} />
                </Modal.Body>
            </Modal>
            

            



        </>
    )
}

export { ProfileManagemnt };