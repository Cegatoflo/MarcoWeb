export function OrdersRow({ ID, Cliente, Fecha, Estado }) {
    return (
        <tr>
            <td>{ID}</td>
            <td>{Cliente}</td>
            <td>{Fecha}</td>
            <td>{Estado}</td>
            <td><button>Detalles</button></td>
        </tr>
    )
}