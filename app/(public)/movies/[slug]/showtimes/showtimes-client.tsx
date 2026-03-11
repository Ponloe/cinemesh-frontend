"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ShowtimeData {
  id?: number;
  start_time: string;
  hall_type?: string | null;
  version_label?: string | null;
  audio_language?: string | null;
  subtitle_language?: string | null;
  cinema?: {
    name?: string;
    provider?: {
      name?: string;
    };
  };
}

interface CinemaGroup {
  name: string;
  provider: string;
  times: string[];
}

interface ShowtimesClientProps {
  showtimes: ShowtimeData[];
  movieSlug: string;
  providerParam?: string;
}

export default function ShowtimesClient({
  showtimes,
  movieSlug,
  providerParam,
}: ShowtimesClientProps) {
  const [expandedCinemas, setExpandedCinemas] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const getIctDateString = () => {
    const ict = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    return ict.toISOString().split("T")[0];
  };

  const availableDates = useMemo(() => {
    const dates = new Set<string>();

    showtimes.forEach((s) => {
      const date = new Date(s.start_time).toISOString().split("T")[0];
      dates.add(date);
    });

    return Array.from(dates).sort();
  }, [showtimes]);

  const availableProviders = useMemo(() => {
    const providers = new Set<string>();

    showtimes.forEach((s) => {
      providers.add(s.cinema?.provider?.name ?? "Unknown");
    });

    return Array.from(providers).sort();
  }, [showtimes]);

  useEffect(() => {
    if (!availableDates.length || !availableProviders.length) return;

    if (!selectedDate) {
      const today = getIctDateString();
      setSelectedDate(availableDates.includes(today) ? today : availableDates[0]);
    }

    if (!selectedProvider && providerParam) {
      const match = availableProviders.find((p) =>
        p.toLowerCase().includes(providerParam.toLowerCase())
      );
      if (match) setSelectedProvider(match);
    }
  }, [availableDates, availableProviders]);

  const currentSelectedDate = selectedDate || availableDates[0];

  const filteredShowtimes = useMemo(() => {
    let filtered = showtimes;

    if (currentSelectedDate) {
      filtered = filtered.filter((s) => {
        const date = new Date(s.start_time).toISOString().split("T")[0];
        return date === currentSelectedDate;
      });
    }

    if (selectedProvider) {
      filtered = filtered.filter((s) =>
        (s.cinema?.provider?.name ?? "")
          .toLowerCase()
          .includes(selectedProvider.toLowerCase())
      );
    }

    return filtered;
  }, [showtimes, currentSelectedDate, selectedProvider]);

  const groupedShowtimes = useMemo(() => {
    const cinemaMap: Record<string, CinemaGroup> = {};

    for (const s of filteredShowtimes) {
      const cinemaName = s.cinema?.name ?? "Unknown";
      const providerName = s.cinema?.provider?.name ?? "Unknown";

      const time = new Date(s.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const key = `${providerName}-${cinemaName}`;

      if (!cinemaMap[key]) {
        cinemaMap[key] = {
          name: cinemaName,
          provider: providerName,
          times: [],
        };
      }

      cinemaMap[key].times.push(time);
    }

    return Object.values(cinemaMap)
      .map((cinema) => ({
        ...cinema,
        times: [...new Set(cinema.times)].sort((a, b) => {
          const toMinutes = (t: string) => {
            const [time, period] = t.split(" ");
            let [h, m] = time.split(":").map(Number);

            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;

            return h * 60 + m;
          };

          return toMinutes(a) - toMinutes(b);
        }),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredShowtimes]);

  const toggleCinema = (key: string) => {
    const newSet = new Set(expandedCinemas);

    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);

    setExpandedCinemas(newSet);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (!showtimes.length) {
    return (
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8 text-center">
        <p className="text-zinc-400">No showtimes available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4">

        <div className="flex items-center gap-3">
          <label className="text-white font-semibold">Filter by Date:</label>

          <div className="relative">
            <select
              value={currentSelectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg pr-10"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDateDisplay(date)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-white font-semibold">Filter by Provider:</label>

          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg pr-10"
            >
              <option value="">All Providers</option>

              {availableProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </div>
      </div>

      {/* Showtimes */}

      <div className="space-y-3">

        {groupedShowtimes.map((cinema) => {
          const key = `${cinema.provider}-${cinema.name}`;
          const expanded = expandedCinemas.has(key);

          return (
            <div
              key={key}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleCinema(key)}
                className="w-full flex justify-between p-4 hover:bg-zinc-800/50"
              >
                <h2 className="text-lg font-semibold text-white">
                  {cinema.name}
                </h2>

                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded && (
                <div className="bg-zinc-950/80 px-6 py-6 border-t border-zinc-800">
                  <div className="flex flex-wrap gap-2">
                    {cinema.times.map((time) => (
                      <button
                        key={time}
                        className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-200 hover:border-red-500 hover:bg-red-500/10"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}