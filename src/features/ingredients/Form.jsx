import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"

import { useTypes } from '../types/useTypes'
import { useIngredients } from "./useIngredients"
import { IngredientsContext } from "./IngredientsProvider"

import { errorToast, successToast } from "../../utils/toaster"

export function Form({ current, edit, setEdit }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: current
    })

    const { types } = useTypes()

    const { createIngredient, editIngredient } = useIngredients()

    const { setIngredients } = useContext(IngredientsContext)

    useEffect(() => {
        setValue('id', current.id)
        setValue('name', current.name)
        setValue('type_id', current.type_id)
    }, [current])

    const onSubmit = async (newIngredient) => {
        const { status, data } = edit ?
            await editIngredient({
                ...newIngredient,
                type_id: parseInt(newIngredient.type_id)
            })
            : await createIngredient({
                name: newIngredient.name,
                type_id: parseInt(newIngredient.type_id)
            })
        if (status === 200) {
            setIngredients(prev => edit ? [data, ...prev.filter(item => item.id !== data.id)] : [data, ...prev])
            setEdit(false)
            successToast(edit ? 'Ingrediente editado correctamente.' : 'Ingrediente creado correctamente.')
            reset()
        } else {
            errorToast(data.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p style={{ textAlign: 'center' }}>{edit ? 'Editar' : 'Nuevo'} ingrediente</p>
            <label htmlFor="name">Nombre</label>
            <input id="nameInput" {...register("name", { required: true, maxLength: 55 })} />
            {errors.name?.type === 'required' && <small>* Este campo es requerido.</small>}
            {errors.name?.type === 'maxLength' && <small>* El valor es demasiado largo.</small>}

            <label htmlFor="type_id">Tipo</label>
            <select id="ingSelect" {...register('type_id', { required: true })}>
                <option value="">Seleccione</option>
                {types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
            {errors.type_id?.type === 'required' && <small>* Este campo es requerido.</small>}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input type="submit" value="Guardar" />
                {edit &&
                    <button
                        onClick={() => {
                            setEdit(false)
                            reset()
                        }}>
                        Cancelar
                    </button>
                }
            </div>
        </form>
    )
}