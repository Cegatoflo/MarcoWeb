import PDFDocument from 'pdfkit';

export const crearDocumentoPDF = (pedido) => {
    const doc = new PDFDocument();

    // Escribir contenido en el PDF
    doc.fontSize(25).text('Detalle del Pedido', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`ID Pedido: ${pedido.idPedido}`);
    doc.text(`RUC: ${pedido.ruc}`);
    doc.text(`Estado: ${pedido.estado}`);
    if (pedido.fechaPedido) {
        doc.text(`Fecha del Pedido: ${pedido.fechaPedido.toLocaleDateString()}`);
    }
    doc.moveDown();

    // Mostrar la cantidad total de mandiles
    const cantidadMandiles = pedido.mandiles.length;
    doc.text(`Cantidad total de mandiles: ${cantidadMandiles}`);
    doc.moveDown();

    // Espacio para el precio
    doc.text('Precio: ______________________', { align: 'left' });
    doc.moveDown();

    return doc;
};
