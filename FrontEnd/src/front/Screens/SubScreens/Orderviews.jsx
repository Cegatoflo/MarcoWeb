import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { OrdersRow } from "../../Components/OrdersRow";

export function Orderviews() {
    const [orders, setOrders] = useState([]);
    const [mandiles, setMandiles] = useState([]);
    const [selectedMandiles, setSelectedMandiles] = useState([]);
    const [cliente, setCliente] = useState('');
    const [fecha, setFecha] = useState('');
    const [estado, setEstado] = useState('');
    const [ruc, setRuc] = useState('');

    // Base URL de la API
    const apiUrl = "https://pyfjs.onrender.com";

    useEffect(() => {
        // Obtener pedidos
        axios.get(`${apiUrl}/pedidos`)
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error al obtener pedidos:', error));
        
        // Obtener mandiles disponibles (estado = false)
        axios.get(`${apiUrl}/mandiles/search/estado?estado=false`)
            .then(response => setMandiles(response.data))
            .catch(error => console.error('Error al obtener mandiles:', error));
    }, []);

    // Función para manejar la selección de mandiles
    const handleSelectMandil = (mandilId) => {
        const mandil = mandiles.find(m => m.idMandil === mandilId);
        setSelectedMandiles(prevSelected => [...prevSelected, mandil]);
    };

    // Función para crear un nuevo pedido
    const handleCreateOrder = async () => {
        const newOrder = {
            cliente,
            fecha,
            estado,
            mandiles: selectedMandiles,
            ruc,
        };

        try {
            const response = await axios.post(`${apiUrl}/pedidos`, newOrder);
            setOrders([...orders, response.data]);
            alert('Pedido creado con éxito');
        } catch (error) {
            console.error('Error al crear pedido:', error);
        }
    };

    // Función para buscar pedidos por RUC
    const handleSearchByRuc = async () => {
        try {
            const response = await axios.get(`${apiUrl}/pedidos/search/ruc`, { params: { ruc } });
            setOrders(response.data);
        } catch (error) {
            console.error('Error al buscar por RUC:', error);
        }
    };

    // Función para buscar pedidos por fecha
    const handleSearchByFecha = async () => {
        try {
            const response = await axios.get(`${apiUrl}/pedidos/search/fecha`, { params: { fecha } });
            setOrders(response.data);
        } catch (error) {
            console.error('Error al buscar por fecha:', error);
        }
    };

    // Función para generar PDF de un pedido
    const handleGeneratePDF = async (idPedido) => {
        try {
            const response = await axios.get(`${apiUrl}/pedidos/${idPedido}/pdf`, { responseType: 'blob' });
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        } catch (error) {
            console.error('Error al generar PDF:', error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Órdenes | TOTOS</title>
            </Helmet>
            <div className="title-container">
                <h1>Órdenes</h1>
            </div>
            <div className="full-width-container">
                <div className="buscador">
                    <p>Filtrar por: </p>
                    <input
                        type="text"
                        placeholder="Busca por: Nombre del cliente o ID del pedido"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por RUC"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                    />
                    <button onClick={handleSearchByRuc}>Buscar por RUC</button>
                    <button onClick={handleSearchByFecha}>Buscar por Fecha</button>
                    <button onClick={handleCreateOrder}>Agregar Orden</button>
                </div>
                <table className="general-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Detalles</th>
                            <th>Generar PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <OrdersRow
                                key={order.idPedido}
                                ID={order.idPedido}
                                Cliente={order.cliente}
                                Fecha={order.fecha}
                                Estado={order.estado}
                                onGeneratePDF={() => handleGeneratePDF(order.idPedido)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para selección de mandiles */}
            <div className="mandil-selection-modal">
                <h2>Selecciona los mandiles para el pedido</h2>
                <ul>
                    {mandiles.map(mandil => (
                        <li key={mandil.idMandil}>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleSelectMandil(mandil.idMandil)}
                                />
                                {mandil.descripcion}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
