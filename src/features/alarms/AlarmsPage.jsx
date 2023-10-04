import { useContext, useState, useRef, useEffect } from 'react'
import { AiFillPlayCircle } from 'react-icons/ai'
import useSound from 'use-sound';

import { RecipesContext } from '../recipes/RecipesProvider'
import { useRecipes } from "../recipes/useRecipes"
import { useAlarms } from './useAlarms'

import { BOIL_ALARM, MACERATE_ALARM } from '../../config/constants'
import alarmSound from '../../assets/alarm-sound.ogg';
import { successToast } from '../../utils/toaster';

export function AlarmsPage() {

    const { setRecipes } = useContext(RecipesContext)

    const [play] = useSound(alarmSound)

    const { recipes } = useRecipes()
    const { initiateAlarm } = useAlarms()

    const handleInitialize = (alarm, type) => {
        const now = Date.now()
        const newAlarm = { ...alarm, last_start_timestamp: now }
        const recipe = recipes.find(recipe => recipe.id === alarm.recipe_id)
        if (type === MACERATE_ALARM) {
            setRecipes([
                ...recipes.filter(item => item.id !== recipe.id),
                {
                    ...recipe,
                    macerate_alarms: [...recipe.macerate_alarms.filter(item => item.id !== newAlarm.id), newAlarm]
                }
            ].sort((a, b) => b.id - a.id))
        }
        if (type === BOIL_ALARM) {
            setRecipes([
                ...recipes.filter(item => item.id !== recipe.id),
                {
                    ...recipe,
                    boil_alarms: [...recipe.boil_alarms.filter(item => item.id !== newAlarm.id), newAlarm]
                }
            ].sort((a, b) => b.id - a.id))
        }
        initiateAlarm(type, newAlarm)
    }

    function Countdown({ alarm, type }) {

        const [diff, setDiff] = useState((alarm.last_start_timestamp + (alarm.duration * 60 * 1000)) - Date.now())

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
        <ul>
            {recipes.map(recipe => (
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
                                recipe.macerate_alarms.map(alarm => (
                                    <li key={alarm.id}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            boxShadow: '1px 1px 3px #AD692A',
                                            padding: 10
                                        }}>
                                            {alarm.name.replace('_', ' ')}
                                            <Countdown alarm={alarm} type={MACERATE_ALARM} />
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
                                recipe.boil_alarms.map(alarm => (
                                    <li key={alarm.id}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            boxShadow: '1px 1px 3px #AD692A',
                                            padding: 10
                                        }}>
                                            {alarm.name.replace('_', ' ')}
                                            <Countdown alarm={alarm} type={BOIL_ALARM} />
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    )
}