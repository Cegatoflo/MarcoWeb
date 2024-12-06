import { Helmet } from 'react-helmet';
import { ProductsRow } from '../../Components/ProductsRow';

export function Productview() {
    const products = [
        { ID: 1, ProductName: 'Mandil Rojo', Price: 15, Stock: 50 },
        { ID: 2, ProductName: 'Mandil Rosado', Price: 15, Stock: 30 },
        { ID: 3, ProductName: 'Mandil Azul', Price: 15, Stock: 20 },
    ];
    return (
        <>
            <Helmet>
                <title>Productos |  TOTOS</title>
            </Helmet>
            <div className="title-container">
                <h1>Productos</h1>
            </div>
                <div className='full-width-container'>
                    <table className='general-table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <ProductsRow
                                    key={product.ID}
                                    ID={product.ID}
                                    ProductName={product.ProductName}
                                    Price={product.Price}
                                    Stock={product.Stock}
                                />
                            ))}
                        </tbody>
                    </table>

                    <button className='add-to-table'>Agregar Producto</button>
                </div>
        </>
    )
}