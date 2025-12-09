import { ProductsMutateDrawer } from './products-mutate-drawer'
import { useProducts } from './products-provider'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts()

  return (
    <>
      <ProductsMutateDrawer
        key='product-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        currentProduct={null}
      />

      <ProductsMutateDrawer
        key={`product-update-${currentRow?.id}`}
        open={open === 'update'}
        onOpenChange={() => {
          setOpen('update')
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        currentProduct={currentRow}
      />

    </>
  )
}
