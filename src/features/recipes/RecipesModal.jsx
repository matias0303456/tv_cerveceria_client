import { useContext, useEffect, useState } from "react";

import { Modal } from "../../components/Modal";
import { Table } from "../../components/Table";
import { useIngredients } from '../ingredients/useIngredients'
import { useUnits } from '../units/useUnits'
import { useRecipes } from "./useRecipes";
import { RecipesContext } from "./RecipesProvider";
import { useIngredientsOnRecipes } from "../ingredients-on-recipes/useIngredientsOnRecipes";
import { useAlarms } from "../alarms/useAlarms";

import { BOIL_ALARM, MACERATE_ALARM } from "../../config/constants";
import { errorToast, successToast } from "../../utils/toaster";

export function RecipesModal({ open, toggleOpen, recipe, setRecipe, edit }) {

    const { recipes, setRecipes } = useContext(RecipesContext)

    const { ingredients } = useIngredients()
    const { createIngredientOnRecipe, deleteIngredientOnRecipe } = useIngredientsOnRecipes()
    const { createAlarm, deleteAlarm } = useAlarms()
    const { units } = useUnits()
    const { createRecipe } = useRecipes()

    const [step, setStep] = useState(1)
    const [newIngredient, setNewIngredient] = useState({
        ingredient_id: '',
        amount: '',
        unit_id: ''
    })
    const [ingredientsOnRecipe, setIngredientsOnRecipe] = useState([])
    const [newAlarm, setNewAlarm] = useState({
        name: '',
        duration: '',
        type: ''
    })
    const [alarms, setAlarms] = useState([])

    useEffect(() => {
        setIngredientsOnRecipe(recipe.ingredients ?? [])
        setAlarms([
            ...recipe.macerate_alarms ?? [],
            ...recipe.boil_alarms ?? []
        ])
    }, [recipe])

    const handleChangeRecipe = e => {
        setRecipe({
            ...recipe,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeIngredients = e => {
        setNewIngredient({
            ...newIngredient,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeAlarms = e => {
        setNewAlarm({
            ...newAlarm,
            [e.target.name]: e.target.value
        })
    }

    const validateIngredient = () => {
        let flag = true
        let message = ''
        let errors = {
            'ingredient_id': 'Nombre requerido.',
            'amount': 'Cantidad requerida.',
            'unit_id': 'Unidad requerida.'
        }
        Object.keys(newIngredient).forEach(key => {
            if (newIngredient[key].length === 0) {
                message += `- ${errors[key]}\n`
                flag = false
            }
        })
        if (!flag) {
            errorToast(message)
        }
        return flag
    }

    const handleAddIngredient = async () => {
        if (ingredientsOnRecipe.some(item => (item.ingredient?.id ?? parseInt(item.ingredient_id)) === parseInt(newIngredient.ingredient_id))) {
            errorToast(`Ya existe un ingrediente ${ingredients.find(ing => ing.id === parseInt(newIngredient.ingredient_id)).name} en esta receta.`)
            return false
        }
        const isValid = validateIngredient()
        if (isValid) {
            if (edit) {
                const value = { ...newIngredient, recipe_id: parseInt(recipe.id) }
                const { status, data } = await createIngredientOnRecipe(value)
                if (status === 200) {
                    setIngredientsOnRecipe([...ingredientsOnRecipe, data])
                    setRecipe({
                        ...recipe,
                        ingredients: [...recipe.ingredients, data]
                    })
                    setRecipes([
                        ...recipes.filter(item => item.id !== recipe.id),
                        {
                            ...recipe,
                            ingredients: [...recipe.ingredients, data]
                        }
                    ])
                    setNewIngredient({
                        ingredient_id: '',
                        amount: '',
                        unit_id: ''
                    })
                    successToast('Ingrediente añadido correctamente a esta receta.')
                }
            } else {
                setIngredientsOnRecipe([...ingredientsOnRecipe, newIngredient])
                setNewIngredient({
                    ingredient_id: '',
                    amount: '',
                    unit_id: ''
                })
            }
        }
    }

    const validateAlarm = () => {
        if (alarms.some(item => item.name === newAlarm.name)) {
            errorToast(`Ya existe una alarma de ${newAlarm.name}`)
            return false
        }
        let flag = true
        let message = ''
        let errors = {
            'name': 'Nombre requerido.',
            'duration': 'Duración requerida.',
            'type': 'Tipo requerido.'
        }
        Object.keys(newAlarm).forEach(key => {
            if (newAlarm[key].length === 0) {
                message += `- ${errors[key]}\n`
                flag = false
            }
        })
        if (!flag) {
            errorToast(message)
        }
        return flag
    }

    const handleAddAlarm = async () => {
        const isValid = validateAlarm()
        if (isValid) {
            if (edit) {
                const { status, data } = await createAlarm({ ...newAlarm, recipe_id: parseInt(recipe.id) })
                if (status === 200) {
                    setAlarms([...alarms, newAlarm])
                    setRecipes([
                        {
                            ...recipe,
                            macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(newAlarm) === BOIL_ALARM || item.id !== data.id), data],
                            boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(newAlarm) === MACERATE_ALARM || item.id !== data.id), data]
                        },
                        ...recipes.filter(item => item.id !== recipe.id)
                    ])
                    setRecipe({
                        ...recipe,
                        macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(newAlarm) === BOIL_ALARM | item.id !== data.id), data],
                        boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(newAlarm) === MACERATE_ALARM || item.id !== data.id), data]
                    })
                    setNewAlarm({
                        name: '',
                        duration: '',
                        type: ''
                    })
                    successToast('Alarma añadida correctamente.')
                }
                if (status === 500) {
                    errorToast(`Ya existe una alarma de ${newAlarm.name.replace('_', ' ')}`)
                }
            } else {
                setAlarms([...alarms, newAlarm])
                setNewAlarm({
                    name: '',
                    duration: '',
                    type: ''
                })
            }
        }
    }

    const validateRecipe = data => {
        let flag = true
        let message = ''
        let errors = {
            'name': 'Nombre requerido.',
            'style': 'Estilo requerido.',
            'alcohol_content': 'Porcentaje de alcohol requerido.',
            'initial_density': 'Densidad inicial requerida.',
            'final_density': 'Densidad final requerida.',
            'ibu': 'IBU requerido.',
            'time': 'Tiempo requerido.',
            'ingredients': 'Es necesario al menos un ingrediente.',
            'alarms': 'Es necesaria al menos una alarma.'
        }
        Object.keys(data).forEach(key => {
            if (data[key].length === 0) {
                message += `- ${errors[key]}\n`
                flag = false
            }
        })
        if (!flag) {
            errorToast(message)
        }
        return flag
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const newRecipe = {
            ...recipe,
            ingredients: ingredientsOnRecipe,
            alarms
        }
        const isValid = validateRecipe(newRecipe)
        if (isValid) {
            const { status, data } = await createRecipe(newRecipe)
            if (status === 200) {
                setRecipes(prev => [data, ...prev.filter(item => item.id !== data.id)])
                successToast('Receta creada correctamente.')
                reset()
            } else {
                errorToast(data.message)
            }
        }
    }

    const reset = () => {
        setStep(1)
        setRecipe({
            name: '',
            style: '',
            alcohol_content: '',
            initial_density: '',
            final_density: '',
            ibu: '',
            time: ''
        })
        setNewIngredient({
            ingredient_id: '',
            amount: 0,
            unit_id: ''
        })
        setIngredientsOnRecipe([])
        setNewAlarm({
            name: '',
            duration: 0,
            type: ''
        })
        setAlarms([])
        toggleOpen()
    }

    const columnsIngredients = [
        { label: '#', accessor: data => data.ingredient?.id ?? data.id ?? '-' },
        { label: 'Nombre', accessor: data => data.ingredient?.name ?? ingredients.find(ing => ing.id === parseInt(data.ingredient_id)).name },
        { label: 'Cantidad', accessor: 'amount' },
        { label: 'Unidad', accessor: data => data.unit?.name ?? units.find(u => u.id === parseInt(data.unit_id)).name },
        {
            label: '',
            accessor: row => (
                <button style={{ width: 20, marginBottom: 20 }} onClick={async () => {
                    if (edit) {
                        const { status, data } = await deleteIngredientOnRecipe(recipe.id, row.ingredient.id)
                        if (status === 200) {
                            setIngredientsOnRecipe([...ingredientsOnRecipe.filter(item => item.ingredient.id !== data.ingredient_id)])
                            setRecipes([
                                ...recipes.filter(item => item.id !== recipe.id),
                                {
                                    ...recipe,
                                    ingredients: [...recipe.ingredients.filter(ing => ing.id !== data.id)]
                                }])
                            setRecipe({
                                ...recipe,
                                ingredients: [...recipe.ingredients.filter(ing => ing.id !== data.id)]
                            })
                            successToast('Ingrediente eliminado correctamente de esta receta.')
                        }
                    } else {
                        setIngredientsOnRecipe([...ingredientsOnRecipe.filter(item => parseInt(item.ingredient_id) !== parseInt(row.ingredient_id))])
                    }
                }}>
                    X
                </button>
            )
        }
    ]

    const getAlarmType = row => {
        if (row.name === 'PRIMER_RECIRCULADO' ||
            row.name === 'SEGUNDO_RECIRCULADO' ||
            row.name === 'EXTRA') {
            return MACERATE_ALARM
        } else {
            return BOIL_ALARM
        }
    }

    const columnsAlarms = [
        { label: '#', accessor: 'id' },
        { label: 'Nombre', accessor: 'name' },
        { label: 'Duración', accessor: 'duration' },
        {
            label: '',
            accessor: row => (
                <button style={{ width: 20, marginBottom: 20 }} onClick={async () => {
                    if (edit) {
                        const { status, data } = await deleteAlarm(getAlarmType(row), row.id)
                        if (status === 200) {
                            setAlarms([...alarms.filter(item => item.id !== data.id)])
                            setRecipes([
                                {
                                    ...recipe,
                                    macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(row) === BOIL_ALARM || item.id !== row.id)],
                                    boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(row) === MACERATE_ALARM || item.id !== row.id)]
                                },
                                ...recipes.filter(item => item.id !== recipe.id)
                            ])
                            setRecipe({
                                ...recipe,
                                macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(row) === BOIL_ALARM || item.id !== row.id)],
                                boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(row) === MACERATE_ALARM || item.id !== row.id)]
                            })
                            successToast('Alarma eliminada correctamente de esta receta.')
                        }
                    } else {
                        setAlarms([...alarms.filter(item => item.name !== row.name || item.type !== row.type)])
                    }
                }}>
                    X
                </button>
            )
        }
    ]

    return (
        <Modal open={open} reset={reset}>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{edit ? `Receta #${recipe.id}` : 'Nueva receta'}</p>
            {step === 1 &&
                <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                    <form onChange={handleChangeRecipe}>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" value={recipe.name} />

                        <label htmlFor="style">Estilo</label>
                        <input type="text" name="style" value={recipe.style} />

                        <label htmlFor="initial_density">Densidad inicial</label>
                        <input type="number" name="initial_density" step="0.1" value={recipe.initial_density} />

                        <label htmlFor="final_density">Densidad final</label>
                        <input type="number" name="final_density" step="0.1" value={recipe.final_density} />

                        <label htmlFor="alcohol_content">% Alcohol</label>
                        <input type="number" name="alcohol_content" step="0.1" value={recipe.alcohol_content} />

                        <label htmlFor="ibu">IBU</label>
                        <input type="number" name="ibu" step="0.1" value={recipe.ibu} />

                        <label htmlFor="time">Tiempo</label>
                        <input type="number" name="time" step="1" value={recipe.time} />
                    </form>
                </div>
            }
            {step === 2 &&
                <>
                    <p style={{ textAlign: 'center' }}>Ingredientes</p>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                        <Table
                            columns={columnsIngredients}
                            data={ingredientsOnRecipe}
                            disableInteractivity
                        />
                    </div>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                        <form onChange={handleChangeIngredients}>
                            <label htmlFor="ingredient_id">Nombre</label>
                            <select name="ingredient_id" value={newIngredient.ingredient_id}>
                                <option value="">Seleccione</option>
                                {ingredients.map(ing => {
                                    return <option key={ing.id} value={ing.id}>{ing.name}</option>
                                })}
                            </select>
                            <label htmlFor="amount">Cantidad</label>
                            <input type="number" name="amount" min={0} value={newIngredient.amount} />
                            <label htmlFor="amount">Unidad</label>
                            <select name="unit_id" value={newIngredient.unit_id}>
                                <option value="">Seleccione</option>
                                {units.map(u => {
                                    return <option key={u.id} value={u.id}>{u.name}</option>
                                })}
                            </select>
                            <button
                                type="button"
                                style={{ width: '20%' }}
                                onClick={handleAddIngredient}
                            >
                                Añadir
                            </button>
                        </form>
                    </div>
                </>
            }
            {step === 3 &&
                <>
                    <p style={{ textAlign: 'center' }}>Alarmas</p>
                    <p style={{ textAlign: 'center' }}>Macerado</p>
                    <div style={{ width: '50%', margin: '0 auto' }}>
                        <Table
                            columns={columnsAlarms}
                            data={alarms.filter(a => a.type === MACERATE_ALARM ||
                                a.name === 'PRIMER_RECIRCULADO' ||
                                a.name === 'SEGUNDO_RECIRCULADO' ||
                                a.name === 'EXTRA')}
                            disableInteractivity
                        />
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 20 }}>Hervor</p>
                    <div style={{ width: '50%', margin: '0 auto' }}>
                        <Table
                            columns={columnsAlarms}
                            data={alarms.filter(a => a.type === BOIL_ALARM ||
                                a.name === 'PRIMER_LUPULO' ||
                                a.name === 'SEGUNDO_LUPULO' ||
                                a.name === 'WHIRPOOL')}
                            disableInteractivity
                        />
                    </div>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 20 }}>
                        <form onChange={handleChangeAlarms}>
                            <label htmlFor="type">Tipo</label>
                            <select name="type" value={newAlarm.type}>
                                <option value="">Seleccione</option>
                                <option value={MACERATE_ALARM}>Macerado</option>
                                <option value={BOIL_ALARM}>Hervor</option>
                            </select>
                            <label htmlFor="name">Nombre</label>
                            <select name="name" disabled={newAlarm.type.length === 0} value={newAlarm.name}>
                                <option value="">Seleccione</option>
                                {newAlarm.type === MACERATE_ALARM &&
                                    <>
                                        <option value="PRIMER_RECIRCULADO">PRIMER RECIRCULADO</option>
                                        <option value="SEGUNDO_RECIRCULADO">SEGUNDO RECIRCULADO</option>
                                        <option value="EXTRA">EXTRA</option>
                                    </>
                                }
                                {newAlarm.type === BOIL_ALARM &&
                                    <>
                                        <option value="PRIMER_LUPULO">PRIMER LUPULO</option>
                                        <option value="SEGUNDO_LUPULO">SEGUNDO LUPULO</option>
                                        <option value="WHIRPOOL">WHIRPOOL</option>
                                    </>
                                }
                            </select>
                            <label htmlFor="duration">Duración (min.)</label>
                            <input type="number" name="duration" min={0} value={newAlarm.duration} />
                            <button
                                type="button"
                                style={{ width: '20%' }}
                                onClick={handleAddAlarm}
                            >
                                Añadir
                            </button>
                        </form>
                    </div>
                </>
            }
            <div style={{ width: '20%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                {step > 1 &&
                    <button
                        type="button"
                        onClick={() => setStep(prev => prev - 1)}
                        style={{ width: 100 }}
                    >
                        Volver
                    </button>
                }
                {step < 3 &&
                    <button
                        type="button"
                        onClick={() => setStep(prev => prev + 1)}
                        style={{ width: 100 }}
                    >
                        Siguiente
                    </button>
                }
                {step === 3 &&
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{ width: 100 }}
                    >
                        Guardar
                    </button>
                }
            </div>
        </Modal>
    )
}