import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";

import Logo from '../../../public/logo.png'
import { successToast } from '../../utils/toaster';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';

export function Layout({ children }) {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [socketMessage, setSocketMessage] = useState([{
        message: '',
        type: '',
        value: 0
    }])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const socket = io(import.meta.env.VITE_APP_SOCKET_SERVER)
        socket.on('message', socket => {
            if (socket.message.length > 0) successToast(socket.message)
            setSocketMessage(prev => [socket, ...prev.filter(item => item.type !== socket.type && item.type.length > 0)])
        })
    }, [])

    useEffect(() => {
        if (socketMessage[0].value !== 0 && !open) toggleOpen()
    }, [socketMessage])

    const toggleOpen = () => setOpen(!open)

    const columns = [
        { label: 'Nombre', accessor: data => data.type },
        { label: 'Valor', accessor: data => data.value.toString() }
    ]

    return (
        <>
            <header>
                <div id='logo'>
                    <img src={Logo} alt="Logo cerveza Asgardiana" />
                </div>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/cerveceria')} className={pathname === '/' ? 'currentPage' : ''}>
                            Registros
                        </li>
                        <li onClick={() => navigate('/cerveceria/recipes')} className={pathname === '/recipes' ? 'currentPage' : ''}>
                            Recetas
                        </li>
                        <li onClick={() => navigate('/cerveceria/alarms')} className={pathname === '/alarms' ? 'currentPage' : ''}>
                            Alarmas
                        </li>
                        <li onClick={() => navigate('/cerveceria/ingredients')} className={pathname === '/ingredients' ? 'currentPage' : ''}>
                            Ingredientes
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <Modal className="socketModal" open={open} toggleOpen={toggleOpen}>
                    <p style={{ textAlign: 'center', marginBottom: 10 }}>
                        Valores actuales de los sensores
                    </p>
                    <Table
                        columns={columns}
                        data={socketMessage}
                        disableInteractivity
                    />
                </Modal>
                {children}
            </main>
            <footer>
                Cerveza Asgardiana &copy; {new Date().getFullYear()}
            </footer>
        </>
    )
}