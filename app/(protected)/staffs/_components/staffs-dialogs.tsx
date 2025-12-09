import { StaffsMutateDrawer } from "./staffs-mutate-drawer";
import { useStaffs } from "./staffs-provider";

export function StaffsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStaffs();

  return (
    <>
      <StaffsMutateDrawer
        key="staff-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentStaff={null}
      />

      <StaffsMutateDrawer
        key={`staff-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentStaff={currentRow}
      />
    </>
  );
}
