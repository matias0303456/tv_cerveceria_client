import { AiFillCloseCircle } from 'react-icons/ai'

export function Modal({
    open,
    toggleOpen = false,
    reset = false,
    className = 'generalModal',
    children
}) {
    return (
        <dialog className={className} open={open} onCancel={e => e.preventDefault()}>
            <div style={{ position: 'relative' }}>
                <span
                    style={{ display: 'flex', justifyContent: 'end' }}
                    onClick={() => {
                        if (toggleOpen) toggleOpen()
                        if (reset) reset()
                    }}
                >
                    <AiFillCloseCircle
                        className="actions"
                        style={{ transform: 'scale(1.3)' }}
                    />
                </span>
            </div>
            {children}
        </dialog>
    )
}