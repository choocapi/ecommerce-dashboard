import { BannersMutateDrawer } from "./banners-mutate-drawer";
import { useBanners } from "./banners-provider";

export function BannersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBanners();

  return (
    <>
      <BannersMutateDrawer
        key="banner-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentBanner={null}
      />

      <BannersMutateDrawer
        key={`banner-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentBanner={currentRow}
      />
    </>
  );
}
