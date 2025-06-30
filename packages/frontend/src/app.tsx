import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cnif } from "cnif";
import { type ReactNode, useMemo, useState } from "react";
import {
  type GetLogsQueryParamSchema,
  type LogJsonEntrySchema,
} from "worklog-shared";

import { LoadingComponent } from "@/components/loading-component";
import LogDeleteDialog from "@/components/log-delete-dialog";
import LogDetailPopover from "@/components/log-detail-popover";
import { LogFormDialog } from "@/components/log-form-dialog";
import { Button } from "@/components/ui/button";
import { DAYS, MONTHS } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/use-auth";
import { createLog, deleteLog, getLogs, updateLog } from "@/lib/services/logs";
import {
  cn,
  daysInMonth,
  getLogDuration,
  getLogDynamicStyles,
  getTimeString,
} from "@/lib/utils";

function App(): ReactNode {
  const qc = useQueryClient();
  const isAuthenticated = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    () => new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(() =>
    new Date().getFullYear(),
  );
  const [selectedLogToUpdate, setSelectedLogToUpdate] = useState<
    LogJsonEntrySchema | undefined
  >(undefined);
  const [selectedLogToDelete, setSelectedLogToDelete] = useState<
    LogJsonEntrySchema | undefined
  >(undefined);
  const amountOfDays = daysInMonth({
    month: selectedMonth,
    year: selectedYear,
  });

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  const range = useMemo(() => {
    const now = new Date();
    now.setMonth(selectedMonth - 1);
    now.setFullYear(selectedYear);
    const beginningOfMonth = new Date(now.toDateString());
    const endOfMonth = new Date(now.toDateString());
    beginningOfMonth.setDate(1);
    endOfMonth.setMonth(now.getMonth() + 1);
    endOfMonth.setDate(1);
    return {
      startTime: beginningOfMonth.getTime(),
      endTime: endOfMonth.getTime(),
    };
  }, [selectedMonth, selectedYear]);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs", { ...range }],
    queryFn: ({ queryKey }) =>
      getLogs({ ...(queryKey[1] as GetLogsQueryParamSchema) }),
  });

  const { mutate: createLogMutation, isPending: isCreating } = useMutation({
    mutationFn: createLog,
    onSuccess(data) {
      qc.setQueryData(["logs", { ...range }], () =>
        data.filter(
          ({ startTime, endTime }) =>
            range.startTime <= endTime && range.endTime >= startTime,
        ),
      );
    },
  });

  const { mutate: updateLogMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateLog,
    onSuccess(data) {
      qc.setQueryData(["logs", { ...range }], () =>
        data.filter(
          ({ startTime, endTime }) =>
            range.startTime <= endTime && range.endTime >= startTime,
        ),
      );
    },
  });

  const { mutate: deleteLogMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteLog,
    onSuccess(_data, id) {
      qc.setQueryData(["logs", { ...range }], (old: LogJsonEntrySchema[]) =>
        old.filter(({ id: oldId }) => oldId !== id),
      );
    },
  });

  const logsMap = useMemo(() => {
    const result: Map<number, LogJsonEntrySchema[]> = new Map();
    for (let date = 1; date <= amountOfDays; date += 1) {
      const logsInDate: LogJsonEntrySchema[] = [];
      if (logs) {
        for (const log of logs) {
          const logStartDate = new Date(log.startTime);
          const logEndDate = new Date(log.endTime);
          const startOfNextDay =
            new Date(selectedYear, selectedMonth - 1, date + 1).getTime() - 1;
          const startOfDay = new Date(
            selectedYear,
            selectedMonth - 1,
            date,
          ).getTime();
          if (
            logEndDate.getTime() >= startOfDay &&
            logStartDate.getTime() <= startOfNextDay
          ) {
            logsInDate.push(log);
          }
        }
      }
      result.set(date, logsInDate);
    }
    return result;
  }, [selectedYear, selectedMonth, logs, amountOfDays]);

  const startOfMonth = new Date(
    selectedYear,
    selectedMonth,
    1,
    0,
    0,
    0,
  ).getTime();
  const endOfMonth =
    new Date(selectedYear, selectedMonth + 1, 1, 0, 0, 0).getTime() - 1;

  return (
    <div className="mb-10 flex flex-col p-6">
      <LogFormDialog
        type="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={(data) => {
          createLogMutation(data);
          setOpenCreateDialog(false);
        }}
        isSubmitting={isCreating}
      />
      <LogFormDialog
        type="update"
        open={Boolean(selectedLogToUpdate)}
        onOpenChange={(open) => {
          if (!open) setSelectedLogToUpdate(undefined);
        }}
        initialData={logs?.find((log) => log.id === selectedLogToUpdate?.id)}
        onSubmit={(data) => {
          selectedLogToUpdate &&
            updateLogMutation({ id: selectedLogToUpdate.id, log: data });
          setSelectedLogToUpdate(undefined);
        }}
        isSubmitting={isUpdating}
      />
      <LogDeleteDialog
        isDeleting={isDeleting}
        open={Boolean(selectedLogToDelete)}
        onOpenChange={(open) => {
          if (!open) setSelectedLogToDelete(undefined);
        }}
        onDelete={() => {
          selectedLogToDelete && deleteLogMutation(selectedLogToDelete.id);
          setSelectedLogToDelete(undefined);
        }}
      />
      {isAuthenticated && (
        <Button
          onClick={() => setOpenCreateDialog(true)}
          variant="default"
          className="fixed bottom-4 right-4 z-40"
        >
          Add work log
        </Button>
      )}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setSelectedYear((prev) => prev - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500"
        >
          -1
        </button>
        <div className="text-xl font-bold">{selectedYear}</div>
        <button
          onClick={() => setSelectedYear((prev) => prev + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500"
        >
          +1
        </button>
        <button></button>
      </div>
      <div className="flex flex-row gap-2 overflow-auto">
        {MONTHS.map((month) => (
          <Button
            key={month.id}
            onClick={() => setSelectedMonth(month.id)}
            variant={selectedMonth === month.id ? "default" : "secondary"}
          >
            {month.label}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <div className="font-bold">
          {Number(
            logs?.reduce(
              (acc, log) => {
                const logStartDate = new Date(log.startTime)
                const logEndDate = new Date(log.endTime)
                let duration: number = 0
                if (logStartDate.getMonth() !== logEndDate.getMonth()) {
                  duration = getLogDuration(
                    log,
                    selectedYear,
                    selectedMonth,
                    logStartDate.getMonth() === selectedMonth - 1 ? logStartDate.getDate() - 1 : logEndDate.getDate() - 1,
                    "hour",
                  )
                } else {
                  duration += (log.endTime - log.startTime) / (1000 * 60 * 60)
                }
                return acc + duration
              },
              0,
            ),
          ).toFixed(4)}{" "}
          hours
        </div>
        <div className="text-sm">
          worked in
          {" " + MONTHS[selectedMonth - 1].label}
        </div>
      </div>
      <div className="relative mt-6 flex flex-col overflow-auto pt-6 shadow-xl">
        <LoadingComponent loading={isLoading} fallback="Loading ...">
          {[...Array.from({ length: amountOfDays }).keys()].map((date) => (
            <div
              key={date}
              className={cn(
                "flex h-16 min-w-[1600px]",
                cnif({ "bg-gray-200": date % 2 === 0 }, "bg-gray-50"),
              )}
            >
              <div className="sticky left-0 z-40 flex w-24 flex-col bg-gray-300 py-1 pl-4">
                <div>{date + 1}</div>
                <div className="text-left text-sm font-semibold">
                  {DAYS[
                    new Date(selectedYear, selectedMonth - 1, date + 1).getDay()
                  ].shortLabel.toUpperCase()}
                </div>
              </div>
              <div className="relative grid h-full w-full grid-cols-1440 grid-rows-1">
                {logsMap.get(date + 1)?.map((log) => (
                  <LogDetailPopover
                    key={`date-range-${log.id}`}
                    log={log}
                    onEdit={() => setSelectedLogToUpdate(log)}
                    onDelete={() => setSelectedLogToDelete(log)}
                  >
                    <button
                      style={getLogDynamicStyles(
                        log,
                        selectedYear,
                        selectedMonth,
                        date + 1,
                      )}
                      className={cn(
                        "absolute bottom-0 top-0 z-30 my-2 flex flex-col items-center",
                        "justify-center rounded-sm bg-black font-semibold text-white shadow-sm",
                        "truncate px-1",
                      )}
                    >
                      {getLogDuration(
                        log,
                        selectedYear,
                        selectedMonth,
                        date,
                        "ms",
                      ) >=
                        1.75 * 60 * 60 * 1000 && (
                        <div className="text-sm">
                          {new Date(log.startTime).toTimeString().slice(0, 5)}-
                          {new Date(log.endTime).toTimeString().slice(0, 5)}
                        </div>
                      )}
                      <div className="text-xs font-bold">
                        {getLogDuration(
                          log,
                          selectedYear,
                          selectedMonth,
                          date,
                          "hour",
                        )}
                        h
                      </div>
                    </button>
                  </LogDetailPopover>
                ))}
                {[...Array.from({ length: 12 }).keys()].map((i) => (
                  <div
                    key={i}
                    className="relative col-[span_120_/_span_120] row-span-1"
                  >
                    {date === 0 && (
                      <div className="absolute -right-4 -top-6">
                        {getTimeString(120 * (i + 1))}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 top-0 z-20 flex">
                      <div className="h-[calc(100%-2px)] w-[1px] border border-dashed border-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-2 h-full w-[1px] bg-gray-800" />
              <div
                className={cn(
                  "sticky right-0 flex flex-col items-center justify-center",
                  "z-30 w-32 bg-gray-300 px-3 text-sm shadow-xl",
                )}
              >
                <div className="text-xl font-semibold">
                  {Number(
                    (
                      logsMap
                        .get(date + 1)
                        ?.reduce(
                          (acc, log) =>
                            acc +
                            getLogDuration(
                              log,
                              selectedYear,
                              selectedMonth,
                              date,
                              "hour",
                            ),
                          0,
                        ) ?? 0
                    ).toFixed(4),
                  )}
                </div>
                <div className="text-xs font-semibold">HOURS</div>
              </div>
            </div>
          ))}
        </LoadingComponent>
      </div>
    </div>
  );
}

export default App;
