import { StaffsDrawer } from "./staffs-drawer";
import { useStaffs } from "./staffs-provider";

export function StaffsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStaffs();

  return (
    <>
      <StaffsDrawer
        key="staff-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentStaff={null}
      />

      <StaffsDrawer
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
