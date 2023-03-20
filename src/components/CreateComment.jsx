import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { doc, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import moment from "moment";
import { db } from '../firebase';


const CreateComment = ({ user, postId }) => {
    const [disabledButton, setEnableButton] = useState(true);
    const idtxtArea = `textAreaComment_${postId}`;
    const textArea = document.querySelector(`#${idtxtArea}`);


    const formComment = useFormik({
        initialValues: {
            content: ""
        },
        validationSchema: yup.object({
            content: yup.string().required('Comentario vacio')
        }),
        onSubmit: (values) => {
            
            const commentsRef = collection(db,`posts/${postId}/comments`);

            addDoc(commentsRef, {
                content: values.content,
                userName: user.name,
                userImage: user.image,
                datetime: moment().format('DD MM, h:mm a'),
                
            }).then((result) => {
                console.log(result);
                //Reset the textArea
                textArea.value = "";
            }).catch((err) => {
                console.error(err);
            });

            formComment.resetForm();

        }

    });


    const changedTextArea = (e) => {
        let text = e.target.value;
        if (text.length > 0) {
            setEnableButton(false);
            formComment.setFieldValue("content",text);
        } else {
            setEnableButton(true);
        }

    }

   




    return (<div>
        <div className=" mt-2 mb-0">
            <TextareaAutosize
                id={idtxtArea}
                onChange={(e) => changedTextArea(e)}
                className="w-full text-xs bg-gray-100 rounded border border-gray-400 leading-normal resize-none py-3 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                placeholder='Escribre algo'  
                />
            {formComment.touched.content &&
                Boolean(formComment.errors.content) && (
                    <div className='font-semibold text-primary'>
                        {formComment.errors.content}
                    </div>
                )}
        </div>
        <div className='w-full flex justify-end '>
            <button type='submit' onClick={formComment.handleSubmit}
            className="px-2.5 py-1.5 rounded-md text-white text-sm bg-green-500 active:bg-green-700  disabled:opacity-25">Comentar</button>

        </div>
    </div>);

}

export default CreateComment;