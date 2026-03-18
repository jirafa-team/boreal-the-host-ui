'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useGetStaffScheduleQuery,
  useUpsertStaffScheduleMutation,
} from '@/app/admin/staff/slice/staffSlice';
import { DAY_LABELS, SCHEDULE_PRESETS } from '@/app/admin/staff/constants';
import type { StaffScheduleEntry } from '@/interfaces/staff/StaffSchedule';

interface Props {
  staffId: string | null;
  staffName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function createEmptyWeek(): StaffScheduleEntry[] {
  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    startTime: '07:00',
    endTime: '15:00',
    isActive: false,
  }));
}

export function StaffScheduleEditor({ staffId, staffName, open, onOpenChange }: Props) {
  const { data, isLoading } = useGetStaffScheduleQuery(staffId!, {
    skip: !staffId || !open,
  });
  const [upsertSchedule, { isLoading: isSaving }] = useUpsertStaffScheduleMutation();

  const [entries, setEntries] = useState<StaffScheduleEntry[]>(createEmptyWeek);

  useEffect(() => {
    if (!data?.data?.schedule) {
      setEntries(createEmptyWeek());
      return;
    }
    const week = createEmptyWeek();
    for (const s of data.data.schedule) {
      week[s.dayOfWeek] = { ...s };
    }
    setEntries(week);
  }, [data]);

  const updateEntry = useCallback(
    (day: number, patch: Partial<StaffScheduleEntry>) => {
      setEntries((prev) =>
        prev.map((e) => (e.dayOfWeek === day ? { ...e, ...patch } : e)),
      );
    },
    [],
  );

  const applyPreset = useCallback(
    (presetKey: string) => {
      const preset = SCHEDULE_PRESETS[presetKey];
      if (!preset) return;
      setEntries((prev) =>
        prev.map((e) =>
          e.isActive
            ? { ...e, startTime: preset.startTime, endTime: preset.endTime }
            : e,
        ),
      );
    },
    [],
  );

  const copyWeekdays = useCallback(() => {
    setEntries((prev) => {
      const monday = prev[0];
      return prev.map((e) =>
        e.dayOfWeek >= 1 && e.dayOfWeek <= 4
          ? { ...e, startTime: monday.startTime, endTime: monday.endTime, isActive: monday.isActive }
          : e,
      );
    });
  }, []);

  const activateWeekdays = useCallback(() => {
    setEntries((prev) =>
      prev.map((e) =>
        e.dayOfWeek <= 4 ? { ...e, isActive: true } : e,
      ),
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!staffId) return;
    try {
      await upsertSchedule({ id: staffId, schedule: entries }).unwrap();
      onOpenChange(false);
    } catch {
      // error handled by RTK Query
    }
  }, [staffId, entries, upsertSchedule, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Horario semanal {staffName ? `- ${staffName}` : ''}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(SCHEDULE_PRESETS).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(key)}
                >
                  {preset.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={activateWeekdays}>
                L-V activos
              </Button>
              <Button variant="outline" size="sm" onClick={copyWeekdays}>
                Copiar Lunes a L-V
              </Button>
            </div>

            {/* Schedule grid */}
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.dayOfWeek}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  <div className="flex items-center gap-2 w-28">
                    <Switch
                      checked={entry.isActive}
                      onCheckedChange={(checked) =>
                        updateEntry(entry.dayOfWeek, { isActive: checked })
                      }
                    />
                    <Label className="text-sm font-medium">
                      {DAY_LABELS[entry.dayOfWeek]}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) =>
                        updateEntry(entry.dayOfWeek, { startTime: e.target.value })
                      }
                      disabled={!entry.isActive}
                      className="w-auto"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) =>
                        updateEntry(entry.dayOfWeek, { endTime: e.target.value })
                      }
                      disabled={!entry.isActive}
                      className="w-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Guardando...' : 'Guardar horario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
