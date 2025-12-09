'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SpecificationsFieldProps {
  value: string
  onChange: (value: string) => void
}

interface SpecificationItem {
  key: string
  value: string
}

export const SpecificationsField = ({ value, onChange }: SpecificationsFieldProps) => {
  // Parse JSON string to array
  const parseValue = (): SpecificationItem[] => {
    if (!value) return []
    try {
      const parsed = JSON.parse(value)
      return Object.entries(parsed).map(([key, val]) => ({
        key,
        value: val as string,
      }))
    } catch {
      return []
    }
  }

  const [specs, setSpecs] = useState<SpecificationItem[]>(parseValue())

  const updateSpecs = (newSpecs: SpecificationItem[]) => {
    setSpecs(newSpecs)
    // Convert array back to JSON object
    const obj: Record<string, string> = {}
    newSpecs.forEach((spec) => {
      if (spec.key && spec.value) {
        obj[spec.key] = spec.value
      }
    })
    onChange(JSON.stringify(obj))
  }

  const handleAdd = () => {
    updateSpecs([...specs, { key: '', value: '' }])
  }

  const handleRemove = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    updateSpecs(newSpecs)
  }

  const handleChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = newValue
    updateSpecs(newSpecs)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        {specs.map((spec, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div className='flex-1'>
              <Label htmlFor={`spec-key-${index}`} className='text-sm'>
                Tên thông số
              </Label>
              <Input
                id={`spec-key-${index}`}
                placeholder='Tên thông số (vd: Màn hình)'
                value={spec.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                className='mt-1'
              />
            </div>
            <div className='flex-1'>
              <Label htmlFor={`spec-value-${index}`} className='text-sm'>
                Giá trị
              </Label>
              <Input
                id={`spec-value-${index}`}
                placeholder='Giá trị (vd: 22 inch)'
                value={spec.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className='mt-1'
              />
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handleRemove(index)}
              className='mt-6'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        ))}

        <Button type='button' variant='outline' onClick={handleAdd} className='w-full'>
          <Plus className='h-4 w-4 mr-2' />
          Thêm thông số
        </Button>
      </div>
    </div>
  )
}
