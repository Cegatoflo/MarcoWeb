import '../Styles/SRigth.css';
export function ProductsRow({ ID, ProductName, Price, Stock}) {
    return (
        <tr>
            <td>{ID}</td>
            <td>{ProductName}</td>
            <td>{Price}</td>
            <td>{Stock}</td>
            <td><button className='btn-update'>Actualizar</button><button className='btn-delete'>Eliminar</button></td>
        </tr>
    );
}