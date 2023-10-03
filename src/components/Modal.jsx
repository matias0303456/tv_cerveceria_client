import { AiFillCloseCircle } from 'react-icons/ai'

export function Modal({
    open,
    toggleOpen = false,
    reset = false,
    children
}) {
    return (
        <dialog open={open} onCancel={e => e.preventDefault()}>
            <div style={{ position: 'relative' }}>
                <span
                    style={{ display: 'flex', justifyContent: 'end' }}
                    onClick={() => {
                        if (reset) reset()
                        if (toggleOpen) toggleOpen()
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