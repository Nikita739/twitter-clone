import React, {useEffect, useState} from 'react';
import styles from './ModalWindow.module.css'

const ModalWindow = ({setIsOpen, prtext, isOpen, heading}) => {
    const [text, setText] = useState((<></>))
    const [header, setHeader] = useState("")

    useEffect(() => {
        if(!heading) {
            setHeader("Access denied")
        } else {
            setHeader(heading)
        }

        if(!prtext) {
            setText((<div className={styles.modalContent}>You need to be authorized</div>))
        } else {
            setText(prtext)
        }
    }, [])

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {isOpen
                ?
                <>
                    <div className={styles.darkBG} onClick={() => {
                        setIsOpen(false)
                    }} />
                    <div className={styles.centered}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h5 className={styles.heading}>{header}</h5>
                            </div>
                            <button className={styles.closeBtn} onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}>
                                <div
                                    style={{marginBottom: "-3px"}}
                                />
                            </button>
                            <div className={styles.modalContent}>
                                {text}
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <div style={{display: "none"}} className={styles.darkBG} onClick={() => setIsOpen(false)} />
                    <div style={{display: "none"}} className={styles.centered}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h5 className={styles.heading}>Access denied</h5>
                            </div>
                            <button className={styles.closeBtn} onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}>
                                <div
                                    style={{marginBottom: "-3px"}}
                                />
                            </button>
                            {/*<div className={styles.modalContent}>*/}
                            {/*    text*/}
                            {/*</div>*/}
                            {text}
                        </div>
                    </div>
                </>
            }

        </div>
    );
};

export default ModalWindow;