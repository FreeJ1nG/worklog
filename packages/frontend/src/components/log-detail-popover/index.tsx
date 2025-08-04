import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Dot, Pencil, Trash2 } from 'lucide-react'
import { type ReactNode } from 'react'
import { type LogSchema } from 'worklog-shared'

import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import { useAuth } from '@/lib/hooks/use-auth'

export interface LogDetailPopoverProps {
  children?: ReactNode
  log: LogSchema
  onEdit: () => void
  onDelete: () => void
}

export default function LogDetailPopover({
  children,
  log,
  onEdit,
  onDelete,
}: LogDetailPopoverProps): ReactNode {
  const isAuthenticated = useAuth()

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="z-50 max-w-80 sm:max-w-[580px]">
        <div className="flex flex-col rounded-sm border border-gray-500 bg-black/90 px-4 py-2 text-white shadow-xl">
          <div>
            {new Date(log.startTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="mb-1 text-[15px] font-semibold">
            {new Date(log.startTime).toTimeString().slice(0, 5)}
            {' '}
            -
            {' '}
            {new Date(log.endTime).toTimeString().slice(0, 5)}
          </div>
          {log.descriptions.map((desc, i) => (
            <div key={i} className="flex items-start">
              <Dot />
              <div className="text-sm">{desc}</div>
            </div>
          ))}
          {isAuthenticated && (
            <div className="my-2 flex items-center justify-end gap-2">
              <Button onClick={onDelete} variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                <div className="text-xs">Delete</div>
              </Button>
              <Button onClick={onEdit} variant="secondary" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                <div className="text-xs">Edit</div>
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
