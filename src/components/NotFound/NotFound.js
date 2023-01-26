import React from 'react';
import cl from './NotFound.module.css'

const NotFound = () => {
    return (
        <div className={cl.outer}>
            <h1>404 Error</h1>
            <p>Couldn't find what you're looking for</p>
        </div>
    );
};

export default NotFound;