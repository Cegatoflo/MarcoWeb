import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

export function Inventoryview() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [mandilData, setMandilData] = useState({
        id: '',
        seccion: '',
        ubicacion: '',
        color: 'rojo', // Valor por defecto
        estado: false // Siempre será false al agregar
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', { withCredentials: true });
            setInventoryItems(response.data);
        } catch (error) {
            console.error("Error fetching inventory", error);
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setMandilData({
            id: item.id,
            seccion: item.seccion,
            ubicacion: item.ubicacion,
            color: item.color,
            estado: item.estado // Mantener el estado actual
        });
        setModalVisible(true);
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`https://pyfjs.onrender.com/api/mandil/mandiles/${id}`, { withCredentials: true });
            setInventoryItems(inventoryItems.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleSubmit = async () => {
        // Validar que todos los campos estén completos
        if (!mandilData.id || !mandilData.seccion || !mandilData.ubicacion || !mandilData.color) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (selectedItem) {
            // Editar mandil
            try {
                await axios.put(`https://pyfjs.onrender.com/api/mandil/mandiles/${selectedItem._id}`, mandilData, { withCredentials: true });
                fetchInventory();
                resetForm();
            } catch (error) {
                console.error("Error updating mandil", error);
            }
        } else {
            // Crear mandil
            try {
                await axios.post('https://pyfjs.onrender.com/api/mandil/mandiles', { ...mandilData, estado: false }, { withCredentials: true });
                fetchInventory();
                resetForm();
            } catch (error) {
                console.error("Error creating mandil", error);
            }
        }
    };

    const resetForm = () => {
        setModalVisible(false);
        setSelectedItem(null);
        setMandilData({ id: '', seccion: '', ubicacion: '', color: 'rojo', estado: false });
    };

    const filteredItems = inventoryItems.filter(item =>
        item.color.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mandilCountsByColor = inventoryItems.reduce((acc, item) => {
        if (!acc[item.color]) acc[item.color] = 0;
        acc[item.color] += 1;
        return acc;
    }, {});

    return (
        <>
            <Helmet>
                <title>Inventario | TOTOS</title>
            </Helmet>
            <div>
                <h1>Inventario de Mandiles</h1>

                <div>
                    <input
                        type="text"
                        placeholder="Buscar por color..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div>
                    <h3>Resumen de Mandiles por Color</h3>
                    <div>
                        {Object.keys(mandilCountsByColor).map(color => (
                            <div key={color} style={{ backgroundColor: color, padding: '10px', color: 'white' }}>
                                {color}: Cantidad: {mandilCountsByColor[color]}
 </div>
                        ))}
                    </div>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sección</th>
                                <th>Ubicación</th>
                                <th>Color</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.id}</td>
                                        <td>{item.seccion}</td>
                                        <td>{item.ubicacion}</td>
                                        <td>{item.color}</td>
                                        <td>{item.estado ? 'No disponible' : 'Disponible'}</td>
                                        <td>
                                            <button onClick={() => handleEditItem(item)}>Editar</button>
                                            <button onClick={() => handleDeleteItem(item._id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No se encontraron mandiles para el color buscado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button onClick={() => setModalVisible(true)}>Agregar Mandil</button>
                </div>

                {modalVisible && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
                            <span onClick={resetForm} style={{ cursor: 'pointer', float: 'right', fontSize: '20px' }}>&times;</span>
                            <h2>{selectedItem ? "Editar Mandil" : "Agregar Mandil"}</h2>
                            <form>
                                <div>
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese el ID"
                                        value={mandilData.id}
                                        onChange={(e) => setMandilData({ ...mandilData, id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Sección</label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese la sección"
                                        value={mandilData.seccion}
                                        onChange={(e) => setMandilData({ ...mandilData, seccion: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Ubicación</label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese la ubicación"
                                        value={mandilData.ubicacion}
                                        onChange={(e) => setMandilData({ ...mandilData, ubicacion: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Color</label>
                                    <select
                                        value={mandilData.color}
                                        onChange={(e) => setMandilData({ ...mandilData, color: e.target.value })}
                                    >
                                        <option value="rojo">Rojo</option>
                                        <option value="verde">Verde</option>
                                        <option value="rosa">Rosa</option>
                                        <option value="azul">Azul</option>
                                    </select>
                                </div>
                                <button type="button" onClick={resetForm}>Cancelar</button>
                                <button type="button" onClick={handleSubmit}>
                                    {selectedItem ? "Confirmar Edición" : "Agregar Mandil"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}