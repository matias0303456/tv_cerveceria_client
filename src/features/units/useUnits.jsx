import { useContext, useEffect } from "react"
import { UnitsContext } from "./UnitsProvider"

import { unitsUrl } from '../../config/urls'

export function useUnits() {

    const { units, setUnits } = useContext(UnitsContext)

    useEffect(() => {
        getUnits()
    }, [])

    async function getUnits() {
        try {
            const res = await fetch(unitsUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setUnits(data)
        } catch (err) {
            console.log(err)
        }
    }

    return { units }
}