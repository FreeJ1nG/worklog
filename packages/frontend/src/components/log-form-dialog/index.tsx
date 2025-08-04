import { CirclePlus, Dot, Trash2 } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { type LogSchema } from 'worklog-shared'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { useToast } from '@/components/ui/use-toast'

export type LogFormDialogProps = {
  isSubmitting: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LogSchema) => void
} & (
  | {
    type: 'update'
    initialData?: LogSchema
  }
  | { type: 'create', initialData?: undefined }
)

export const LogFormDialog = ({
  open,
  onOpenChange,
  type,
  initialData,
  isSubmitting,
  onSubmit,
}: LogFormDialogProps): ReactNode => {
  const { toast } = useToast()
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.startTime) : new Date(),
  )
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.endTime) : new Date(),
  )
  const [startTime, setStartTime] = useState<string>(
    initialData
      ? new Date(initialData.startTime).toTimeString().slice(0, 5)
      : '',
  )
  const [endTime, setEndTime] = useState<string>(
    initialData ? new Date(initialData.endTime).toTimeString().slice(0, 5) : '',
  )
  const [descriptions, setDescriptions] = useState<string[]>(
    initialData ? initialData.descriptions : [''],
  )

  const resetData = useCallback(() => {
    setSelectedStartDate(
      initialData ? new Date(initialData.startTime) : new Date(),
    )
    setSelectedEndDate(
      initialData ? new Date(initialData.endTime) : new Date(),
    )
    setStartTime(
      initialData
        ? new Date(initialData.startTime).toTimeString().slice(0, 5)
        : '',
    )
    setEndTime(
      initialData
        ? new Date(initialData.endTime).toTimeString().slice(0, 5)
        : '',
    )
    setDescriptions(initialData ? initialData.descriptions : [''])
  }, [initialData])

  useEffect(() => {
    if (!initialData) return
    resetData()
  }, [initialData, resetData])

  const handleSubmit = useCallback(() => {
    if (!selectedStartDate || !selectedEndDate) {
      toast({ title: 'You must select a date', variant: 'destructive' })
      return
    }
    if (startTime === '') {
      toast({ title: 'You must select a start time', variant: 'destructive' })
      return
    }
    if (endTime === '') {
      toast({ title: 'You must select an end time', variant: 'destructive' })
      return
    }
    const startTimeDate = new Date(selectedStartDate)
    const endTimeDate = new Date(selectedEndDate)
    const [sh, sm] = startTime.split(':')
    startTimeDate.setHours(Number.parseInt(sh, 10))
    startTimeDate.setMinutes(Number.parseInt(sm, 10))
    startTimeDate.setSeconds(0)
    startTimeDate.setMilliseconds(0)
    const [eh, em] = endTime.split(':')
    endTimeDate.setHours(Number.parseInt(eh, 10))
    endTimeDate.setMinutes(Number.parseInt(em, 10))
    endTimeDate.setSeconds(0)
    endTimeDate.setMilliseconds(0)
    onSubmit({
      startTime: startTimeDate.getTime(),
      endTime: endTimeDate.getTime(),
      descriptions: descriptions.filter(
        desc => Boolean(desc) && typeof desc === 'string',
      ),
    })
    resetData()
  }, [
    endTime,
    startTime,
    selectedStartDate,
    selectedEndDate,
    descriptions,
    onSubmit,
    toast,
    resetData,
  ])

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
        resetData()
      }}
    >
      <DialogContent className="max-h-[calc(100vh-40px)] w-[820px] max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {type === 'create' ? 'Create' : 'Update'}
            {' '}
            work log
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            <Calendar
              mode="single"
              selected={selectedStartDate}
              onSelect={date => setSelectedStartDate(date)}
            />
            <Calendar
              mode="single"
              selected={selectedEndDate}
              onSelect={date => setSelectedEndDate(date)}
            />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Input
              type="time"
              className="w-fit"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <div>-</div>
            <Input
              type="time"
              className="w-fit"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
          <div className="mt-5 flex w-full flex-col gap-1">
            {descriptions.map((desc, i) => (
              <div key={i} className="flex items-center gap-2">
                <Dot />
                <Input
                  type="text"
                  value={desc}
                  onChange={e => setDescriptions(prev => [
                    ...prev.slice(0, i),
                    e.target.value,
                    ...prev.slice(i + 1),
                  ])}
                />
                <Button
                  variant="destructive"
                  onClick={() => setDescriptions(prev => [
                    ...prev.slice(0, i),
                    ...prev.slice(i + 1),
                  ])}
                  size="icon"
                  className="max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setDescriptions(prev => [...prev, ''])}
              className="my-2 w-full"
              variant="outline"
              size="sm"
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Add another description
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-28">
              Close
            </Button>
          </DialogClose>
          <LoadingButton
            loading={isSubmitting}
            onClick={handleSubmit}
            type="button"
            variant="default"
            className="w-28"
          >
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
