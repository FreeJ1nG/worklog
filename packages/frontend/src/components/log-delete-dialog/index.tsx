import { type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingButton } from '@/components/ui/loading-button'

export interface LogDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isDeleting: boolean
  onDelete: () => void
}

export default function LogDeleteDialog({
  open,
  onOpenChange,
  isDeleting,
  onDelete,
}: LogDeleteDialogProps): ReactNode {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Log Confirmation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this log? This action is irreversible
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-28">
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton
            loading={isDeleting}
            onClick={onDelete}
            type="button"
            variant="destructive"
            className="w-28"
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
