import { Helmet } from "react-helmet";
import { MonthlyOrdersReport, SalesReport } from "../../Components/Reports";

import '../../Styles/SDashboard.css';
export function  Reportsview(){
    return(
        <>
            <Helmet>
                <title>Productos |  TOTOS</title>
            </Helmet>
        <div className="title-container">
            <h1>Informes</h1>
        </div>
        <div className="full-width-container">
            <div className="big-card">
            <SalesReport />
            </div>
            <div className="big-card">
            <MonthlyOrdersReport />
            </div>
        </div>
        </>
    )
}