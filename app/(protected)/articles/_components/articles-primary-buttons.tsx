import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useArticles } from './articles-provider'
import { usePermissions } from '@/hooks/use-permissions'
import { Feature } from '@/config/permissions-config'

export function ArticlesPrimaryButtons() {
  const { setOpen } = useArticles()
  const { canCreate } = usePermissions()

  if (!canCreate(Feature.ARTICLES)) {
    return null
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <Plus size={18} />
        <span>Thêm bài viết</span>
      </Button>
    </div>
  )
}
