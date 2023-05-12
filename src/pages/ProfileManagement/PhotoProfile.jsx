

import React, { useEffect, useState } from "react"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import {BiUpload} from "react-icons/bi"
function PhotoProfile({ user, setUserDoc }) {

    const [photoProfile, setPhoto] = useState(user?.image ? user.image : "");
    const [enableButton,setEnableButton] = useState(false);

    useEffect(() => {
        setPhoto(user?.image ? user.image : "");
    }, [user]);

    const handleChange = (e) => {
        const file = e.target?.files[0];
        if (!file) { return }
        const loader = new FileReader();
        loader.addEventListener("load", function () {
            setPhoto(loader.result);
            setEnableButton(true);
        });
        loader.readAsDataURL(file);
    }

    const uploadPhoto =  async (value) => {
        const docUserRef = doc(db, 'users', user?.uid);
        await updateDoc(docUserRef, {
            image: value
        } ).then(() => {
            toast.success("Se ha actualizado la foto");
            setUserDoc({...user,image:value});
        }).catch(()=>{
            toast.error("Error al cargar la imagen");
        })
        setEnableButton(false);
}
    return (
        <>
            <div className="text-center">
                <label htmlFor="file" className="text-md font-semibold cursor-pointer"> {user?.name}
                    <div className=" rounded-full w-[100px] h-[100px] overflow-hidden mx-auto border-primary  border-4 ">
                        <img className="mx-auto" src={photoProfile} width={100}></img>
                    </div>
                    <input
                        onChange={(e) => handleChange(e)}
                        accept='.jpg, .png, .jpeg'
                        className='hidden'
                        type='file'
                        name='file'
                        id='file'
                    />
                </label>
                {enableButton && (
                <button className="button-custom"  onClick={()=>uploadPhoto(photoProfile)}>
                    <BiUpload className=" inline-block mx-2 " />Subir imagen
                </button>
                )}
            </div>
        </>
    )
}

export { PhotoProfile };