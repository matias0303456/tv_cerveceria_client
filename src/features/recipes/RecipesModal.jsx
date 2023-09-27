import { useState } from "react";

import { Modal } from "../../components/Modal";
import { Table } from "../../components/Table";
import { useIngredients } from '../ingredients/useIngredients'
import { useUnits } from '../units/useUnits'

import { BOIL_ALARM, MACERATE_ALARM } from "../../config/constants";

export function RecipesModal({ open, toggleOpen }) {

    const { ingredients } = useIngredients()
    const { units } = useUnits()

    const [step, setStep] = useState(1)
    const [recipe, setRecipe] = useState({
        name: '',
        style: '',
        alcohol_content: '',
        initial_density: '',
        final_density: '',
        ibu: '',
        time: ''
    })
    const [newIngredient, setNewIngredient] = useState({
        ingredient_id: '',
        amount: 0,
        unit_id: ''
    })
    const [ingredientsOnRecipe, setIngredientsOnRecipe] = useState([])
    const [newAlarm, setNewAlarm] = useState({
        name: '',
        duration: 0,
        type: ''
    })
    const [alarms, setAlarms] = useState([])

    const columnsIngredients = [
        { label: '#', accessor: 'id' },
        { label: 'Nombre', accessor: data => ingredients.find(ing => ing.id === parseInt(data.ingredient_id)).name },
        { label: 'Cantidad', accessor: 'amount' },
        { label: 'Unidad', accessor: data => units.find(u => u.id === parseInt(data.unit_id)).name },
        { label: '', accessor: data => '' }
    ]

    const columnsAlarms = [
        { label: '#', accessor: 'id' },
        { label: 'Nombre', accessor: 'name' },
        { label: 'Duración', accessor: 'duration' },
        { label: '', accessor: data => '' }
    ]

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

    const handleSubmit = e => {
        e.preventDefault()
        const data = {
            ...recipe,
            ingredients: ingredientsOnRecipe,
            alarms
        }
        console.log(data)
    }

    const reset = () => {

    }

    return (
        <Modal open={open} toggleOpen={toggleOpen} reset={reset}>
            {step === 1 &&
                <form id="recipesForm" onChange={handleChangeRecipe}>
                    <p style={{ textAlign: 'center' }}>Nueva receta</p>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" />

                    <label htmlFor="style">Estilo</label>
                    <input type="text" name="style" />

                    <label htmlFor="initial_density">Densidad inicial</label>
                    <input type="number" name="initial_density" step="0.1" />

                    <label htmlFor="final_density">Densidad final</label>
                    <input type="number" name="final_density" step="0.1" />

                    <label htmlFor="alcohol_content">% Alcohol</label>
                    <input type="number" name="alcohol_content" step="0.1" />

                    <label htmlFor="ibu">IBU</label>
                    <input type="number" name="ibu" step="0.1" />

                    <label htmlFor="time">Tiempo</label>
                    <input type="number" name="time" step="1" />
                </form>
            }
            {step === 2 &&
                <>
                    <p style={{ textAlign: 'center' }}>Ingredientes</p>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                        <Table
                            columns={columnsIngredients}
                            data={ingredientsOnRecipe}
                        />
                    </div>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                        <form onChange={handleChangeIngredients}>
                            <label htmlFor="ingredient_id">Nombre</label>
                            <select name="ingredient_id">
                                {ingredients.map(ing => {
                                    return <option key={ing.id} value={ing.id}>{ing.name}</option>
                                })}
                            </select>
                            <label htmlFor="amount">Cantidad</label>
                            <input type="number" name="amount" min={0} defaultValue={0} />
                            <label htmlFor="amount">Unidad</label>
                            <select name="unit_id">
                                {units.map(u => {
                                    return <option key={u.id} value={u.id}>{u.name}</option>
                                })}
                            </select>
                            <button
                                type="button"
                                style={{ width: '20%' }}
                                onClick={() => setIngredientsOnRecipe([...ingredientsOnRecipe, newIngredient])}
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
                            data={alarms.filter(a => a.type === MACERATE_ALARM)}
                        />
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 20 }}>Hervor</p>
                    <div style={{ width: '50%', margin: '0 auto' }}>
                        <Table
                            columns={columnsAlarms}
                            data={alarms.filter(a => a.type === BOIL_ALARM)}
                        />
                    </div>
                    <div style={{ width: '50%', margin: '0 auto', marginTop: 20 }}>
                        <form onChange={handleChangeAlarms}>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" name="name" />
                            <label htmlFor="duration">Duración (min.)</label>
                            <input type="number" name="duration" min={0} defaultValue={0} />
                            <label htmlFor="type">Tipo</label>
                            <select name="type">
                                <option value={MACERATE_ALARM}>Macerado</option>
                                <option value={BOIL_ALARM}>Hervor</option>
                            </select>
                            <button
                                type="button"
                                style={{ width: '20%' }}
                                onClick={() => setAlarms([...alarms, newAlarm])}
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