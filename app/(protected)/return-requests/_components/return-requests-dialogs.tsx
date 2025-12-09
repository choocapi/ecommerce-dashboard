import { ReturnRequestsMutateDrawer } from "./return-requests-mutate-drawer";
import { useReturnRequests } from "./return-requests-provider";

export function ReturnRequestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useReturnRequests();

  return (
    <>
      <ReturnRequestsMutateDrawer
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

