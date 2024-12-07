import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import '../../Styles/Modals.css';

export function Inventoryview() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoFilter, setEstadoFilter] = useState(''); // '' (todos), 'true', 'false'
    const [mandilData, setMandilData] = useState({
        ubicacion: '',
        color: 'rojo', // Valor por defecto
    });

    const colorMap = {
        rojo: 'red',
        verde: 'green',
        rosa: 'pink',
        azul: 'blue'
    };

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
        if (!mandilData.ubicacion || !mandilData.color) {
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
        setMandilData({ ubicacion: '', color: 'rojo' });
    };

    const applyFilters = () => {
        const filtered = inventoryItems.filter(item => {
            const matchesSearchTerm = item.color.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEstadoFilter = estadoFilter === '' || item.estado.toString() === estadoFilter;
            return matchesSearchTerm && matchesEstadoFilter;
        });
        setFilteredItems(filtered);
    };

    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        applyFilters();
    }, [inventoryItems, searchTerm, estadoFilter]);

    const mandilCountsByColor = inventoryItems.reduce((acc, item) => {
        if (!acc[item.color]) acc[item.color] = 0;
        acc[item.color] += 1;
        return acc;
    }, {});

    const [selectedSection, setSelectedSection] = useState({});

    const handleSectionChange = (itemId, value) => {
        setSelectedSection(prevState => ({
            ...prevState,
            [itemId]: value
        }));
    };

    return (
        <>
            <Helmet>
                <title>Inventario | TOTOS</title>
            </Helmet>
            <div>
                <div className="title-container">
                    <h1>Inventario de Mandiles</h1>{/*Título de la página */}
                </div>{/* label y button para busqueda */}
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Buscar por color..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todos</option>
                        <option value="true">No disponibles</option>
                        <option value="false">Disponibles</option>
                    </select>
                </div>

                <div>
                    <h3 className="white">Resumen de Mandiles por Color</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {Object.keys(mandilCountsByColor).map(color => (
                            <div key={color} style={{ margin: '10px', padding: '20px', backgroundColor: colorMap[color] || color, color: 'white', borderRadius: '10px', width: '150px', textAlign: 'center' }}>
                                <h4>{color.charAt(0).toUpperCase() + color.slice(1)}</h4>
                                <p>Cantidad: {mandilCountsByColor[color]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="white">Mandiles Disponibles</h3>
                    <div>
                        {filteredItems.length > 0 ? (
                            <table className='general-table'>
                                <thead>
                                    <tr>
                                        <th>ID Mandil</th>
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
                                            <td>{item.ubicacion}</td>
                                            <td>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}</td>
                                            <td>{item.estado ? 'No disponible' : 'Disponible'}</td>
                                            <td className="buttons-table">
                                                <button onClick={() => handleEditItem(item)}>Editar</button>
                                                <button onClick={() => handleDeleteItem(item._id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-items-message">
                                <p>No se encontraron mandiles para el color o estado seleccionado.</p>
                            </div>
                        )}
                    </div>
                    <div className="add-form">
                        <button onClick={() => setModalVisible(true)}>Agregar Mandil</button>
                    </div>
                </div>

                {modalVisible && (
                    <div className="modal-t">
                        <div className="modal-ps">
                            <span className="close-button" onClick={resetForm} >&times;</span>
                            <h2>{selectedItem ? "Editar Mandil" : "Agregar Mandil"}</h2>
                            <form>
                                <div className="row-modal">
                                    <label>Ubicación:</label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese la ubicación"
                                        value={mandilData.ubicacion}
                                        onChange={(e) => setMandilData({ ...mandilData, ubicacion: e.target.value })}
                                    />
                                </div>
                                <div className="row-modal">
                                    <label>Color:</label>
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
                                <div className="buttons-modal">
                                    <button className="button-cancelar" type="button" onClick={resetForm}>Cancelar</button>
                                    <button className="button-aceptar" type="button" onClick={handleSubmit}>
                                        {selectedItem ? "Confirmar Edición" : "Agregar Mandil"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}