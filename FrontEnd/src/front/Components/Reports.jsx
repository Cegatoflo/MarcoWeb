import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart,Line } from 'recharts';

export function SalesReport() {
    const totalSales = 1500;
    const salesData = [
        { date: '2024-01-01', total: 10 },
        { date: '2024-01-02', total: 15 },
        { date: '2024-01-03', total: 50 },
        { date: '2024-01-04', total: 15 },
        { date: '2024-01-05', total: 30 },
        { date: '2024-01-06', total: 35 },
        { date: '2024-01-07', total: 30 },
    ];

    return (
        <>
            <h2>Informe de Ventas Totales</h2>
            <p>Total Ventas: S/.{totalSales}</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                    <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
                        itemStyle={{ color: '#000' }}
                    />
                    <Legend wrapperStyle={{ padding: 10 }} />
                    <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}

export function MonthlyOrdersReport () {
    const ordersData = [
        { date: '2024-01-01', orders: 5 },
        { date: '2024-01-02', orders: 3 },
        { date: '2024-01-03', orders: 7 },
        { date: '2024-01-04', orders: 6 },
        { date: '2024-01-05', orders: 8 },
        { date: '2024-01-06', orders: 9 },
        { date: '2024-01-07', orders: 5 },
    ];

    return (
        <div>
            <h2>Informe de Órdenes</h2>
            <p>Total Órdenes: {ordersData.reduce((acc, order) => acc + order.orders, 0)}</p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};