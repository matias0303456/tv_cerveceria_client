export function Modal({
    open,
    toggleOpen,
    reset = false,
    children
}) {
    return (
        <dialog open={open} onCancel={e => e.preventDefault()}>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => {
                        if (reset) reset()
                        toggleOpen()
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