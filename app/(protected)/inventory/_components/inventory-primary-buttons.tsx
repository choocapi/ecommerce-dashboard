import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInventory } from './inventory-provider'
import { usePermissions } from '@/hooks/use-permissions'
import { Feature } from '@/config/permissions-config'

export function InventoryPrimaryButtons() {
  const { setOpen } = useInventory()
  const { canCreate } = usePermissions()

  if (!canCreate(Feature.INVENTORY)) {
    return null
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <Plus size={18} />
        <span>Tạo giao dịch kho</span>
      </Button>
    </div>
  )
}
