export function Modal({
    open,
    toggleOpen = false,
    reset = false,
    children
}) {
    return (
        <dialog open={open} onCancel={e => e.preventDefault()}>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => {
                        if (reset) reset()
                        if (toggleOpen) toggleOpen()
                    }}
                    style={{
                        width: 60,
                        position: 'absolute',
                        right: 0
                    }}>
                    Cerrar
                </button>
            </div>
            {children}
        </dialog>
    )
}