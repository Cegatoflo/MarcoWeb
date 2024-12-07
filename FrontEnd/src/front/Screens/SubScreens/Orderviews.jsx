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
    const [isEditing, setIsEditing] = useState(false);

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
            console.error("Error al obtener los pedidos", error);
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
            console.error("Error al obtener los mandiles", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPedido = {
                ruc,
                mandiles: selectedMandiles,
                estado: selectedOrder.estado // Incluir el estado en el nuevo pedido
            };

            if (isEditing) {
                // Actualizar el pedido
                await axios.put(`https://pyfjs.onrender.com/api/pedido/pedidos/${selectedOrder._id}`, newPedido, { withCredentials: true });
                alert('Pedido editado exitosamente');
            } else {
                // Crear un nuevo pedido
                await axios.post('https://pyfjs.onrender.com/api/pedido/pedidos', newPedido, { withCredentials: true });
                alert('Pedido creado exitosamente');
            }

            // Reiniciar campos del formulario
            setSelectedMandiles([]);
            setRuc('');
            setShowMandilesPanel(false);
            setIsEditing(false);
            fetchOrders(); // Refrescar la lista de pedidos
        } catch (error) {
            console.error("Error al crear o editar el pedido", error);
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setRuc(order.ruc);
        setSelectedMandiles(order.mandiles.map(mandil => mandil.id)); // Prellenar mandiles seleccionados
        setIsEditing(true);
        setShowMandilesPanel(true);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos/search/ruc', {
                params: { ruc: searchTerm },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error al buscar pedidos", error);
        }
    };

    const handleFilterByEstado = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos/search/estado', {
                params: { estado: estadoFilter },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error al filtrar pedidos por estado", error);
        }
    };

    const handleFilterByDate = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos/search/fecha', {
                params: {
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate
                },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error al filtrar pedidos por fecha", error);
        }
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
            console.error("Error al generar el PDF", error);
        }
    };

    const handleDeleteOrder = async (id) => {
        try {
            await axios.delete(`https://pyfjs.onrender.com/api/pedido/pedidos/${id}`, { withCredentials: true });
            alert('Pedido eliminado exitosamente');
            fetchOrders();
        } catch (error) {
            console.error("Error al eliminar el pedido", error);
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
                <select
                    className="filter-select"
                    value={estadoFilter}
                    onChange={(e) => setEstadoFilter(e.target.value)}
                    style={{ width: '200px' }}
                >
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
                        <p><strong>ID:</strong> {selectedOrder.idPedido}</p>
                        <p><strong>Cliente:</strong> {selectedOrder.ruc}</p>
                        <p><strong>Fecha:</strong> {selectedOrder.fechaPedido}</p>
                        <p><strong>Estado:</strong> {selectedOrder.estado}</p>
                        <p><strong>Mandiles:</strong></p>
                        <ul>
                            {selectedOrder.mandiles.map(mandil => (
                                <li key={mandil.id}>{mandil.nombre}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {showMandilesPanel && (
                <div className="modal-t">
                    <div className="modal-p">
                        <div>
                            <h2>Seleccionar Mandiles</h2>
                            <select
                                className="modal-select"
                                value={selectedMandiles}
                                onChange={(e) => setSelectedMandiles([...e.target.selectedOptions].map(option => option.value))}
                                multiple
                            >
                                {mandiles.map(mandil => (
                                    <option key={mandil._id} value={mandil._id}>
                                        {mandil.nombre}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleSubmit}>Guardar Pedido</button>
                            <button onClick={() => setShowMandilesPanel(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
