export function DeleteConfirmation({ t, id, method }) {
    return (
        <span>
            Custom and <b>bold</b>
            <button onClick={() => toast.dismiss(t.id)}>
                Dismiss
            </button>
        </span>
    )
}