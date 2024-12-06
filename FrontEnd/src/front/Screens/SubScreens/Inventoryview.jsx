// InventoryView.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Inventoryview() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [mandilData, setMandilData] = useState({
        seccion: '',
        ubicacion: '',
        color: '',
        estado: false
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
            seccion: item.seccion,
            ubicacion: item.ubicacion,
            color: item.color,
            estado: item.estado
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
        setMandilData({ seccion: '', ubicacion: '', color: '', estado: false });
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
            <div className="dashboard-container">
                <h1 className="dashboard-title">Inventario de Mandiles</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Buscar por color..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mandil-summary">
                    <h3>Resumen de Mandiles por Color</h3>
                    <div className="cards-container">
                        {Object.keys(mandilCountsByColor).map(color => (
                            <div key={color} className="mandil-card">
                                <div className="card-header" style={{ backgroundColor: color }}>
                                    {color}
                                </div>
                                <div className="card-body">
                                    Cantidad: {mandilCountsByColor[color]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="inventory-table-container">
                    <table className="table table-bordered table-sm">
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
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.seccion}</td>
                                        <td>{item.ubicacion}</td>
                                        <td>{item.color}</td>
                                        <td>{item.estado ? 'No disponible' : 'Disponible'}</td>
                                        <td>
                                            <Button variant="info" size="sm" onClick={() => handleEditItem(item)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item._id)}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No se encontraron mandiles para el color buscado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Button variant="primary" size="sm" onClick={() => setModalVisible(true)}>Agregar Mandil</Button>
                </div>

                <Modal show={modalVisible} onHide={resetForm} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedItem ? "Editar Mandil" : "Agregar Mandil"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formSeccion">
                                <Form.Label>Sección</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la sección"
                                    value={mandilData.seccion}
                                    onChange={(e) => setMandilData({ ...mandilData, seccion: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formUbicacion">
                                <Form.Label>Ubicación</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la ubicación"
                                    value={mandilData.ubicacion}
                                    onChange={(e) => setMandilData({ ...mandilData, ubicacion: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formColor">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el color"
                                    value={mandilData.color}
                                    onChange={(e) => setMandilData({ ...mandilData, color: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEstado">
                                <Form.Check
                                    type="checkbox"
                                    label="No disponible"
                                    checked={mandilData.estado}
                                    onChange={(e) => setMandilData({ ...mandilData, estado: e.target.checked })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={resetForm}>Cancelar</Button>
                        <Button variant="primary" size="sm" onClick={handleSubmit}>
                            {selectedItem ? "Confirmar Edición" : "Agregar Mandil"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <style jsx>{`
                .dashboard-container {
                    padding: 20px;
                }
                .dashboard-title {
                    color: #007bff;
                }
                .search-bar input {
                    width: 100%;
                    margin-bottom: 20px;
                }
                .inventory-table-container {
                    margin-top: 20px;
                }
                .inventory-table-container table {
                    width: 100%;
                    margin-bottom: 20px;
                }
                .mandil-summary {
                    margin-top: 20px;
                }
                .cards-container {
                    display: flex;
                    gap: 15px;
                }
                .mandil-card {
                    width: 150px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .card-header {
                    padding: 10px;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                }
            `}</style>
        </>
    );
}

