import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-hot-toast'

import { Table } from "../../components/Table";
import { useRecords } from "./useRecords";
import { Modal } from "../../components/Modal";
import { useRecipes } from '../recipes/useRecipes'
import { RecordsContext } from "./RecordsProvider";
import { formatDate, formatTimestamp } from "../../utils/formatDate";

import { successToast, errorToast } from '../../utils/toaster'
import { DeleteConfirmation } from "../../components/DeleteConfirmation";

export function RecordsPage() {

    const { setRecords } = useContext(RecordsContext)

    const { records, createRecord, editRecord, deleteRecord } = useRecords()
    const { recipes } = useRecipes()

    const [open, setOpen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [current, setCurrent] = useState({
        id: '',
        recipe_id: '',
        date: '',
        amount: ''
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: current
    })

    const toggleOpen = () => setOpen(!open)

    const columns = [
        { label: '#', accessor: 'id' },
        { label: 'Receta', accessor: data => data.recipe.name },
        { label: 'Fecha', accessor: data => formatDate(data.date) },
        { label: 'Cantidad (litros)', accessor: 'amount' },
        { label: 'Creado', accessor: data => formatTimestamp(data.created_at) },
        { label: 'Modificado', accessor: data => formatTimestamp(data.updated_at) },
    ]

    const onSubmit = async record => {
        const { status, data } = edit ? await editRecord(record) : await createRecord(record)
        if (status === 200) {
            setRecords(prev => edit ? [data, ...prev.filter(item => item.id !== data.id)] : [data, ...prev])
            successToast(edit ? 'Registro editado correctamente.' : 'Registro creado correctamente.')
            toggleOpen()
            reset()
            setEdit(false)
        } else {
            errorToast(data.message)
        }
    }

    useEffect(() => {
        setValue('id', current.id)
        setValue('amount', current.amount)
        setValue('date', current.date.split('T')[0])
        setValue('recipe_id', current.recipe?.id)
    }, [current])

    return (
        <>
            <button style={{ width: '10%', marginBottom: 10 }} onClick={toggleOpen}>
                Nuevo
            </button>
            <Modal open={open} toggleOpen={toggleOpen} reset={() => {
                setEdit(false)
                reset()
            }}>
                <div style={{ width: '50%', margin: '0 auto', marginTop: 90 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <p style={{ textAlign: 'center' }}>{edit ? `Registro #${current.id}` : 'Nuevo registro'}</p>
                            {edit &&
                                <AiFillDelete
                                    className="actions"
                                    style={{ transform: 'scale(1.3)' }}
                                    onClick={() => {
                                        toast(t => {
                                            return <DeleteConfirmation
                                                t={t}
                                                id={current.id}
                                                method={deleteRecord}
                                                setter={() => {
                                                    setRecords(prev => [...prev.filter(item => item.id !== current.id)])
                                                    toggleOpen()
                                                    setEdit(false)
                                                    reset()
                                                }}
                                            />
                                        }, { position: 'bottom-right' })
                                    }}
                                />
                            }
                        </span>
                        <label htmlFor="recipe_id">Receta</label>
                        <select {...register("recipe_id", { required: true })} >
                            <option value="">Seleccione</option>
                            {recipes.map(recipe => {
                                return <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                            })}
                        </select>
                        {errors.recipe_id?.type === 'required' && <small>* Este campo es requerido.</small>}

                        <label htmlFor="date">Fecha</label>
                        <input type="date" {...register('date', { required: true })} />
                        {errors.date?.type === 'required' && <small>* Este campo es requerido.</small>}

                        <label htmlFor="amount">Cantidad</label>
                        <input type="number" step="1" {...register('amount', { required: true })} />
                        {errors.amount?.type === 'required' && <small>* Este campo es requerido.</small>}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input type="submit" value="Guardar" />
                        </div>
                    </form>
                </div>
            </Modal>
            <Table
                columns={columns}
                data={records}
                setEntity={setCurrent}
                toggleOpen={() => {
                    setEdit(true)
                    toggleOpen()
                }}
            />
        </>
    )
}