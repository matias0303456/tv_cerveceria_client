import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-hot-toast'

import { Table } from "../../components/Table";
import { useRecords } from "./useRecords";
import { Modal } from "../../components/Modal";
import { useRecipes } from '../recipes/useRecipes'
import { RecordsContext } from "./RecordsProvider";
import { formatDate, formatTimestamp } from "../../utils/formatDate";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";

import { successToast, errorToast } from '../../utils/toaster'
import { MALT_TYPE } from "../../config/constants";

export function RecordsPage() {

    const { setRecords } = useContext(RecordsContext)

    const [waterValues, setWaterValues] = useState({
        lavado: 0,
        macerado: 0
    })

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { search } = useLocation()

    const { records, createRecord, editRecord, deleteRecord, getRecords } = useRecords()
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
        setValue,
        watch
    } = useForm({
        defaultValues: current
    })

    const toggleOpen = () => setOpen(!open)

    const formValues = watch()

    const columns = [
        { label: '#', accessor: 'id' },
        { label: 'Receta', accessor: data => data.recipe.name },
        { label: 'Fecha', accessor: data => formatDate(data.date) },
        { label: 'Cant. cerveza (litros)', accessor: 'amount' },
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
            navigate('alarms')
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

    useEffect(() => {
        const recipe = recipes.find(r => r.id === parseInt(formValues.recipe_id))
        const malts = recipe?.ingredients.filter(ing => ing.ingredient.type.name === MALT_TYPE)
        const kgs = malts?.reduce((prev, curr) => prev + curr.amount, 0)
        const calcLavado = parseInt(formValues.amount) + (parseInt(formValues.amount) * 0.10)
        const lavado = `${isNaN(calcLavado) || formValues.amount.length === 0 ? 0 : calcLavado} lt`
        const calcMacerado = ((kgs * 3) + (kgs * 0.67)) / 1000
        const macerado = `${isNaN(calcMacerado) || formValues.amount.length === 0 ? 0 : calcMacerado} lt`
        setWaterValues({ lavado, macerado })
    }, [formValues.amount])

    const handleFilter = e => {
        searchParams.set(e.target.name, e.target.value)
        setSearchParams(searchParams)
    }

    useEffect(() => {
        getRecords(search)
    }, [searchParams])

    return (
        <>
            <div>
                <button style={{ width: '10%', marginBottom: 10 }} onClick={toggleOpen}>
                    Cocinar
                </button>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 10,
                        padding: 10,
                        paddingTop: 7,
                        paddingBottom: 7,
                        borderRadius: 5
                    }}
                >
                    Filtrar desde
                    <input type="date" name="from" onChange={handleFilter} />
                    hasta
                    <input type="date" name="to" onChange={handleFilter} />
                </div>
            </div>
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

                        <label htmlFor="amount">Cantidad de cerveza deseada (lt.)</label>
                        <input type="number" step="1" {...register('amount', { required: true })} />
                        {errors.amount?.type === 'required' && <small>* Este campo es requerido.</small>}

                        <div>
                            <p>Cantidad de agua necesaria</p>
                            {!recipes.find(r => r.id === parseInt(formValues.recipe_id)) ?
                                <div style={{ textAlign: 'center' }}>
                                    <small >Seleccione una receta</small>
                                </div> :
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Agua de lavado</th>
                                            <td>
                                                {waterValues.lavado}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Agua de macerado</th>
                                            <td>
                                                {waterValues.macerado}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                        </div>

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