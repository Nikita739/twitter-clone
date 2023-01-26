import React from 'react';
import cl from './Pagination.module.css'

const Pagination = ({setPage, page, max}) => {
    const previous = "< Previous"
    const next = "Next >"

    const Next = () => {
        if(page < max) {
            setPage(page + 1)
        }
    }

    const Prev = () => {
        if(page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <div className={cl.wrapper}>
            <button onClick={Prev} style={{marginRight: 20}} className="public_button">
                {previous}
            </button>
            <button onClick={Next} className="public_button">
                {next}
            </button>
        </div>
    );
};

export default Pagination;