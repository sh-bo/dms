import React, {useState} from 'react'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header'

function Users() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return (
        <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
            {sidebarOpen && <Sidebar />}
            <div className='flex flex-col flex-1'>
                <Header toggleSidebar={toggleSidebar} />
                <div className='flex-1 p-4 min-h-0 overflow-auto'>
                    Users
                </div>
            </div>
        </div>
    )
}

export default Users