import { LuPower, LuPowerOff } from 'react-icons/lu'

import { useAlarms } from './useAlarms'

import { RECIRCULADO, TRASVASE } from '../../config/constants'
import { errorToast, successToast } from '../../utils/toaster'

export function Bombs() {

    const { handleBomb } = useAlarms()

    const btn = {
        marginTop: 0,
        width: 40,
        borderRadius: 999,
        fontSize: 18,
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const handleClick = async (action, name) => {
        const { status, data } = await handleBomb(action, { [action]: name })
        if (status === 200) {
            successToast(data.message)
        } else {
            errorToast(data.message)
        }
    }

    return (
        <div style={{
            width: '20%',
            marginBottom: 15,
            textAlign: 'center',
            borderRadius: 5
        }}>
            <p>Bombas</p>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid black',
                paddingBottom: 10,
                gap: 10
            }}>
                <p>Recirculado</p>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button
                        style={btn}
                        onClick={() => handleClick('on', RECIRCULADO)}
                    >
                        <LuPower />
                    </button>
                    <button
                        style={btn}
                        onClick={() => handleClick('off', RECIRCULADO)}
                    >
                        <LuPowerOff />
                    </button>
                </div>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 10,
                gap: 20
            }}>
                <p>Trasvase</p>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button
                        style={btn}
                        onClick={() => handleClick('on', TRASVASE)}
                    >
                        <LuPower />
                    </button>
                    <button
                        style={btn}
                        onClick={() => handleClick('off', TRASVASE)}
                    >
                        <LuPowerOff />
                    </button>
                </div>
            </div>
        </div>
    )
}