import { ReturnRequestsDrawer } from "./return-requests-drawer";
import { useReturnRequests } from "./return-requests-provider";

export function ReturnRequestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useReturnRequests();

  return (
    <>
      <ReturnRequestsDrawer
        key={`return-request-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentReturnRequest={currentRow}
      />
    </>
  );
}
