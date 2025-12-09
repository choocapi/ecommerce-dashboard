import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBanners } from './banners-provider'
import { usePermissions } from '@/hooks/use-permissions'
import { Feature } from '@/config/permissions-config'

export function BannersPrimaryButtons() {
  const { setOpen } = useBanners()
  const { canCreate } = usePermissions()

  if (!canCreate(Feature.BANNERS)) {
    return null
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <Plus size={18} />
        <span>Thêm banner</span>
      </Button>
    </div>
  )
}
