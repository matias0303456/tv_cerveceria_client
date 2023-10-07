import { useContext, useEffect, useState } from "react";
import { AiFillDelete } from 'react-icons/ai'
import { toast } from 'react-hot-toast'

import { Modal } from "../../components/Modal";
import { useRecipes } from "./useRecipes";
import { RecipesContext } from "./RecipesProvider";
import { DeleteConfirmation } from '../../components/DeleteConfirmation'

import { BOIL_ALARM, MACERATE_ALARM } from "../../config/constants";
import { errorToast, successToast } from "../../utils/toaster";
import { FormStep1 } from "./FormStep1";
import { FormStep2 } from "./FormStep2";
import { FormStep3 } from "./FormStep3";

export function RecipesModal({ open, toggleOpen, recipe, setRecipe, edit }) {

    const { setRecipes } = useContext(RecipesContext)

    const { createRecipe, editRecipe, deleteRecipe } = useRecipes()

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
        setIngredientsOnRecipe(recipe.ingredients)
        setAlarms([
            ...recipe.macerate_alarms,
            ...recipe.boil_alarms
        ])
    }, [recipe])

    const handleChangeRecipe = e => {
        setRecipe({
            ...recipe,
            [e.target.name]: e.target.value
        })
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
            'macerate_alarms': 'Es necesaria al menos una alarma de macerado.',
            'boil_alarms': 'Es necesaria al menos una alarma de hervor.'
        }
        Object.keys(data)
            .filter(key => !['id', 'created_at', 'updated_at'].includes(key))
            .forEach(key => {
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
            macerate_alarms: alarms.filter(a => a.type === MACERATE_ALARM.type || MACERATE_ALARM.names.includes(a.name)),
            boil_alarms: alarms.filter(a => a.type === BOIL_ALARM || BOIL_ALARM.names.includes(a.name))
        }
        const isValid = validateRecipe(newRecipe)
        if (isValid) {
            if (edit) {
                const { status, data } = await editRecipe(newRecipe)
                if (status === 200) {
                    setRecipes(prev => [data, ...prev.filter(item => item.id !== data.id)])
                    successToast('Receta editada correctamente.')
                    reset()
                } else {
                    errorToast(data.message)
                }
            } else {
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
            time: '',
            macerate_alarms: [],
            boil_alarms: [],
            ingredients: []
        })
        setNewIngredient({
            ingredient_id: '',
            amount: '',
            unit_id: ''
        })
        setIngredientsOnRecipe([])
        setNewAlarm({
            name: '',
            duration: '',
            type: ''
        })
        setAlarms([])
        toggleOpen()
    }

    return (
        <Modal open={open} reset={reset}>
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                <p
                    style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {edit ? `Receta #${recipe.id}` : 'Nueva receta'}
                </p>
                {edit &&
                    <AiFillDelete
                        className="actions"
                        style={{ transform: 'scale(1.3)' }}
                        onClick={() => {
                            toast(t => {
                                return <DeleteConfirmation
                                    t={t}
                                    id={recipe.id}
                                    method={deleteRecipe}
                                    setter={() => {
                                        setRecipes(prev => [...prev.filter(item => item.id !== recipe.id)])
                                        toggleOpen()
                                    }}
                                />
                            }, { position: 'bottom-right' })
                        }}
                    />
                }
            </span>
            {step === 1 &&
                <FormStep1
                    recipe={recipe}
                    handleChangeRecipe={handleChangeRecipe}
                />
            }
            {step === 2 &&
                <FormStep2
                    newIngredient={newIngredient}
                    setNewIngredient={setNewIngredient}
                    ingredientsOnRecipe={ingredientsOnRecipe}
                    setIngredientsOnRecipe={setIngredientsOnRecipe}
                    recipe={recipe}
                    setRecipe={setRecipe}
                    edit={edit}
                />
            }
            {step === 3 &&
                <FormStep3
                    alarms={alarms}
                    setAlarms={setAlarms}
                    newAlarm={newAlarm}
                    setNewAlarm={setNewAlarm}
                    recipe={recipe}
                    setRecipe={setRecipe}
                    edit={edit}
                />
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