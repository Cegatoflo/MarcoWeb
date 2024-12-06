import { Helmet } from 'react-helmet';
import { CustomersRow } from '../../Components/CustomersRow';

export function Customerview() {
    const customers = [
        { RUC: 12345, Customer: 'Rodolfo Perez', Email: 'rodolfoperez97@gmail.com', Phonenumber: 123456789 },
        { RUC: 12346, Customer: 'Juan Aguilar', Email: 'j_aguilar28@gmail.com', Phonenumber: 134512345 },
        { RUC: 12347, Customer: 'Maria Cotrado', Email: 'maricotra12@gmail.com', Phonenumber: 123456789 },
    ];

    return (
        <>
            <Helmet>
                <title>Clientes |  TOTOS</title>
            </Helmet>
            <div className='title-container'>
                <h1>Clientes</h1>
            </div>
            <div className='full-width-container'>
                <table className='general-table'>
                    <thead>
                        <tr>
                            <th>RUC</th>
                            <th>Razón Social</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <CustomersRow
                                key={customer.RUC}
                                RUC={customer.RUC}
                                Customer={customer.Customer}
                                Email={customer.Email}
                                Phonenumber={customer.Phonenumber}
                            />
                        ))}
                    </tbody>
                </table>

                <button className='add-to-table'>Agregar Cliente</button>
            </div>
        </>
    )
}