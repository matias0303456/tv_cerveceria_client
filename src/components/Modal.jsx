import { AiFillCloseCircle } from 'react-icons/ai'
import { CiMinimize1, CiMaximize1 } from "react-icons/ci";

export function Modal({
    open,
    toggleOpen = false,
    reset = false,
    className = 'generalModal',
    minimizeBtn = false,
    showContent,
    onClick,
    children
}) {
    return (
        <dialog className={className} open={open} onCancel={e => e.preventDefault()}>
            <div style={{ position: 'relative' }}>
                <span style={{ display: 'flex', justifyContent: 'end', gap: 20 }}>
                    {minimizeBtn &&
                        <>
                            {showContent ?
                                <CiMinimize1
                                    className='actions'
                                    style={{ transform: 'scale(1.3)' }}
                                    onClick={onClick}
                                /> :
                                <CiMaximize1
                                    className='actions'
                                    style={{ transform: 'scale(1.3)' }}
                                    onClick={onClick}
                                />
                            }
                        </>
                    }
                    <AiFillCloseCircle
                        className="actions"
                        style={{ transform: 'scale(1.3)' }}
                        onClick={() => {
                            if (toggleOpen) toggleOpen()
                            if (reset) reset()
                        }}
                    />
                </span>
            </div>
            {children}
        </dialog>
    )
}