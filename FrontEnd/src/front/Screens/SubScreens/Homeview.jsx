import { SalesCard } from '../../Components/SalesCard';
import { ToppRow } from '../../Components/ToppRow';
import '../../Styles/SDashboard.css';

import sales from '../../assets/sales.svg';
import orders from '../../assets/orders.svg';
import bag from '../../assets/bag.svg';
import client from '../../assets/client.svg';

export function Homeview() {

    const cards = [
        { Title: '+130', Subtitle: 'Venta Mensuales', Img: sales },
        { Title: '3', Subtitle: 'Ordenes Pendientes', Img: orders },
        { Title: '8', Subtitle: 'Ventas de hoy', Img: bag },
        { Title: '7', Subtitle: 'Nuevos clientes', Img: client },
    ]
    const productos = [
        { id: 1, producto: 'Mandiles Rojos', popularidad: 'Alta', ventas: 75 },
        { id: 2, producto: 'Mandiles Verdes', popularidad: 'Media', ventas: 50 },
        { id: 3, producto: 'Mandiles Celestes', popularidad: 'Baja', ventas: 25 },
    ];

    return (
        <>
            <div className='title-container'>
                <h1>Home</h1>
            </div>
            <div className='top-container'>
                <h1>Resumen de Ventas</h1>
                <div className='top-container-items'>
                    {cards.map((card, index) => (
                        <SalesCard
                            key={index}
                            Title={card.Title}
                            Subtitle={card.Subtitle}
                            Img={card.Img}
                        />
                    ))}
                </div>
            </div>
            <div className='top-container'>
                <h1>Productos más solicitados</h1>
                <table className='home-table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Popularidad</th>
                            <th>Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <ToppRow
                                key={producto.id}
                                Number={producto.id}
                                Producto={producto.producto}
                                Ventas={producto.ventas}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}