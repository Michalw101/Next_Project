"use client";
import { useState } from 'react';
import Profile from "../pages/Profile"


function Dashboard() {
    const [activeTab, setActiveTab] = useState('reservedRoutes');

    return (
        <>
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
            <div>
                <nav className="bg-gray-800 text-white p-4">
                    <ul className="flex justify-around">
                        <li>
                            <button
                                onClick={() => setActiveTab('reservedRoutes')}
                                className={`hover:text-gray-400 ${activeTab === 'reservedRoutes' ? 'text-gray-400' : ''}`}
                            >
                                Reserved routes
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('lastOrders')}
                                className={`hover:text-gray-400 ${activeTab === 'lastOrders' ? 'text-gray-400' : ''}`}
                            >
                                Last orders
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`hover:text-gray-400 ${activeTab === 'profile' ? 'text-gray-400' : ''}`}
                            >
                                Profile
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Add the following conditional rendering part if you want to display content based on the active tab */}
            {/* {activeTab === 'reservedRoutes' && <ReservedRoutesComponent />}
            {activeTab === 'lastOrders' && <LastOrdersComponent />}*/}
            {activeTab === 'profile' && <Profile />} 
        </>
    );
}

export default Dashboard;
