import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import axios from "axios";

export function Orderviews() {
    const [orders, setOrders] = useState([]);
    const [mandiles, setMandiles] = useState([]);
    const [selectedMandiles, setSelectedMandiles] = useState([]);
    const [ruc, setRuc] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [showMandilesPanel, setShowMandilesPanel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Nuevo estado para manejar la edición

    useEffect(() => {
        fetchOrders();
        fetchMandiles();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos', {
                params: {
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate,
                    estado: estadoFilter
                },
                withCredentials: true
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const fetchMandiles = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', {
                params: { estado: 'false' },
                withCredentials: true,
            });
            setMandiles(response.data);
        } catch (error) {
            console.error("Error fetching mandiles", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPedido = {
                ruc,
                mandiles: selectedMandiles,
            };

            if (isEditing) {
                // Si estamos editando, actualizamos el pedido
                await axios.put(`https://pyfjs.onrender.com/api/pedido/pedidos/${selectedOrder._id}`, newPedido, { withCredentials: true });
                alert('Pedido editado exitosamente');
            } else {
                // Si estamos creando un nuevo pedido
                await axios.post('https://pyfjs.onrender.com/api/pedido/pedidos', newPedido, { withCredentials: true });
                alert('Pedido creado exitosamente');
            }

            setSelectedMandiles([]); // Resetear selección
            setRuc(''); // Resetear RUC
            setShowMandilesPanel(false); // Ocultar el panel de mandiles
            setIsEditing(false); // Resetear el estado de edición
            fetchOrders(); // Volver a obtener las órdenes después de agregar o editar un pedido
        } catch (error) {
            console.error("Error creating or editing pedido", error);
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setRuc(order.ruc);
        setSelectedMandiles(order.mandiles.map(mandil => mandil.id)); // Prellenar mandiles seleccionados
        setIsEditing(true); // Activar el modo de edición
        setShowMandilesPanel(true); // Mostrar el panel de mandiles
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos/search/ruc', {
                params: { ruc: searchTerm },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error searching orders", error);
        }
    };

    const handleFilterByEstado = async () => {
        fetchOrders();
    };

    const handleFilterByDate = async () => {
        fetchOrders();
    };

    const handleGeneratePDF = async (id) => {
        try {
            const response = await axios.get(`https://pyfjs.onrender.com/api/pedido/pedidos/${id}/pdf`, {
                responseType: 'blob',
                withCredentials: true,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pedido-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    const handleDeleteOrder = async (id) => {
        try {
            await axios.delete(`https://pyfjs.onrender.com/api/pedido/pedidos/${id}`, { withCredentials: true });
            alert('Pedido eliminado exitosamente');
            fetchOrders();
        } catch (error) {
            console.error("Error deleting order", error);
        }
    };

    const toggleOrderDetails = (order) => {
        if (selectedOrder && selectedOrder._id === order._id) {
            setSelectedOrder(null);
        } else {
            setSelectedOrder(order);
            console.log(order);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Órdenes</title>
            </Helmet>
            <div className="title-container">
                <h1>Lista de Órdenes</h1>
            </div>
            <div className="filters-container">
                <input
                    className="filter-input"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por RUC"
                />
                <button className="filter-button" onClick={handleSearch}>Buscar</button>

                <label className="white">Filtrar por Estado:</label>
                <select className="filter-select" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}
                    style={{ width: '200px' }}>
                    <option value="">Seleccionar Estado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                </select>
                <button className="filter-button" onClick={handleFilterByEstado}>Filtrar</button>
            </div>
            <div className="filters-container">
                <label className="white">Filtrar por Fecha:</label>
                <input
                    className="filter-input"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                />
                <input
                    className="filter-input"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                />

                <button className="filter-button" onClick={handleFilterByDate}>Filtrar por Fecha</button>
            </div>
            <div className="add-form">
                <button onClick={() => { setShowMandilesPanel(true); setIsEditing(false); }}>Agregar Pedido</button>
            </div>
            <table className='general-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.idPedido}</td>
                            <td>{order.ruc}</td>
                            <td>{order.fechaPedido}</td>
                            <td>{order.estado}</td>
                            <td className="buttons-table">
                                <button onClick={() => handleEditOrder(order)}>Editar</button>
                                <button onClick={() => toggleOrderDetails(order)}>Detalles</button>
                                <button onClick={() => handleGeneratePDF(order._id)}>Descargar PDF</button>
                                <button onClick={() => handleDeleteOrder(order._id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal-t">
                    <div className="modal-ps white">
                        <h2>Detalles del Pedido</h2>
                        {console.log('selectedOrder:', selectedOrder)}
                        <p><strong>ID:</strong> {selectedOrder.idPedido}</p>
                        <p><strong>Cliente:</strong> {selectedOrder.ruc}</p>
                        <p><strong>Fecha:</strong> {selectedOrder.fechaPedido}</p>
                        <p><strong>Estado:</strong> {selectedOrder.estado}</p>
                        <p><strong>Mandiles Seleccionados:</strong></p>
                        <ul>
                            {selectedOrder.mandiles?.map((mandil) => (
                                <li key={mandil.id}>
                                    {mandil.nombre} - ID: {mandil.id} - Color: {mandil.color}
                                </li>
                            ))}
                        </ul>
                        <div className="buttons-modal">
                            <button className="button-cancelar" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {showMandilesPanel && (
                <div className="modal-t">
                    <div className="modal-ps">
                        <h2>{isEditing ? 'Editar Pedido' : 'Agregar Pedido'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={ruc}
                                onChange={(e) => setRuc(e.target.value)}
                                placeholder="Ingrese RUC"
                                required
                            />
                            <h3 className="white">Seleccionar Mandiles</h3>
                            {mandiles.map(mandil => (
                                <div key={mandil.id} className="white">
                                    <input
                                        type="checkbox"
                                        value={mandil.id}
                                        checked={selectedMandiles.includes(mandil.id)} // Preseleccionar mandiles si estamos editando
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedMandiles([...selectedMandiles, mandil.id]);
                                            } else {
                                                setSelectedMandiles(selectedMandiles.filter(id => id !== mandil.id));
                                            }
                                        }}
                                    />
                                    {mandil.nombre} - ID: {mandil.id} - Color: {mandil.color}
                                </div>
                            ))}
                            <div className="buttons-modal">
                                <button className="button-aceptar" type="submit">{isEditing ? 'Actualizar Pedido' : 'Agregar Pedido'}</button>
                                <button className="button-cancelar" type="button" onClick={() => setShowMandilesPanel(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}