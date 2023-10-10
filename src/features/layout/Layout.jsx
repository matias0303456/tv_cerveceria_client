import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";

import Logo from '../../../public/logo.png'
import { successToast } from '../../utils/toaster';

export function Layout({ children }) {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    useEffect(() => {
        const socket = io(import.meta.env.VITE_APP_SOCKET_SERVER)
        socket.on('message', socket => {
            successToast(socket)
        })
    }, [])

    return (
        <>
            <header>
                <div id='logo'>
                    <img src={Logo} alt="Logo cerveza Asgardiana" />
                </div>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')} className={pathname === '/' ? 'currentPage' : ''}>
                            Registros
                        </li>
                        <li onClick={() => navigate('/recipes')} className={pathname === '/recipes' ? 'currentPage' : ''}>
                            Recetas
                        </li>
                        <li onClick={() => navigate('/alarms')} className={pathname === '/alarms' ? 'currentPage' : ''}>
                            Alarmas
                        </li>
                        <li onClick={() => navigate('/ingredients')} className={pathname === '/ingredients' ? 'currentPage' : ''}>
                            Ingredientes
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                Cerveza Asgardiana &copy; {new Date().getFullYear()}
            </footer>
        </>
    )
}