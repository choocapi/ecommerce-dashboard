import { BrandsMutateDrawer } from './brands-mutate-drawer'
import { useBrands } from './brands-provider'

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrands()

  return (
    <>
      <BrandsMutateDrawer
        key='brand-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        currentBrand={null}
      />

      <BrandsMutateDrawer
        key={`brand-update-${currentRow?.id}`}
        open={open === 'update'}
        onOpenChange={() => {
          setOpen('update')
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        currentBrand={currentRow}
      />

    </>
  )
}
