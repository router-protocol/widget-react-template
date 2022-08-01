import React from 'react'
import { ToastContainer } from 'react-toastify';
import './ReactToastify.css';

const ToastNotification = () => {

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    )
}

export default ToastNotification