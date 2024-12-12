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

    // Imprimir los mandiles como una boleta
    doc.text('Mandiles:', { underline: true });
    doc.moveDown();

    doc.fontSize(10);
    doc.text('Código\tDescripción\tCantidad\tPrecio');
    doc.moveDown();

    pedido.mandiles.forEach((mandil) => {
        doc.text(`${mandil.codigo}\t${mandil.descripcion}\t${mandil.cantidad}\t${mandil.precio}`);
        doc.moveDown();
    });

    // Espacio para el precio total
    doc.fontSize(12);
    doc.text('Precio Total: ______________________', { align: 'left' });
    doc.moveDown();

    return doc;
};