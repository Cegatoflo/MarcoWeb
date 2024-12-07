import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import '../../Styles/Modals.css';

export function Customerview() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        RUC: '',
    });

    // Fetch customers when component mounts
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/client/clients');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setFormData({ nombre: '', RUC: '' });
        setModalVisible(true);
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setFormData({
            nombre: customer.nombre,
            RUC: customer.RUC,
        });
        setModalVisible(true);
    };

    const handleDeleteCustomer = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await axios.delete(`https://pyfjs.onrender.com/api/client/clients/${id}`);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.RUC) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            if (selectedCustomer) {
                // Update customer
                await axios.put(
                    `https://pyfjs.onrender.com/api/client/clients/${selectedCustomer._id}`,
                    formData
                );
            } else {
                // Create customer
                await axios.post('https://pyfjs.onrender.com/api/client/clients', formData);
            }

            fetchCustomers();
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Helmet>
                <title>Clientes | TOTOS</title>
            </Helmet>
            <div className="title-container">
                <h1>Gestión de Clientes</h1>
            </div>
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Buscar cliente por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
                <button className="filter-button" onClick={handleAddCustomer}>
                    Agregar Cliente
                </button>
            </div>
            <div className="full-width-container">
                {filteredCustomers.length > 0 ? (
                    <table className="general-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>RUC</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer._id}>
                                    <td>{customer.nombre}</td>
                                    <td>{customer.RUC}</td>
                                    <td className="buttons-table">
                                        <button
                                            onClick={() =>
                                                handleEditCustomer(customer)
                                            }
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteCustomer(customer._id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-items-message">
                        <p>No se encontraron clientes.</p>
                    </div>
                )}
            </div>
            {modalVisible && (
                <div className="modal-t">
                    <div className="modal-ps">
                        <span
                            className="close-button"
                            onClick={() => setModalVisible(false)}
                        >
                            &times;
                        </span>
                        <h2>
                            {selectedCustomer
                                ? 'Editar Cliente'
                                : 'Agregar Cliente'}
                        </h2>
                        <form>
                            <div className="row-modal">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nombre: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="row-modal">
                                <label>RUC:</label>
                                <input
                                    type="text"
                                    value={formData.RUC}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            RUC: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="buttons-modal">
                                <button
                                    type="button"
                                    className="button-cancelar"
                                    onClick={() => setModalVisible(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="button-aceptar"
                                    onClick={handleSubmit}
                                >
                                    {selectedCustomer
                                        ? 'Guardar Cambios'
                                        : 'Agregar Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
