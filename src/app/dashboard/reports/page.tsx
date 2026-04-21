"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  ActivityPieChart, 
  AlertStatsChart, 
  SleepTrendChart, 
  RoomUsageGrid, 
  VitalsTrendChart 
} from "@/components/dashboard/report-charts";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">리포트</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base min-h-[44px] ${
              period === "daily" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            일간
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base min-h-[44px] ${
              period === "weekly" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base min-h-[44px] ${
              period === "monthly" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            월간
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <ActivityPieChart period={period} />
        <AlertStatsChart period={period} />
        <SleepTrendChart period={period} />
        <RoomUsageGrid period={period} />
      </div>

      <div className="mt-6">
        <VitalsTrendChart period={period} />
      </div>
    </div>
  );
}
