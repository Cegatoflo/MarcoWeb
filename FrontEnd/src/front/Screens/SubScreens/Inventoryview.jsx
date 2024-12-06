import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

export function Inventoryview() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoFilter, setEstadoFilter] = useState(''); // '' (todos), 'true', 'false'
    const [mandilData, setMandilData] = useState({
        seccion: '',
        ubicacion: '',
        color: 'rojo', // Valor por defecto
    });

    useEffect(() => {
        fetchInventory();
    }, [estadoFilter]); // Recargar cuando cambie el filtro de estado

    const fetchInventory = async () => {
        try {
            const params = {};
            if (estadoFilter) params.estado = estadoFilter;

            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', {
                params,
                withCredentials: true,
            });

            setInventoryItems(response.data);
        } catch (error) {
            console.error("Error fetching inventory", error);
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setMandilData({
            seccion: item.seccion,
            ubicacion: item.ubicacion,
            color: item.color,
        });
        setModalVisible(true);
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`https://pyfjs.onrender.com/api/mandil/mandiles/${id}`, { withCredentials: true });
            fetchInventory();
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleSubmit = async () => {
        // Validar que todos los campos estén completos
        if (!mandilData.seccion || !mandilData.ubicacion || !mandilData.color) {
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
                await axios.post('https://pyfjs.onrender.com/api/mandil/mandiles', mandilData, { withCredentials: true });
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
        setMandilData({ seccion: '', ubicacion: '', color: 'rojo' });
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
                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="true">No disponibles</option>
                        <option value="false">Disponibles</option>
                    </select>
                </div>

                <div>
                    <h3>Resumen de Mandiles por Color</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {Object.keys(mandilCountsByColor).map(color => (
                            <div key={color} style={{ margin: '10px', padding: '20px', backgroundColor: color, color: 'white', borderRadius: '10px', width: '150px', textAlign: 'center' }}>
                                <h4>{color.charAt(0).toUpperCase() + color.slice(1)}</h4>
                                <p>Cantidad: {mandilCountsByColor[color]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
    <h3>Mandiles Disponibles</h3>
    <div>
        {filteredItems.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Sección</th>
                        <th>Ubicación</th>
                        <th>Color</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item._id}>
                            <td>{item.id}</td>
                            <td>{item.seccion}</td>
                            <td>{item.ubicacion}</td>
                            <td>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}</td>
                            <td>{item.estado ? 'No disponible' : 'Disponible'}</td>
                            <td>
                                <button onClick={() => handleEditItem(item)}>Editar</button>
                                <button onClick={() => handleDeleteItem(item._id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No se encontraron mandiles para el color o estado seleccionado.</p>
        )}
    </div>
    <button onClick={() => setModalVisible(true)}>Agregar Mandil</button>
</div>


                {modalVisible && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
                            <span onClick={resetForm} style={{ cursor: 'pointer', float: 'right', fontSize: '20px' }}>&times;</span>
                            <h2>{selectedItem ? "Editar Mandil" : "Agregar Mandil"}</h2>
                            <form>
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
