import { useContext, useEffect } from "react"

import { RecordsContext } from './RecordsProvider'

import { recordsUrl } from "../../config/urls"

export function useRecords() {

    const { records, setRecords } = useContext(RecordsContext)

    useEffect(() => {
        getRecords()
    }, [])

    async function getRecords() {
        try {
            const res = await fetch(recordsUrl, {
                headers: { 'Content-Type': 'application/json' }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setRecords(data)
        } catch (err) {
            console.log(err)
        }
    }

    async function createRecord(record) {
        try {
            const res = await fetch(recordsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function editRecord(record) {
        try {
            const res = await fetch(recordsUrl + `/${record.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteRecord(id) {
        try {
            const res = await fetch(recordsUrl + `/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    return { records, createRecord, editRecord, deleteRecord }
}