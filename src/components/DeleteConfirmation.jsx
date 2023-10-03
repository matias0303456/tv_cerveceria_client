import toast from "react-hot-toast";

import { errorToast, successToast } from "../utils/toaster";

export function DeleteConfirmation({ t, id, method, setter }) {
    return (
        <span>
            <p>
                ¿Eliminar este registro?
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={async () => {
                    const { status, data } = await method(id)
                    if (status === 200) {
                        setter()
                        toast.dismiss(t.id)
                        successToast('Registro eliminado correctamente.')
                    } else {
                        errorToast(data.message)
                    }
                }}>
                    Confirmar
                </button>
                <button onClick={() => toast.dismiss(t.id)}>
                    Cancelar
                </button>
            </div>
        </span>
    )
}