import React from "react";

const InvoiceHtmlView = ({ data, shop }) => {
  if (!data) return <div>No invoice data</div>;

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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.shopName}>{shop?.name || "Water Supplier"}</div>
        <div style={styles.shopInfo}>
          {shop?.address} | {shop?.phoneNumber}
        </div>
      </div>

      {/* TITLE */}
      <div style={styles.title}>WATER DELIVERY INVOICE</div>

      {/* INFO */}
      <div style={styles.infoSection}>
        <div>
          <div>
            <b>Invoice No:</b> {invoiceNumber}
          </div>
          <div>
            <b>Date:</b> {formatDate(createdAt)}
          </div>
          <div>
            <b>Period:</b> {formatDate(fromDate)} - {formatDate(toDate)}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div>
            <b>Name:</b> {customer?.name}
          </div>
          <div>
            <b>Phone:</b> {customer?.phoneNumber}
          </div>
          <div>
            <b>Address:</b> {customer?.address}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thLeft}>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th style={styles.thRight}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td style={styles.tdLeft}>{p.productName}</td>
              <td style={styles.center}>{p.totalQuantity}</td>
              <td className="center">₹ {p.price}</td>
              <td style={styles.tdRight}>₹ {p.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <Row label="Subtotal" value={subTotal} />
        <Row label="Delivery Charge" value={deliveryCharge} />
        <Row label="Discount" value={discount} />
        <Row label="Previous Due" value={previousDue} />
        <Row label="Previous Advance" value={previousAdvance} />

        <div style={styles.totalRow}>
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        <Row label="Paid" value={paidAmount} />

        <div style={styles.dueRow}>
          <span>Due</span>
          <span>₹ {dueAmount}</span>
        </div>

        <div style={styles.status}>
          Status:{" "}
          <span
            style={{
              color:
                status === "paid"
                  ? "green"
                  : status === "partial"
                  ? "orange"
                  : "red",
            }}
          >
            {status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* QR */}
      {qrCode && (
        <div style={styles.qrBox}>
          <img src={qrCode} alt="QR" style={styles.qr} />
        </div>
      )}

      {/* FOOTER */}
      <div style={styles.footer}>Thank you for your business 🙏</div>
    </div>
  );
};

// 🔹 Reusable Row
const Row = ({ label, value }) => (
  <div style={styles.row}>
    <span>{label}</span>
    <span>₹ {value}</span>
  </div>
);

// 🎨 STYLES
const styles = {
  page: {
    width: 360,
    margin: "auto",
    padding: 12,
    border: "1px solid #000",
    fontFamily: "Arial",
    fontSize: 12,
    background: "#fff",
  },

  header: {
    textAlign: "center",
  },

  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0077b6",
  },

  shopInfo: {
    fontSize: 11,
  },

  title: {
    textAlign: "center",
    fontWeight: "bold",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
    margin: "8px 0",
  },

  infoSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 8,
  },

  thLeft: {
    textAlign: "left",
    borderBottom: "1px solid #000",
  },

  thRight: {
    textAlign: "right",
    borderBottom: "1px solid #000",
  },

  tdLeft: {
    padding: "4px 0",
  },

  tdRight: {
    textAlign: "right",
  },

  center: {
    textAlign: "center",
  },

  summary: {
    borderTop: "1px solid #000",
    paddingTop: 6,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    borderTop: "1px solid #000",
    marginTop: 4,
    paddingTop: 4,
  },

  dueRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    color: "red",
    marginTop: 4,
  },

  status: {
    textAlign: "center",
    marginTop: 6,
    fontWeight: "bold",
  },

  qrBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },

  qr: {
    width: 90,
    height: 90,
  },

  footer: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 11,
  },
};

export default InvoiceHtmlView;
