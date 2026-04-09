import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const A6 = [297, 420];

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
      <Page size={A6} style={styles.page}>
        {/* MAIN BOX */}
        <View style={styles.sectionBox}>
          {/* AGENCY HEADER */}
          <View style={styles.agencyBox}>
            <View style={styles.header}>
              {/* 🔒 Hardcoded Name */}
              <Text style={styles.agencyName}>OM SAI AQUA</Text>

              {/* 📍 Address */}
              <Text style={styles.agencyContact}>
                Anand Park, Dhanori Road, Vishrantwadi, Pune – 411015
              </Text>

              {/* 📞 Phone Numbers */}
              <Text style={styles.agencyContact}>
                955 2989 143 / 963 0969 994
              </Text>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.bodyBox}>
            {/* TITLE */}
            <View style={styles.invoiceTitleBox}>
              <Text style={styles.invoiceTitle}>Invoice</Text>
            </View>

            {/* INFO */}
            <View style={styles.infoSection}>
              {/* LEFT */}
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>Invoice No: {invoiceNumber}</Text>
                <Text style={styles.infoText}>
                  Date: {formatDate(createdAt)}
                </Text>
                <Text style={styles.infoText}>
                  Period: {formatDate(fromDate)} - {formatDate(toDate)}
                </Text>
              </View>

              {/* RIGHT */}
              <View style={[styles.infoColumn, { textAlign: "right" }]}>
                <Text style={styles.infoText}>Name: {customer?.name}</Text>
                <Text style={styles.infoText}>
                  Phone: {customer?.phoneNumber}
                </Text>
                <Text style={styles.infoText}>
                  Address: {customer?.address}
                </Text>
              </View>
            </View>

            {/* TABLE */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text
                  style={[styles.tableCell, styles.th, styles.colParticulars]}
                >
                  Product
                </Text>
                <Text style={[styles.tableCell, styles.th, styles.colCharges]}>
                  Qty
                </Text>
                <Text style={[styles.tableCell, styles.th, styles.colRate]}>
                  Rate
                </Text>
                <Text style={[styles.tableCell, styles.th, styles.colCharges]}>
                  Amount
                </Text>
              </View>

              {products.map((p, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={[styles.tableCell, styles.colParticulars]}>
                    {p.productName}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCharges]}>
                    {p.totalQuantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.colRate]}>
                    {p.price}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCharges]}>
                    {p.totalAmount}
                  </Text>
                </View>
              ))}

              {/* Empty rows */}
              {Array.from({ length: Math.max(0, 4 - products.length) }).map(
                (_, i) => (
                  <View style={styles.tableRow} key={`empty-${i}`}>
                    <Text style={styles.tableCell}> </Text>
                    <Text style={styles.tableCell}> </Text>
                    <Text style={styles.tableCell}> </Text>
                    <Text style={styles.tableCell}> </Text>
                  </View>
                )
              )}
            </View>

            {/* SUMMARY + QR */}
            <View style={{ flexDirection: "row" }}>
              {/* LEFT SUMMARY */}
              <View style={{ width: "65%" }}>
                <Summary label="Subtotal" value={subTotal} />
                <Summary label="Delivery" value={deliveryCharge} />
                <Summary label="Discount" value={discount} />
                <Summary label="Prev Due" value={previousDue} />
                <Summary label="Advance" value={previousAdvance} />

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.totalValue}>{total}</Text>
                </View>

                <Summary label="Paid" value={paidAmount} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Due</Text>
                  <Text style={{ color: "red" }}>{dueAmount}</Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 3 }}>
                  <Text style={styles.summaryLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.status,
                      { color: status === "paid" ? "green" : "#d32f2f" },
                    ]}
                  >
                    {status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* RIGHT QR */}
              {qrCode && (
                <View
                  style={{
                    width: "35%",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  <Image src={qrCode} style={{ width: 80, height: 80 }} />
                </View>
              )}
            </View>

            {/* FOOTER */}
            <Text style={styles.footer}>Thank you for your business 🙏</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const Summary = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}> {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 10,
    backgroundColor: "#fff",
  },

  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    opacity: 0.05,
    fontSize: 40,
    transform: "rotate(-45deg)",
  },

  sectionBox: {},

  agencyBox: {
    border: "1px solid #000",
    borderRadius: 5,
    padding: 5,
  },

  bodyBox: {
    border: "1px solid #000",
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
  },

  header: { textAlign: "center" },

  agencyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#d32f2f",
  },

  agencyContact: { fontSize: 8 },

  phoneNumber: { color: "#000" },

  invoiceTitleBox: {
    alignItems: "center",
    marginBottom: 4,
  },

  invoiceTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },

  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  infoColumn: { flex: 1 },

  infoText: { fontSize: 9 },

  table: { marginBottom: 6 },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
  },

  tableCell: { padding: 4, fontSize: 9 },

  th: { fontWeight: "bold" },

  colParticulars: { flex: 2 },
  colQty: { flex: 1, textAlign: "center" },
  colRate: { flex: 1, textAlign: "center" },
  colAmount: { flex: 1.2, textAlign: "right" },

  colCharges: { flex: 1, textAlign: "center" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 9,
    fontWeight: "bold",
  },

  summaryValue: { fontSize: 9 },

  totalRow: {
    borderTop: "1px solid #333",
    marginTop: 3,
    paddingTop: 3,
  },

  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },

  status: {
    fontWeight: "bold",
    marginLeft: 4,
  },

  footer: {
    textAlign: "center",
    fontSize: 7,
    marginTop: 6,
    borderTop: "1px solid #eee",
    paddingTop: 4,
  },
});

export default InvoicePdfView;
