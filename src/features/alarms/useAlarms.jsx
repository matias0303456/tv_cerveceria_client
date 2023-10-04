import { alarmsUrl } from "../../config/urls"

export function useAlarms() {

    async function createAlarm(alarm) {
        try {
            const res = await fetch(alarmsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alarm)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteAlarm(type, id) {
        try {
            const res = await fetch(alarmsUrl + `/${type}/${id}`, {
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

    async function initiateAlarm(type, alarm) {
        try {
            const res = await fetch(alarmsUrl + `/${type}/${alarm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alarm)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    return { createAlarm, deleteAlarm, initiateAlarm }
}