import React from 'react';
import cl from './Pagination.module.css'

const Pagination = ({loadMore, max, setPage, page}) => {
    const handleClick = () => {
        if(page <= max - 1) {
            loadMore()
            setPage(page + 1)
        }
    }

    return (
        <div className={cl.wrapper}>
            <button onClick={handleClick} className="public_button">
                Load more
            </button>
        </div>
    );
};

export default Pagination;