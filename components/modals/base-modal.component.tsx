"use client"

import {PropsWithChildren, ReactNode, useEffect} from "react";

type Props = PropsWithChildren<{
    visible: boolean;
    header?: ReactNode;
}>
export function BaseModal({children, visible, header}: Props) {
    useEffect(() => {
        if(visible){
            document.body.classList.add('overflow-hidden');
        }else{
            document.body.classList.remove('overflow-hidden');
        }
    }, [visible]);

    return (

         <div
             className={`base-modal-container modal-z  overscroll-contain
    [scroll-behavior:auto] ${
             visible ? "modal-visible" : "modal-invisible"
         }`}
         >

             {visible &&
                 <div className="shadow-2xl z-50 w-full h-full">
                     <div className="flex justify-center items-center h-screen">
                         <div className={`min-w-1/3 z-20 rounded-lg shadow-lg bg-white`}>
                             {header}

                             <div className="h-full w-full overflow-y-auto">
                                 {children}
                             </div>
                         </div>
                     </div>
                 </div>
             }
         </div>
       /* <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/!* Close Button *!/}
                <button
                    onClick={() => {}}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {/!* Modal Content *!/}
                {children}
            </div>
        </div>*/

    )
}