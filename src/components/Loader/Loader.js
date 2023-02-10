import React from 'react';

const Loader = ({style}) => {
    return (
        <div style={style} className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Loader;