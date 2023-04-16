
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import './ProfileManagement.css';
import { Modal } from "flowbite-react";
import { FormUser } from "../../Forms/FormUser";
import { UserData } from "../../Context/UserContext";

const ProfileManagemnt = () => {
    const {user,setUserDoc} = UserData();
    const [openFormUser, setOpenFormUser] = useState(false);
    
    return (
        <>

            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-1/4">

                    <button className="w-full button-custom" onClick={() => setOpenFormUser(!openFormUser)}>
                        Editar Datos
                    </button>

                    <button className="w-full button-custom">
                        Cambiar Contraseña
                    </button>
                    <button className="w-full button-custom">
                        Cambiar Datos Tarjeta Bancaria
                    </button>
                    <button className="w-full button-custom">
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

                <Modal.Header />

                <Modal.Body>
                    <FormUser user={user} setUserDoc={setUserDoc} openModal={setOpenFormUser}/>
                    
                </Modal.Body>
            </Modal>



        </>
    )
}

export { ProfileManagemnt };