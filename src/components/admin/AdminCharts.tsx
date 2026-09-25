import React from 'react';
import { motion } from 'motion/react';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

/* ------------------------------------------------------------------ */
/* Sparkline — tiny trend line for KPI cards                          */
/* ------------------------------------------------------------------ */
export const Sparkline: React.FC<{
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}> = ({ data, color = '#FFFFFF', width = 100, height = 32, fill = true }) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      {fill && (
        <polygon
          points={area}
          fill={color}
          opacity={0.12}
          stroke="none"
        />
      )}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* DonutChart — revenue / order split                                 */
/* ------------------------------------------------------------------ */
export const DonutChart: React.FC<{
  data: ChartDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
  emptyLabel?: string;
}> = ({ data, size = 180, thickness = 22, centerLabel, centerSub, emptyLabel = 'No data yet' }) => {
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  if (total <= 0) {
    return (
      <div className="flex items-center justify-center text-white/50 text-xs" style={{ width: size, height: size }}>
        {emptyLabel}
      </div>
    );
  }

  let accumulated = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const len = (d.value / total) * circumference;
          const offset = accumulated;
          accumulated += len;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color || '#FFFFFF'}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len - 2, 0.5)} ${circumference - Math.max(len - 2, 0.5)}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-mono font-bold text-white leading-none">{centerLabel}</span>
        {centerSub && <span className="text-[10px] text-white/70 uppercase tracking-wider mt-1 font-semibold">{centerSub}</span>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* VerticalBarChart — day/series volume                               */
/* ------------------------------------------------------------------ */
export const VerticalBarChart: React.FC<{
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  prefix?: string;
  locale?: string;
}> = ({ data, height = 120, color = 'rgba(255,255,255,0.85)', prefix = '', locale = 'en-US' }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="w-full flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * (height - 24), 4);
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
            <div
              className="text-[9px] font-mono text-white/80 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {prefix}{numberFormatter.format(d.value)}
            </div>
            <motion.div
              initial={{ height: 4 }}
              animate={{ height: h }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-t-[4px] cursor-pointer transition-colors"
              style={{
                background: d.value === max ? 'rgba(255,255,255,0.95)' : color,
                opacity: 0.5 + (d.value / max) * 0.5,
              }}
            />
            <span className="text-[9px] text-white/60 truncate w-full text-center font-semibold uppercase tracking-wide">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* HorizontalBars — revenue by category / top items                   */
/* ------------------------------------------------------------------ */
export const HorizontalBars: React.FC<{
  data: ChartDatum[];
  prefix?: string;
  locale?: string;
}> = ({ data, prefix = '', locale = 'en-US' }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = Math.max((d.value / max) * 100, 3);
        return (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/85 font-medium truncate pr-2">{d.label}</span>
              <span className="font-mono font-bold text-white shrink-0">{prefix}{numberFormatter.format(d.value)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: d.color || 'rgba(255,255,255,0.85)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Funnel — order conversion pipeline                                 */
/* ------------------------------------------------------------------ */
export const Funnel: React.FC<{
  steps: { label: string; value: number; color?: string }[];
  entryLabel?: string;
  conversionLabel?: string;
  locale?: string;
}> = ({ steps, entryLabel = 'entry', conversionLabel = 'conv', locale = 'en-US' }) => {
  const max = Math.max(...steps.map((s) => s.value), 1);
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const widthPct = Math.max((s.value / max) * 100, 8);
        const conversion = i === 0 ? 100 : Math.round((s.value / Math.max(steps[i - 1].value, 1)) * 100);
        return (
          <div key={i} className="flex items-center gap-3">
            <div
              className="rounded-lg px-3 py-2 text-xs font-bold border transition-all"
              style={{
                width: `${widthPct}%`,
                minWidth: 48,
                background: s.color || 'rgba(255,255,255,0.12)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.25)',
              }}
            >
              {s.label}
              <span className="block font-mono text-white/85 text-[11px] mt-0.5">{numberFormatter.format(s.value)}</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] font-bold text-white/70 block">{i === 0 ? '—' : `${numberFormatter.format(conversion)}%`}</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider">{i === 0 ? entryLabel : conversionLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section card wrapper reused across dashboard analytics             */
/* ------------------------------------------------------------------ */
export const AnalyticsCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, right, children }) => (
  <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col">
    <div className="px-5 py-4 border-b border-white/15 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#3D2B05] border border-white/20 flex items-center justify-center text-white shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif-luxury text-base font-bold text-white leading-tight truncate">{title}</h3>
          {subtitle && <p className="text-[10px] text-white/60 font-medium">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
    <div className="p-5 flex-1">{children}</div>
  </div>
);