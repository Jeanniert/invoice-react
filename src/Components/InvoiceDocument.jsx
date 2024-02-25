import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// Crear estilos
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    border: "1pt solid #000000",
  },
  cell: {
    flex: 1,
    border: "1pt solid #000000",
    padding: 5,
  },
});

// Crear componente de documento
const InvoiceDocument= ({ invoiceData })=> {



  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      {/* Inicio del documento */}
      <Document>
        {/* Renderizar una sola página */}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Factura</Text>
          </View>
          <View style={styles.section}>
            <Text>Fecha: {invoiceData['date']}</Text>
            <Text>Número de factura: {invoiceData['correlative']}</Text>
          </View>
          <View style={styles.section}>
            <Text>Empresa: {invoiceData.company}</Text>
            <Text>Teléfono: {invoiceData['companyPhone']}</Text>
            <Text>Dirección: {invoiceData['companyAddress']}</Text>
          </View>
          <View style={styles.section}>
            <Text>Cliente: {invoiceData.customer}</Text>
            <Text>Teléfono: {invoiceData['customerPhone']}</Text>
            <Text>Dirección: {invoiceData['customerAddress']}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.cell}>
                <Text>Nº</Text>
              </View>
              <View style={styles.cell}>
                <Text>Descripción</Text>
              </View>
              <View style={styles.cell}>
                <Text>Cantidad</Text>
              </View>
              <View style={styles.cell}>
                <Text>Precio</Text>
              </View>
              <View style={styles.cell}>
                <Text>Subtotal</Text>
              </View>
            </View>
            {invoiceData['product']?.map((item) => (
              <View key={item.name} style={styles.table}>
                <View style={styles.cell}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.unit_price}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{invoiceData['subtotal']}</Text>
                </View>
              </View>
            ))}
            <View style={styles.table}>
              <View style={styles.cell}>
                <Text></Text>
              </View>
              <View style={styles.cell}>
                <Text></Text>
              </View>
              <View style={styles.cell}>
                <Text></Text>
              </View>
              <View style={styles.cell}>
                <Text>Total</Text>
              </View>
              <View style={styles.cell}>
                <Text>{invoiceData['total']}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text>Fecha de vencimiento: {invoiceData.due_date}</Text>
            <Text>Saldo: {invoiceData.balance}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}


export default InvoiceDocument;