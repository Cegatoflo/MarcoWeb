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

    // Agrupar mandiles por color
    const mandilesPorColor = {};
    pedido.mandiles.forEach(mandil => {
        const color = mandil.color;
        if (!mandilesPorColor[color]) {
            mandilesPorColor[color] = 0;
        }
        mandilesPorColor[color]++;
    });

    doc.text('Mandiles:', { underline: true });
    doc.moveDown();

    // Escribir los mandiles agrupados por color
    for (const color in mandilesPorColor) {
        const cantidad = mandilesPorColor[color];
        doc.text(`Color: ${color} - Cantidad: ${cantidad}`);
        doc.moveDown();
    }

    // Espacio para el precio
    doc.text('Precio: ______________________', { align: 'left' });
    doc.moveDown();

    return doc;
};