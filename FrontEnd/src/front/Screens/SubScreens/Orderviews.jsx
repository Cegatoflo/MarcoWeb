import { Helmet } from "react-helmet";
import { OrdersRow } from "../../Components/OrdersRow";

export function Orderviews() {
    const orders = [
        { id: 1, cliente: 'Juan Pérez', fecha: '2023-10-01', estado: 'Pendiente', productos: 'Mandiles Rojos, Mandiles Azules' },
        { id: 2, cliente: 'María López', fecha: '2023-10-02', estado: 'Completado', productos: 'Mandiles Azules' },
        { id: 3, cliente: 'Carlos García', fecha: '2023-10-03', estado: 'En Proceso', productos: 'Mandiles Rojos,Mandiles Verdes' },
        { id: 4, cliente: 'Ana Martínez', fecha: '2023-10-04', estado: 'Cancelado', productos: 'Mandiles Rojos, Mandiles Rosados' },
        { id: 5, cliente: 'Luis Rodríguez', fecha: '2023-10-05', estado: 'Pendiente', productos: 'Mandiles Rojos' },
    ];
    return (
        <>
            <Helmet>
                <title>Productos |  TOTOS</title>
            </Helmet>
            <div className="title-container">
                <h1>Ordenes</h1>
            </div>
            <div className="full-width-container">
                <div className="buscador">
                    <p>Filtrar por: </p>
                    <input type="text" placeholder="Busca por: Nombre del cliente o ID del pedido" />
                </div>
                <table className="general-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                            <OrdersRow
                                key={order.id}
                                ID={order.id}
                                Cliente={order.cliente}
                                Fecha={order.fecha}
                                Estado={order.estado}
                            />
                        ))}
                    </tbody>
                </table>
                <button className='add-to-table'>Agregar Orden</button>
            </div>
        </>
    )
}