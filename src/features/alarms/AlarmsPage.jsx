import { useContext, useState, useRef, useEffect } from 'react'
import { AiFillPlayCircle } from 'react-icons/ai'
import useSound from 'use-sound';

import { Bombs } from './Bombs';
import { RecipesContext } from '../recipes/RecipesProvider'
import { useRecipes } from "../recipes/useRecipes"
import { useAlarms } from './useAlarms'
import { useRecords } from '../records/useRecords'

import { BOIL_ALARM, MACERATE_ALARM } from '../../config/constants'
import alarmSound from '../../assets/alarm-sound.ogg';
import { successToast } from '../../utils/toaster';

export function AlarmsPage() {

    const { setRecipes } = useContext(RecipesContext)

    const [play] = useSound(alarmSound)

    const { recipes } = useRecipes()
    const { records } = useRecords()
    const { initiateAlarm } = useAlarms()

    const sortFunction = (a) => {
        const last = records[0]?.recipe.id
        if (a.id === last) return -1
        return 0
    }

    const handleInitialize = (alarm, type) => {
        const now = Date.now()
        const newAlarm = { ...alarm, last_start_timestamp: now }
        const recipe = recipes.find(recipe => recipe.id === alarm.recipe_id)
        if (type === MACERATE_ALARM.type) {
            setRecipes([
                ...recipes.filter(item => item.id !== recipe.id),
                {
                    ...recipe,
                    macerate_alarms: [...recipe.macerate_alarms.filter(item => item.id !== newAlarm.id), newAlarm]
                }
            ].sort(sortFunction))
        }
        if (type === BOIL_ALARM.type) {
            setRecipes([
                ...recipes.filter(item => item.id !== recipe.id),
                {
                    ...recipe,
                    boil_alarms: [...recipe.boil_alarms.filter(item => item.id !== newAlarm.id), newAlarm]
                }
            ].sort(sortFunction))
        }
        initiateAlarm(type, newAlarm)
    }

    function Countdown({ alarm, type }) {

        const [diff, setDiff] = useState(
            !alarm.last_start_timestamp ? -1 :
                (parseInt(alarm.last_start_timestamp) + (alarm.duration * 60 * 1000)) - Date.now()
        )

        let intervalRef = useRef();

        const decreaseNum = () => setDiff(prev => prev - 1000)

        useEffect(() => {
            const value = `${Math.floor(diff / 1000 / 60)}:${((Math.floor(diff / 1000)) % 60) < 10 ? `0${(Math.floor(diff / 1000)) % 60}` : (Math.floor(diff / 1000)) % 60}`
            if (value === '0:00') {
                play()
                successToast(`
                    ¡Proceso terminado!
                    Receta #${alarm.recipe_id}
                    ${alarm.name}
                `)
            }
        }, [diff])

        useEffect(() => {
            intervalRef.current = setInterval(decreaseNum, 1000)
            return () => clearInterval(intervalRef.current)
        }, [])

        return (
            <div>
                {diff <= 0 ?
                    < AiFillPlayCircle
                        className="actions"
                        onClick={() => handleInitialize(alarm, type)}
                    /> :
                    <div>
                        {Math.floor(diff / 1000 / 60)}:{((Math.floor(diff / 1000)) % 60) < 10 ? `0${(Math.floor(diff / 1000)) % 60}` : (Math.floor(diff / 1000)) % 60}
                    </div>
                }
            </div>
        )
    }

    return (
        <>
            <Bombs />
            {recipes.length === 0 ?
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <p>No hay recetas registradas.</p>
                </div> :
                <ul>
                    {recipes.sort(sortFunction).map(recipe => (
                        <li key={recipe.id} style={{
                            backgroundColor: 'gold',
                            color: 'black',
                            marginBottom: 10,
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: 10,
                            borderRadius: 5
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#AD692A' }}>Receta</p>
                                #{recipe.id} {recipe.name}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#AD692A' }}>Macerado</p>
                                <ul>
                                    {recipe.macerate_alarms.length === 0 ?
                                        <li>-</li> :
                                        recipe.macerate_alarms
                                            .sort((a, b) => MACERATE_ALARM.sorting[a.name] - MACERATE_ALARM.sorting[b.name])
                                            .map(alarm => (
                                                <li key={alarm.id}>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        boxShadow: '1px 1px 3px #AD692A',
                                                        padding: 10
                                                    }}>
                                                        {alarm.name.replaceAll('_', ' ')}
                                                        <Countdown alarm={alarm} type={MACERATE_ALARM.type} />
                                                    </div>
                                                </li>
                                            ))}
                                </ul>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#AD692A' }}>Hervor</p>
                                <ul>
                                    {recipe.boil_alarms.length === 0 ?
                                        <li>-</li> :
                                        recipe.boil_alarms
                                            .sort((a, b) => BOIL_ALARM.sorting[a.name] - BOIL_ALARM.sorting[b.name])
                                            .map(alarm => (
                                                <li key={alarm.id}>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        boxShadow: '1px 1px 3px #AD692A',
                                                        padding: 10
                                                    }}>
                                                        {alarm.name.replaceAll('_', ' ')}
                                                        <Countdown alarm={alarm} type={BOIL_ALARM.type} />
                                                    </div>
                                                </li>
                                            ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            }
        </>
    )
}