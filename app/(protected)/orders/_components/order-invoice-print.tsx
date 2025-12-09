import { getPaymentMethodLabel, IOrder } from "@/types/order";
import { formatCurrency, getShippingAddress, getUserFullName } from "@/utils";
import { forwardRef } from "react";

interface OrderInvoicePrintProps {
  order: IOrder | null;
}

export const OrderInvoicePrint = forwardRef<HTMLDivElement, OrderInvoicePrintProps>(
  ({ order }, ref) => {
    if (!order) {
      return <div ref={ref as any} />;
    }

    return (
      <div
        ref={ref}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "32px",
          margin: "0 auto",
          background: "#fff",
          color: "#1a1a1a",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "8px",
              width: "100%",
            }}
          >
            <img
              src="/logo.svg"
              alt="ACB Computer"
              style={{
                width: "100px",
                height: "100px",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            HÓA ĐƠN BÁN HÀNG
          </h1>
          <p style={{ color: "#6b7280", margin: "0" }}>
            Ngày {new Date().getDate()} Tháng {new Date().getMonth() + 1} Năm{" "}
            {new Date().getFullYear()}
          </p>
        </div>

        {/* Order Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px 0" }}>
              Thông tin giao hàng
            </h3>
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
              <InfoRow
                label="Người nhận"
                value={order.shippingName || getUserFullName(order.user)}
              />
              <InfoRow label="Số điện thoại" value={order.shippingPhone} />
              <InfoRow label="Địa chỉ" value={getShippingAddress(order)} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px 0" }}>
              Thông tin đơn hàng
            </h3>
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
              <InfoRow label="Mã đơn hàng" value={`#${order.id}`} />
              <InfoRow
                label="Ngày tạo đơn hàng"
                value={order.orderedAt ? new Date(order.orderedAt).toLocaleString("vi-VN") : "—"}
              />
              <InfoRow
                label="Phương thức thanh toán"
                value={
                  order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : "Chưa xác định"
                }
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px 0" }}>
            Chi tiết sản phẩm
          </h3>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "bold",
                    }}
                  >
                    Sản phẩm
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "bold",
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "bold",
                    }}
                  >
                    Đơn giá
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "bold",
                    }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ fontWeight: "500" }}>
                        {item.product?.name || `Sản phẩm ${item.productId}`}
                      </div>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <div style={{ fontWeight: "500" }}>{item.quantity}</div>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "8px",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "8px",
                        borderBottom: "1px solid #f3f4f6",
                        fontWeight: "600",
                      }}
                    >
                      {formatCurrency(item.totalPrice || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
          <div style={{ width: "200px" }}>
            <AmountRow label="Tạm tính" value={formatCurrency(order.subtotal || 0)} />
            <AmountRow label="Giảm giá" value={`- ${formatCurrency(order.discountAmount || 0)}`} />
            <div style={{ borderTop: "2px solid #e5e7eb", margin: "8px 0", width: "100%" }} />
            <AmountRow label="Tổng cộng" value={formatCurrency(order.totalAmount || 0)} highlight />
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#6b7280", fontSize: "12px", marginTop: "32px" }}>
          <p style={{ margin: "0" }}>Cảm ơn quý khách đã mua sắm tại hệ thống của chúng tôi!</p>
          <p style={{ margin: "4px 0 0 0" }}>
            Hỗ trợ: support@acbcomputer.store | Hotline: 0352343012
          </p>
        </div>
      </div>
    );
  },
);

OrderInvoicePrint.displayName = "OrderInvoicePrint";

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "6px" }}>
    <span style={{ minWidth: "110px", color: "#6b7280", fontSize: "12px" }}>{label}:</span>
    <span style={{ fontWeight: "500", flex: 1 }}>{value || "—"}</span>
  </div>
);

const AmountRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
    <span style={{ fontWeight: highlight ? 700 : 500, fontSize: highlight ? "16px" : "14px" }}>
      {label}
    </span>
    <span
      style={{
        fontWeight: highlight ? 800 : 600,
        fontSize: highlight ? "16px" : "14px",
        color: highlight ? "#1f2937" : "#374151",
      }}
    >
      {value}
    </span>
  </div>
);
