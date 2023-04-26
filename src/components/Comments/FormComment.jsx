import React, { useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { useFormik } from 'formik';
import * as yup from 'yup';




const FormComment = ({ user, postId,createComment,updateComment,isEditing, commentEditing}) => {
    const idtxtArea = `textAreaComment_${postId}`;


    const formComment = useFormik({
        initialValues: {
            content: ""
        },
        validationSchema: yup.object({
            content: yup.string()
            .required('Comentario vacio')
            .min(5,"Escribe un comentario mas detallado")
            .max(1000,"Solo se pueden escribir 1000 caracteres")
            
        }),
        onSubmit: (values) => {
            if(commentEditing.id && commentEditing.content){
                updateComment(values.content);
                formComment.resetForm();
            }else{  
                createComment(values.content);
                formComment.resetForm();
            }
        }

    });
    // Set comment text value  to commenty input when a comment is editing-
    useEffect(()=>{
        formComment.setFieldValue("content",commentEditing.content);
    },[commentEditing]);

    const changedTextArea = (e) => {
        let text = e.target.value;
        if (text.length >= 0) {
            formComment.setFieldValue("content",text);
        } 

    }


    return (<div>
        <div className=" mt-2 mb-0">
            <TextareaAutosize
                id={idtxtArea}
                onChange={(e) => changedTextArea(e)}
                className="w-full text-xs  bg-gray-100 rounded border border-gray-400 leading-normal resize-none py-3 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                placeholder='Escribre algo'
                value={formComment.values.content}  
                onBlur={formComment.handleBlur}
                maxLength="1000"
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

export default FormComment;