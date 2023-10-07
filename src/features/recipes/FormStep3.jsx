import { useContext } from "react"

import { useAlarms } from "../alarms/useAlarms"
import { RecipesContext } from "./RecipesProvider"
import { Table } from "../../components/Table"

import { BOIL_ALARM, MACERATE_ALARM } from "../../config/constants"
import { errorToast, successToast } from "../../utils/toaster"

export function FormStep3({
    alarms,
    setAlarms,
    newAlarm,
    setNewAlarm,
    recipe,
    setRecipe,
    edit
}) {

    const { recipes, setRecipes } = useContext(RecipesContext)

    const { createAlarm, deleteAlarm } = useAlarms()

    const getAlarmType = row => {
        if (MACERATE_ALARM.names.includes(row.name)) {
            return MACERATE_ALARM.type
        }
        if (BOIL_ALARM.names.includes(row.name)) {
            return BOIL_ALARM.type
        }
    }

    const handleChangeAlarms = e => {
        setNewAlarm({
            ...newAlarm,
            [e.target.name]: e.target.value
        })
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
                    setRecipes([
                        {
                            ...recipe,
                            macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(newAlarm) === BOIL_ALARM.type || item.id !== data.id), data],
                            boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(newAlarm) === MACERATE_ALARM.type || item.id !== data.id), data]
                        },
                        ...recipes.filter(item => item.id !== recipe.id)
                    ])
                    setAlarms([...alarms, data])
                    setNewAlarm({
                        name: '',
                        duration: '',
                        type: ''
                    })
                    successToast('Alarma añadida correctamente.')
                } else {
                    errorToast(data.message)
                }
                if (status === 500) {
                    errorToast(`Ya existe una alarma de ${newAlarm.name.replaceAll('_', ' ')}`)
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
                                    macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(row) === BOIL_ALARM.type || item.id !== row.id)],
                                    boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(row) === MACERATE_ALARM.type || item.id !== row.id)]
                                },
                                ...recipes.filter(item => item.id !== recipe.id)
                            ])
                            setRecipe({
                                ...recipe,
                                macerate_alarms: [...recipe.macerate_alarms.filter(item => getAlarmType(row) === BOIL_ALARM.type || item.id !== row.id)],
                                boil_alarms: [...recipe.boil_alarms.filter(item => getAlarmType(row) === MACERATE_ALARM.type || item.id !== row.id)]
                            })
                            successToast('Alarma eliminada correctamente de esta receta.')
                        } else {
                            errorToast(data.message)
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
        <>
            <p style={{ textAlign: 'center' }}>Alarmas</p>
            <p style={{ textAlign: 'center' }}>Macerado</p>
            <div style={{ width: '50%', margin: '0 auto' }}>
                <Table
                    columns={columnsAlarms}
                    data={alarms.sort((a, b) => MACERATE_ALARM.sorting[a.name] - MACERATE_ALARM.sorting[b.name])
                        .filter(a => a.type === MACERATE_ALARM.type || MACERATE_ALARM.names.includes(a.name))}
                    disableInteractivity
                />
            </div>
            <p style={{ textAlign: 'center', marginTop: 20 }}>Hervor</p>
            <div style={{ width: '50%', margin: '0 auto' }}>
                <Table
                    columns={columnsAlarms}
                    data={alarms.sort((a, b) => BOIL_ALARM.sorting[a.name] - BOIL_ALARM.sorting[b.name])
                        .filter(a => a.type === BOIL_ALARM || BOIL_ALARM.names.includes(a.name))}
                    disableInteractivity
                />
            </div>
            <div style={{ width: '50%', margin: '0 auto', marginTop: 20 }}>
                <form onChange={handleChangeAlarms}>
                    <label htmlFor="type">Tipo</label>
                    <select name="type" value={newAlarm.type}>
                        <option value="">Seleccione</option>
                        <option value={MACERATE_ALARM.type}>Macerado</option>
                        <option value={BOIL_ALARM.type}>Hervor</option>
                    </select>
                    <label htmlFor="name">Nombre</label>
                    <select name="name" disabled={newAlarm.type.length === 0} value={newAlarm.name}>
                        <option value="">Seleccione</option>
                        {newAlarm.type === MACERATE_ALARM.type &&
                            <>
                                {MACERATE_ALARM.names.map((name, idx) => {
                                    return <option key={idx} value={name}>{name.replaceAll('_', ' ')}</option>
                                })}
                            </>
                        }
                        {newAlarm.type === BOIL_ALARM &&
                            <>
                                {BOIL_ALARM.names.map((name, idx) => {
                                    return <option key={idx} value={name}>{name.replaceAll('_', ' ')}</option>
                                })}
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
    )
}