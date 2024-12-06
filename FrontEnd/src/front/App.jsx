import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FullFormsPage } from "./Screens/FullFormsPage";
import { Dashboard } from "./Screens/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';

export function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<FullFormsPage formType="login" />} />
                    <Route path="/register" element={<FullFormsPage formType="register" />} />
                    <Route path="/recuperar" element={<FullFormsPage formType="recuperar" />} />
                    <Route path="/menu" element={<PrivateRoute><Dashboard rightType="home" /></PrivateRoute>}/>
                    <Route path="/menu/clientes" element={<PrivateRoute><Dashboard rightType="clientes"/></PrivateRoute>}/>
                    <Route path="/menu/ordenes" element={<PrivateRoute><Dashboard rightType="ordenes"/></PrivateRoute>}/>
                    <Route path="/menu/inventario" element={<PrivateRoute><Dashboard rightType="inventario"/></PrivateRoute>}/>
                    <Route path="/menu/informes" element={<PrivateRoute><Dashboard rightType="informes"/></PrivateRoute>}/>
                </Routes>
            </BrowserRouter>

        </>
    )
}