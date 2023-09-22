import { useContext, useEffect } from "react"
import { TypesContext } from "./TypesProvider"

import { typesUrl } from '../../config/urls'

export function useTypes() {

    const { types, setTypes } = useContext(TypesContext)

    useEffect(() => {
        getTypes()
    }, [])

    async function getTypes() {
        try {
            const res = await fetch(typesUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setTypes(data)
        } catch (err) {
            console.log(err)
        }
    }

    return { types }
}