import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const InvoicePdfView = ({ data, shop }) => {
  if (!data) return null;

  const {
    customer,
    products = [],
    fromDate,
    toDate,
    subTotal = 0,
    deliveryCharge = 0,
    discount = 0,
    previousDue = 0,
    previousAdvance = 0,
    paidAmount = 0,
    dueAmount = 0,
    total = 0,
    status,
    invoiceNumber,
    createdAt,
    qrCode,
  } = data;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          {shop?.logo && <Image src={shop.logo} style={styles.logo} />}

          <Text style={styles.shopName}>{shop?.name || "Water Supplier"}</Text>

          <Text style={styles.shopInfo}>{shop?.address}</Text>

          <Text style={styles.shopInfo}>📞 {shop?.phoneNumber}</Text>

          {shop?.gst && <Text style={styles.gst}>GST: {shop.gst}</Text>}
        </View>

        {/* TITLE */}
        <Text style={styles.title}> INVOICE</Text>

        {/* INFO */}
        <View style={styles.infoSection}>
          <View>
            <Text>Invoice No: {invoiceNumber}</Text>
            <Text>Date: {formatDate(createdAt)}</Text>
            <Text>
              Period: {formatDate(fromDate)} - {formatDate(toDate)}
            </Text>
          </View>

          <View>
            <Text>Name: {customer?.name}</Text>
            <Text>Phone: {customer?.phoneNumber}</Text>
            <Text>Address: {customer?.address}</Text>
          </View>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Product</Text>
          <Text style={styles.col2}>Qty</Text>
          <Text style={styles.col3}>Rate</Text>
          <Text style={styles.col4}>Total</Text>
        </View>

        {/* TABLE BODY */}
        {products.map((p, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.col1}>{p.productName}</Text>
            <Text style={styles.col2}>{p.totalQuantity}</Text>
            <Text style={styles.col3}>₹ {p.price}</Text>
            <Text style={styles.col4}>₹ {p.totalAmount}</Text>
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summary}>
          <Row label="Subtotal" value={subTotal} />
          <Row label="Delivery Charge" value={deliveryCharge} />
          <Row label="Discount" value={discount} />
          <Row label="Previous Due" value={previousDue} />
          <Row label="Previous Advance" value={previousAdvance} />

          <View style={styles.totalRow}>
            <Text>Total</Text>
            <Text>₹ {total}</Text>
          </View>

          <Row label="Paid" value={paidAmount} />

          <View style={styles.dueRow}>
            <Text>Due</Text>
            <Text>₹ {dueAmount}</Text>
          </View>

          <Text style={styles.status}>Status: {status?.toUpperCase()}</Text>
        </View>

        {/* QR */}
        {qrCode && (
          <View style={styles.qrBox}>
            <Image src={qrCode} style={styles.qr} />
          </View>
        )}

        {/* FOOTER */}
        <Text style={styles.footer}>Thank you for your business 🙏</Text>
      </Page>
    </Document>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.rowBetween}>
    <Text>{label}</Text>
    <Text>₹ {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },

  header: { textAlign: "center", marginBottom: 6 },

  logo: {
    width: 60,
    height: 60,
    margin: "0 auto",
    marginBottom: 4,
  },

  shopName: { fontSize: 14, fontWeight: "bold" },

  shopInfo: { fontSize: 9 },

  gst: { fontSize: 9, marginTop: 2 },

  title: {
    textAlign: "center",
    marginVertical: 6,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: 4,
  },

  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    marginBottom: 3,
  },

  row: { flexDirection: "row", marginBottom: 2 },

  col1: { width: "40%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "20%", textAlign: "center" },
  col4: { width: "25%", textAlign: "right" },

  summary: { marginTop: 8, borderTop: "1px solid black", paddingTop: 5 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid black",
    marginTop: 4,
    paddingTop: 3,
    fontWeight: "bold",
  },

  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "red",
    marginTop: 4,
  },

  status: { textAlign: "center", marginTop: 6 },

  qrBox: { alignItems: "center", marginTop: 10 },

  qr: { width: 80, height: 80 },

  footer: { textAlign: "center", marginTop: 10 },
});

export default InvoicePdfView;
