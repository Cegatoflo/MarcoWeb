import { Helmet } from "react-helmet";
import { OrdersRow } from "../../Components/OrdersRow";
import { useState, useEffect } from "react";
import axios from "axios";

export function Orderviews() {
    const [orders, setOrders] = useState([]);
    const [mandiles, setMandiles] = useState([]);
    const [selectedMandiles, setSelectedMandiles] = useState([]);
    const [ruc, setRuc] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [showMandilesPanel, setShowMandilesPanel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Estado para el pedido seleccionado

    useEffect(() => {
        fetchOrders();
        fetchMandiles();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos', { withCredentials: true });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const fetchMandiles = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', {
                params: { estado: 'false' }, // Solo mandiles disponibles
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
            await axios.post('https://pyfjs.onrender.com/api/pedido/pedidos', newPedido, { withCredentials: true });
            alert('Pedido creado exitosamente');
            setSelectedMandiles([]); // Resetear selección
            setRuc(''); // Resetear RUC
            setShowMandilesPanel(false); // Ocultar el panel de mandiles
            fetchOrders(); // Volver a obtener las órdenes después de agregar un nuevo pedido
        } catch (error) {
            console.error("Error creating pedido", error);
        }
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
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos/search/estado', {
                params: { estado: estadoFilter },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error filtering orders", error);
        }
    };

    const handleGeneratePDF = async (id) => {
        try {
            const response = await axios.get(`https://pyfjs.onrender.com/api/pedido/pedidos/${id}/pdf`, {
                responseType: 'blob', // Para manejar el PDF
                withCredentials: true,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pedido-${id}.pdf`); // Nombre del archivo
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
            fetchOrders(); // Volver a obtener las órdenes después de eliminar
        } catch (error) {console.error("Error deleting order", error);
        }
    };

    const toggleOrderDetails = (order) => {
        if (selectedOrder && selectedOrder.idPedido === order.idPedido) {
            setSelectedOrder(null); // Cerrar detalles si ya está abierto
        } else {
            setSelectedOrder(order); // Abrir detalles del nuevo pedido
        }
    };

    return (
        <div>
            <Helmet>
                <title>Órdenes</title>
            </Helmet>
            <h1>Lista de Órdenes</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por RUC"
            />
            <button onClick={handleSearch}>Buscar</button>
            <button onClick={handleFilterByEstado}>Filtrar por Estado</button>
            <button onClick={() => setShowMandilesPanel(true)}>Agregar Pedido</button>
            <table>
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
                        <tr key={order.idPedido}>
                            <td>{order.idPedido}</td>
                            <td>{order.ruc}</td>
                            <td>{order.fechaPedido}</td>
                            <td>{order.estado}</td>
                            <td>
                                <button onClick={() => toggleOrderDetails(order)}>Detalles</button>
                                <button onClick={() => handleGeneratePDF(order.idPedido)}>Descargar PDF</button>
                                <button onClick={() => handleDeleteOrder(order.idPedido)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="order-details-panel">
                    <h2>Detalles del Pedido</h2>
                    <p><strong>ID:</strong> {selectedOrder.idPedido}</p>
                    <p><strong>Cliente:</strong> {selectedOrder.ruc}</p>
                    <p><strong>Fecha:</strong> {selectedOrder.fechaPedido}</p>
                    <p><strong>Estado:</strong> {selectedOrder.estado}</p>
                    <p><strong>Mandiles Seleccionados:</strong></p>
                    <ul>
                        {selectedOrder.mandiles.map(mandil => (
                            <li key={mandil.id}>
                                {mandil.nombre} - ID: {mandil.id} - Color: {mandil.color}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setSelectedOrder(null)}>Cerrar</button>
                </div>
            )}

            {showMandilesPanel && (
                <div className="mandiles-panel">
                    <h2>Agregar Pedido</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={ruc}
                            onChange={(e) => setRuc(e.target.value)}
                            placeholder="Ingrese RUC"
                            required
                        />
                        <h3>Seleccionar Mandiles</h3>
                        {mandiles.map(mandil => (
                            <div key={mandil.id}>
                                <input
                                    type="checkbox"
                                    value={mandil.id}
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
                        <button type="submit">Agregar Pedido</button>
                        <button type="button" onClick={() => setShowMandilesPanel(false)}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    );
}