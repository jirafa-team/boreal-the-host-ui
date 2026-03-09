'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n-context';
import {
  Sparkles,
  Wrench,
  Shield,
  ReceiptText,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { StaffStatsByDepartment } from '@/interfaces/staff/StaffStatsByDepartment';

const DEPARTMENT_STYLE: Record<
  string,
  { icon: LucideIcon; bg: string; border: string; iconBg: string }
> = {
  Limpieza: {
    icon: Sparkles,
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-500',
  },
  Mantenimiento: {
    icon: Wrench,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-500',
  },
  Seguridad: {
    icon: Shield,
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-500',
  },
  Recepción: {
    icon: ReceiptText,
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-800',
    iconBg: 'bg-pink-500',
  },
  Servicio: {
    icon: UtensilsCrossed,
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    iconBg: 'bg-violet-500',
  },
};

const DEFAULT_STYLE = {
  icon: Sparkles,
  bg: 'bg-muted/50',
  border: 'border-border',
  iconBg: 'bg-primary',
};

export interface DepartmentStatsCardsProps {
  staffStats: StaffStatsByDepartment[];
  isLoading?: boolean;
}

export function DepartmentStatsCards({ staffStats, isLoading }: DepartmentStatsCardsProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse border border-border">
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!staffStats?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {staffStats.map((stat) => {
        const name = stat.departmentName ?? t('admin.withoutDepartment') ?? 'Sin departamento';
        const style = DEPARTMENT_STYLE[name] ?? DEFAULT_STYLE;
        const Icon = style.icon;
        const total = stat.available + stat.busy;
        const occupied = total > 0 ? Math.round((stat.busy / total) * 100) : 0;
        const rest = 0; // Descanso: API no tiene este estado aún

        return (
          <Card
            key={stat.departmentId ?? name}
            className={`${style.bg} border ${style.border} transition-shadow hover:shadow-md`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center text-white`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground">{name}</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{stat.available}</span>{' '}
                  {t('admin.available')}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{stat.busy}</span>{' '}
                  {t('admin.busy')}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{rest}</span>{' '}
                  {t('admin.off')}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {t('admin.occupation') ?? 'Ocupación'}:{' '}
                  <span className="font-semibold text-foreground">{occupied}%</span>
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all ${style.iconBg}`}
                    style={{ width: `${occupied}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
