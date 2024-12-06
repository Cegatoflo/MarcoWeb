import '../Styles/SRigth.css';
export function CustomersRow({ RUC, Customer, Email, Phonenumber}) {
    return (
        <tr>
            <td>{RUC}</td>
            <td>{Customer}</td>
            <td>{Email}</td>
            <td>{Phonenumber}</td>
            <td><button className='btn-update'>Actualizar</button><button className='btn-delete'>Eliminar</button></td>
        </tr>
    );
}