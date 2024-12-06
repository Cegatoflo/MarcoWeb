export function ToppRow({Number, Producto, Ventas}) {
    return (
        <tr>
            <td><center>{Number}</center></td>
            <td>{Producto}</td>
            <td>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Ventas}%` }}></div>
                </div>
            </td>
            <td><center>{Ventas}%</center></td>
        </tr>
    )
}