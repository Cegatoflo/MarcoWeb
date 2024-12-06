import '../Styles/SDashboard.css';
import '../Styles/inter.css';

import { Navbar } from '../Components/Navbar';
import { Productview } from './SubScreens/Productview';
import { Customerview } from './SubScreens/Customerview';
import { Orderviews } from './SubScreens/Orderviews';
import { Inventoryview } from './SubScreens/Inventoryview';
import { Reportsview } from './SubScreens/Reportsview';
import { Homeview } from './SubScreens/Homeview';
import '../Styles/SRigth.css';

export function Dashboard({ rightType }) {
    return (
        <>
            <div className='general-container'>
                <Navbar />
                <div className='Right'>
                    {rightType === 'productos' && <Productview />}
                    {rightType === 'clientes' && <Customerview />}
                    {rightType === 'ordenes' && <Orderviews />}
                    {rightType === 'inventario' && <Inventoryview/>}
                    {rightType === 'informes' && <Reportsview />}
                    {rightType === 'home' && <Homeview/>}
                </div>
            </div>
        </>
    )
}