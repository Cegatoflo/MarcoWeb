import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts'; // Asegúrate de instalar recharts
import '../../Styles/SDashboard.css';

export function Reportsview() {
    const [mandilDataTrue, setMandilDataTrue] = useState([]);
    const [mandilDataAll, setMandilDataAll] = useState([]);
    const [pedidosPorMes, setPedidosPorMes] = useState([]);
    const [pedidosPorRuc, setPedidosPorRuc] = useState([]);

    useEffect(() => {
        fetchMandilDataTrue();
        fetchMandilDataAll();
        fetchPedidosPorMes();
        fetchPedidosPorRuc();
    }, []);

    // Función para obtener mandiles en estado true y agrupar por color
    const fetchMandilDataTrue = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', { params: { estado: 'true' }, withCredentials: true });
            const mandiles = response.data;

            // Agrupar mandiles por color
            const mandilCounts = mandiles.reduce((acc, mandil) => {
                acc[mandil.color] = (acc[mandil.color] || 0) + 1;
                return acc;
            }, {});

            const data = Object.keys(mandilCounts).map(color => ({
                name: color,
                value: mandilCounts[color],
            }));

            setMandilDataTrue(data);
        } catch (error) {
            console.error("Error fetching mandil data (true):", error);
        }
    };

    // Función para obtener todos los mandiles y agrupar por color
    const fetchMandilDataAll = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/mandil/mandiles', { withCredentials: true });
            const mandiles = response.data;

            // Agrupar mandiles por color
            const mandilCounts = mandiles.reduce((acc, mandil) => {
                acc[mandil.color] = (acc[mandil.color] || 0) + 1;
                return acc;
            }, {});

            const data = Object.keys(mandilCounts).map(color => ({
                name: color,
                value: mandilCounts[color],
            }));

            setMandilDataAll(data);
        } catch (error) {
            console.error("Error fetching mandil data (all):", error);
        }
    };

    // Función para obtener la cantidad de pedidos por mes
    const fetchPedidosPorMes = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos', { withCredentials: true });
            const pedidos = response.data;

            // Agrupar pedidos por mes
            const pedidosPorMes = pedidos.reduce((acc, pedido) => {
                const mes = new Date(pedido.fechaPedido).toLocaleString('default', { month: 'long' });
                acc[mes] = (acc[mes] || 0) + 1;
                return acc;
            }, {});

            const data = Object.keys(pedidosPorMes).map(mes => ({
                mes: mes,
                cantidad: pedidosPorMes[mes],
            }));

            setPedidosPorMes(data);
        } catch (error) {
            console.error("Error fetching pedidos por mes:", error);
        }
    };

    // Función para obtener el estado de los pedidos por RUC
    const fetchPedidosPorRuc = async () => {
        try {
            const response = await axios.get('https://pyfjs.onrender.com/api/pedido/pedidos', { withCredentials: true });
            const pedidos = response.data;

            // Agrupar pedidos por RUC y estado
            const pedidosPorRuc = pedidos.reduce((acc, pedido) => {
                const ruc = pedido.ruc;
                acc[ruc] = acc[ruc] || { ruc: ruc, estado: 0 };
                acc[ruc].estado += 1; // Contar el estado de los pedidos
                return acc;
            }, {});

            const data = Object.values(pedidosPorRuc);
            setPedidosPorRuc(data);
        } catch (error) {
            console.error("Error fetching pedidos por RUC:", error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Informes | TOTOS</title>
            </Helmet>
            <div className="title-container">
                <h1>Informes</h1>
            </div>
            <div className="full-width-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div className="big-card" style={{ margin: '10px' }}>
                    <h2>Gráfico de Mandiles por Color (Más Vendidos)</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={mandilDataTrue}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={entry => entry.name}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {mandilDataTrue.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
                <div className="big-card" style={{ margin: '10px' }}>
                    <h2>Gráfico de Mandiles por Color (Más Producidos)</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={mandilDataAll}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={entry => entry.name}
                            outerRadius={80}
                            fill="#82ca9d"
                            dataKey="value"
                        >
                            {mandilDataAll.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>


                {/* Gráfico de Líneas de Pedidos por Mes */}
                <div className="big-card">
                    <h2>Fluctuación de Pedidos por Mes</h2>
                    <LineChart width={600} height={300} data={pedidosPorMes}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
                    </LineChart>
                </div>

                {/* Gráfico de Barras de Estado de Pedidos por RUC */}
                <div className="big-card">
                    <h2>Estado de Pedidos por RUC</h2>
                    <BarChart width={600} height={300} data={pedidosPorRuc}>
                        <XAxis dataKey="ruc" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="estado" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        </>
    );
}