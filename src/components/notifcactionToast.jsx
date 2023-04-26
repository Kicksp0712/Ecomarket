import React from "react";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
export const notification = (title, message, image) =>
  toast(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 p-2">
          <div className="flex items-center">
            {Boolean(image) && (
              <div className="flex-shrink-0 pt-0.5">
                <img className="h-7 w-7 rounded-full" src={image} alt="" />
              </div>
            )}
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className=" flex items-center ">
          <TiDelete
            onClick={() => toast.dismiss(t.id)}
            className=" text-4xl hover:text-primary cursor-pointer "
          />
        </div>
      </div>
    ),
    { position: "bottom-right" }
  );
