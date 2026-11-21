import React, { useState, useMemo } from 'react';
import { Habit, HabitLogs } from '../types';
import { formatDateKey, getDaysInMonth, MONTH_NAMES } from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { 
  BarChart3, 
  Trophy, 
  CalendarDays, 
  Flame, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

interface AnalyticsDashboardProps {
  currentYear: number;
  currentMonth: number;
  habits: Habit[];
  logs: HabitLogs;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentYear,
  currentMonth,
  habits,
  logs,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthName = MONTH_NAMES[currentMonth];

  // 1. Daily consistency data for area/bar chart
  const dailyData = useMemo(() => {
    return days.map((date) => {
      const dateKey = formatDateKey(date);
      let count = 0;
      habits.forEach(h => {
        if (logs[h.id] && logs[h.id][dateKey]) count++;
      });
      const rate = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0;
      return {
        day: date.getDate(),
        dateKey,
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
        total: habits.length,
        rate,
      };
    });
  }, [days, habits, logs]);

  // Overall monthly average
  const monthlyAverageRate = useMemo(() => {
    if (dailyData.length === 0) return 0;
    const sum = dailyData.reduce((acc, d) => acc + d.rate, 0);
    return Math.round(sum / dailyData.length);
  }, [dailyData]);

  // 2. Habit Leaderboard ranking
  const habitLeaderboard = useMemo(() => {
    return habits.map(habit => {
      const habitLog = logs[habit.id] || {};
      let monthCompleted = 0;
      days.forEach(d => {
        const key = formatDateKey(d);
        if (habitLog[key]) monthCompleted++;
      });
      const target = habit.targetDays || days.length;
      const rate = Math.round((monthCompleted / target) * 100);
      const streak = calculateCurrentStreak(habitLog);

      return {
        habit,
        monthCompleted,
        target,
        rate,
        streak,
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits, logs, days]);

  // 3. 7-Day Weekly Breakdown (Mon - Sun)
  const weeklyBreakdown = useMemo(() => {
    // 0 = Sun, 1 = Mon, ..., 6 = Sat
    // We want Monday (1) to Sunday (0)
    const order = [1, 2, 3, 4, 5, 6, 0];
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return order.map((dayOfWeek, idx) => {
      const matchingDays = days.filter(d => d.getDay() === dayOfWeek);
      let totalCompleted = 0;
      let totalSlots = matchingDays.length * habits.length;

      matchingDays.forEach(d => {
        const key = formatDateKey(d);
        habits.forEach(h => {
          if (logs[h.id] && logs[h.id][key]) totalCompleted++;
        });
      });

      const rate = totalSlots > 0 ? Math.round((totalCompleted / totalSlots) * 100) : 0;

      return {
        name: names[idx],
        dayOfWeek,
        occurrences: matchingDays.length,
        totalCompleted,
        totalSlots,
        rate,
      };
    });
  }, [days, habits, logs]);

  const strongestDay = useMemo(() => {
    return [...weeklyBreakdown].sort((a, b) => b.rate - a.rate)[0];
  }, [weeklyBreakdown]);

  const weakestDay = useMemo(() => {
    return [...weeklyBreakdown].sort((a, b) => a.rate - b.rate)[0];
  }, [weeklyBreakdown]);

  // SVG Chart Geometry
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = dailyData.map((d, i) => {
    const x = paddingX + (i / (dailyData.length - 1 || 1)) * graphWidth;
    const y = paddingY + graphHeight - (d.rate / 100) * graphHeight;
    return { x, y, ...d };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x.toFixed(1)},${paddingY + graphHeight} L ${points[0].x.toFixed(1)},${paddingY + graphHeight} Z`
    : '';

  const avgY = paddingY + graphHeight - (monthlyAverageRate / 100) * graphHeight;

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Visual Analytics & Consistency
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live automated insights calculated from your spreadsheet grid for {monthName} {currentYear}
            </p>
          </div>
        </div>
      </div>

      {/* Chart 1: Daily Consistency Trend Chart */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Daily Consistency Trend</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Avg {monthlyAverageRate}%
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Completion percentage across all habits for each day of the month
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block"></span>
              <span>Daily Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-gray-400 inline-block"></span>
              <span>Monthly Avg</span>
            </div>
          </div>
        </div>

        {/* Pure SVG Chart with Tooltip */}
        <div className="relative w-full overflow-hidden">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-48 sm:h-56 select-none overflow-visible"
          >
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map(val => {
              const y = paddingY + graphHeight - (val / 100) * graphHeight;
              return (
                <g key={val}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    className="text-gray-100 dark:text-gray-800/80" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={paddingX - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[10px] fill-gray-400 dark:fill-gray-500 font-mono"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Monthly Average Dashed Line */}
            <line 
              x1={paddingX} 
              y1={avgY} 
              x2={svgWidth - paddingX} 
              y2={avgY} 
              stroke="#9CA3AF" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
              opacity="0.7"
            />

            {/* Filled Area */}
            {areaD && (
              <path 
                d={areaD} 
                fill="url(#emeraldGradient)" 
              />
            )}

            {/* Smooth Line Path */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* Data Points */}
            {points.map((p, idx) => {
              const isHovered = hoveredDayIndex === idx;
              return (
                <g key={p.dateKey}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3}
                    className={`transition-all duration-150 cursor-pointer ${
                      isHovered
                        ? 'fill-emerald-600 stroke-white stroke-2'
                        : p.rate === 100
                        ? 'fill-emerald-500'
                        : p.rate > 0
                        ? 'fill-emerald-400'
                        : 'fill-gray-300 dark:fill-gray-600'
                    }`}
                    onMouseEnter={() => setHoveredDayIndex(idx)}
                    onMouseLeave={() => setHoveredDayIndex(null)}
                  />
                  {/* Invisible larger hit target */}
                  <rect
                    x={p.x - 10}
                    y={paddingY}
                    width={20}
                    height={graphHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDayIndex(idx)}
                    onMouseLeave={() => setHoveredDayIndex(null)}
                  />
                </g>
              );
            })}

            {/* X-axis Day Labels */}
            {points.map((p, idx) => {
              // Show label every few days or if hovered to avoid crowding
              const showLabel = idx === 0 || idx === points.length - 1 || (idx + 1) % 5 === 0 || hoveredDayIndex === idx;
              if (!showLabel) return null;
              return (
                <text
                  key={`lbl-${p.day}`}
                  x={p.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    hoveredDayIndex === idx 
                      ? 'fill-emerald-600 dark:fill-emerald-400 font-bold' 
                      : 'fill-gray-400 dark:fill-gray-500'
                  }`}
                >
                  {p.day}
                </text>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredDayIndex !== null && points[hoveredDayIndex] && (
            <div 
              className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl border border-gray-700/80 font-sans animate-fade-in"
              style={{
                left: `${(points[hoveredDayIndex].x / svgWidth) * 100}%`,
                top: `${(points[hoveredDayIndex].y / svgHeight) * 100 - 8}%`,
              }}
            >
              <div className="font-semibold text-emerald-400">
                {monthName} {points[hoveredDayIndex].day} ({points[hoveredDayIndex].weekday})
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-gray-300">
                <span>{points[hoveredDayIndex].count} of {points[hoveredDayIndex].total} habits done</span>
                <span className="font-bold text-white font-mono">({points[hoveredDayIndex].rate}%)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Habit Leaderboard & Weekly Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Habit Leaderboard / Breakdown */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Habit Leaderboard & Consistency Ranking</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Sorted by monthly completion rate towards goal target
              </p>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {habitLeaderboard.map((item, index) => {
              const rankColor = index === 0 ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200' :
                                index === 1 ? 'text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200' :
                                index === 2 ? 'text-amber-700 bg-amber-50/50 dark:bg-amber-950/30 border-amber-300' :
                                'text-gray-400 bg-gray-50 dark:bg-gray-800/40 border-gray-100';

              return (
                <div 
                  key={item.habit.id}
                  className="p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border font-mono ${rankColor}`}>
                        #{index + 1}
                      </span>
                      <span className="text-lg">{item.habit.emoji}</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate block">
                          {item.habit.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.habit.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.streak > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 font-mono">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          {item.streak}d
                        </span>
                      )}
                      <span className="font-mono font-bold text-xs text-gray-800 dark:text-gray-200">
                        {item.monthCompleted}/{item.target}d
                      </span>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                        item.rate >= 80 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                          : item.rate >= 50
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.rate}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700/80 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.rate >= 80 ? 'bg-emerald-500' : item.rate >= 50 ? 'bg-blue-500' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(100, item.rate)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Weekly Heatmap / Overview */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Weekly Heatmap & Day Breakdown</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Analyze which days of the week you perform best
                </p>
              </div>

              {strongestDay && (
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Strongest Day</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {strongestDay.name} ({strongestDay.rate}%)
                  </span>
                </div>
              )}
            </div>

            {/* 7 Columns Day Cards */}
            <div className="grid grid-cols-7 gap-2 my-4">
              {weeklyBreakdown.map(item => {
                const isStrongest = strongestDay && item.name === strongestDay.name;
                const isWeakest = weakestDay && item.name === weakestDay.name && item.rate < 70;

                // Color calculation
                let bgTint = 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/60';
                let barColor = 'bg-gray-300 dark:bg-gray-600';

                if (item.rate >= 85) {
                  bgTint = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
                  barColor = 'bg-emerald-500';
                } else if (item.rate >= 60) {
                  bgTint = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
                  barColor = 'bg-emerald-400';
                } else if (item.rate > 0) {
                  bgTint = 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
                  barColor = 'bg-amber-400';
                }

                return (
                  <div 
                    key={item.name}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${bgTint} ${
                      isStrongest ? 'ring-2 ring-emerald-500 shadow-xs' : isWeakest ? 'ring-1 ring-amber-400/80' : ''
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      {item.name}
                    </span>

                    <div className="my-3 w-3 bg-gray-200 dark:bg-gray-700 h-20 rounded-full overflow-hidden flex items-end">
                      <div 
                        className={`w-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ height: `${item.rate}%` }}
                      />
                    </div>

                    <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                      {item.rate}%
                    </span>

                    <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                      {item.totalCompleted}/{item.totalSlots}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight Summary Pill */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                <strong>{strongestDay ? strongestDay.name : 'Weekdays'}</strong> is your most productive day!
              </span>
            </div>
            {weakestDay && weakestDay.rate < 60 && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Focus on {weakestDay.name}s
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
