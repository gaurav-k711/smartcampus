"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Filter 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemandLevel } from "@prisma/client";

interface PredictionItem {
  resource: {
    id: string;
    name: string;
    location: string;
    capacity: number;
    status: string;
    category: string;
  };
  prediction: {
    demandScore: number;
    demandLevel: DemandLevel;
    confidence: number;
    explanation: string;
    historicalBookingCount: number;
  };
}

interface DemandMatrixClientProps {
  initialPredictions: PredictionItem[];
  currentDate: string;
}

export default function DemandMatrixClient({
  initialPredictions,
  currentDate,
}: DemandMatrixClientProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedSlot, setSelectedSlot] = useState("10:00-12:00");
  const [predictions, setPredictions] = useState<PredictionItem[]>(initialPredictions);
  const [isLoading, setIsLoading] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  const handleFetchPredictions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/predictions?date=${selectedDate}&timeSlot=${selectedSlot}`
      );
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.predictions);
      }
    } catch (e) {
      console.error("Failed to load predictions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = predictions.filter(
    (p) => levelFilter === "ALL" || p.prediction.demandLevel === levelFilter
  );

  return (
    <div className="space-y-6">
      {/* Parameter Selection Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Analysis Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Time Window
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="08:00-10:00">08:00 AM - 10:00 AM (Early Morning)</option>
              <option value="10:00-12:00">10:00 AM - 12:00 PM (Mid Morning Peak)</option>
              <option value="12:00-14:00">12:00 PM - 02:00 PM (Noon Window)</option>
              <option value="14:00-16:00">02:00 PM - 04:00 PM (Afternoon Labs)</option>
              <option value="16:00-18:00">04:00 PM - 06:00 PM (Evening Seminar)</option>
            </select>
          </div>

          <div className="self-end">
            <Button
              size="sm"
              onClick={handleFetchPredictions}
              isLoading={isLoading}
              className="font-semibold"
            >
              Recalculate Matrix
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Filter Classification
          </label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">All Levels</option>
            <option value="HIGH">High Demand Only</option>
            <option value="MEDIUM">Medium Demand Only</option>
            <option value="LOW">Low Demand Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Predicted Facility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const { resource, prediction } = item;
          const isHigh = prediction.demandLevel === DemandLevel.HIGH;
          const isMed = prediction.demandLevel === DemandLevel.MEDIUM;

          return (
            <div
              key={resource.id}
              className={`p-5 rounded-2xl border shadow-xs bg-white space-y-3 transition-all ${
                isHigh
                  ? "border-rose-200 hover:border-rose-300"
                  : isMed
                  ? "border-amber-200 hover:border-amber-300"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {resource.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {resource.name}
                  </h3>
                </div>

                <Badge
                  className={
                    isHigh
                      ? "bg-rose-600 text-white"
                      : isMed
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white"
                  }
                >
                  {prediction.demandLevel}
                </Badge>
              </div>

              {/* Progress & Scores */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-extrabold text-slate-900 text-base">
                    {prediction.demandScore}/100
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Confidence: <strong>{prediction.confidence}%</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHigh
                        ? "bg-rose-500"
                        : isMed
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${prediction.demandScore}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                {prediction.explanation}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{resource.location}</span>
                <span>{prediction.historicalBookingCount} historical samples</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
