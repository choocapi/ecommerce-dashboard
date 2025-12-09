import { CouponsMutateDrawer } from "./coupons-mutate-drawer";
import { useCoupons } from "./coupons-provider";

export function CouponsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCoupons();

  return (
    <>
      <CouponsMutateDrawer
        key="coupon-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentCoupon={null}
      />

      <CouponsMutateDrawer
        key={`coupon-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentCoupon={currentRow}
      />
    </>
  );
}
