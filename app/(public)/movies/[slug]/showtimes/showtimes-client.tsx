"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ShowtimeData {
  id?: number;
  start_time: string;
  room?: {
    name?: string;
    format?: string;
  };
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
  formats: FormatGroup[];
}

interface FormatGroup {
  format: string;
  showtimes: {
    time: string;
    language: string;
  }[];
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
  const [expandedCinemas, setExpandedCinemas] = useState<Set<string>>(
    new Set()
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  // helper to get today's date in ICT (UTC+7)
  const getIctDateString = () => {
    const ict = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    return ict.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Extract unique dates from showtimes
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    showtimes.forEach((s) => {
      const date = new Date(s.start_time);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      dates.add(dateStr);
    });

    const sortedDates = Array.from(dates).sort();
    return sortedDates;
  }, [showtimes]);

  // Extract unique providers from showtimes
  const availableProviders = useMemo(() => {
    const providers = new Set<string>();
    showtimes.forEach((s) => {
      const provider = s.cinema?.provider?.name || "Unknown";
      providers.add(provider);
    });

    return Array.from(providers).sort();
  }, [showtimes]);

  useEffect(() => {
    if (availableDates.length === 0 || availableProviders.length === 0) return;

    // Set date to today (ICT) if not already set
    if (!selectedDate) {
      const ictToday = getIctDateString();
      setSelectedDate(availableDates.includes(ictToday) ? ictToday : availableDates[0]);
    }

    // Set provider from URL param if not already set
    if (!selectedProvider && providerParam) {
      const matchingProvider = availableProviders.find((p) =>
        p.toLowerCase().includes(providerParam.toLowerCase())
      );
      if (matchingProvider) setSelectedProvider(matchingProvider);
    }
  }, [availableDates, availableProviders]);
  // Set default selected date to first available date (used only if state is empty)
  const defaultDate = useMemo(() => {
    if (availableDates.length > 0 && !selectedDate) {
      return availableDates[0];
    }
    return selectedDate;
  }, [availableDates, selectedDate]);

  const currentSelectedDate = selectedDate || defaultDate;

  // Filter showtimes by selected date and provider
  const filteredShowtimes = useMemo(() => {
    let filtered = showtimes;

    if (currentSelectedDate) {
      filtered = filtered.filter((s) => {
        const date = new Date(s.start_time);
        const dateStr = date.toISOString().split("T")[0];
        return dateStr === currentSelectedDate;
      });
    }

    if (selectedProvider) {
      filtered = filtered.filter((s) => {
        const provider = s.cinema?.provider?.name || "Unknown";
        return provider.toLowerCase().includes(selectedProvider.toLowerCase());
      });
    }

    return filtered;
  }, [showtimes, currentSelectedDate, selectedProvider]);

  const groupedShowtimes = useMemo(() => {
    const cinemaMap: Record<string, CinemaGroup> = {};

    for (const s of filteredShowtimes) {
      const cinemaName = s.cinema?.name || "Unknown";
      const providerName = s.cinema?.provider?.name || "Unknown";
      const format = s.room?.format || "REGULAR";
      const roomName = s.room?.name || "Hall";
      const time = new Date(s.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Extract language from room name (e.g., "Hall 1 KH" -> "KH", "Hall 1 EN" -> "EN")
      const languageMatch = roomName.match(/\b([A-Z]{2})\b/);
      const language = languageMatch ? languageMatch[1] : "EN";

      const key = `${providerName}-${cinemaName}`;

      if (!cinemaMap[key]) {
        cinemaMap[key] = {
          name: cinemaName,
          provider: providerName,
          formats: [],
        };
      }

      let formatGroup = cinemaMap[key].formats.find(
        (f) => f.format === format
      );
      if (!formatGroup) {
        formatGroup = { format, showtimes: [] };
        cinemaMap[key].formats.push(formatGroup);
      }

      formatGroup.showtimes.push({ time, language });
    }

    // Sort formats and group showtimes by language
    const sorted = Object.values(cinemaMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sorted.map((cinema) => ({
      ...cinema,
      formats: cinema.formats
        .sort((a, b) => {
          // Sort by format: REGULAR, then 3D, then GOLD, etc.
          const order: Record<string, number> = {
            REGULAR: 0,
            "3D": 1,
            GOLD: 2,
            IMAX: 3,
          };
          return (
            (order[a.format.toUpperCase()] || 999) -
            (order[b.format.toUpperCase()] || 999)
          );
        })
        .map((format) => ({
          ...format,
          showtimes: Array.from(
            format.showtimes.reduce((map, st) => {
              const key = `${st.language}`;
              if (!map.has(key)) {
                map.set(key, []);
              }
              map.get(key)!.push(st.time);
              return map;
            }, new Map<string, string[]>())
          ).map(([language, times]) => ({
            language,
            times: [...new Set(times)],
          })),
        })),
    }));
  }, [filteredShowtimes]);

  const toggleCinema = (key: string) => {
    const newExpanded = new Set(expandedCinemas);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCinemas(newExpanded);
  };

  const getFormatColor = (format: string) => {
    const upper = format.toUpperCase();
    if (upper.includes("3D")) return "text-purple-400";
    if (upper.includes("GOLD")) return "text-yellow-500";
    if (upper.includes("IMAX")) return "text-orange-400";
    return "text-zinc-300";
  };

  const getProviderColor = (provider: string) => {
    if (provider.toLowerCase().includes("legend")) return "text-red-400";
    if (provider.toLowerCase().includes("prime")) return "text-blue-400";
    return "text-zinc-300";
  };

  if (showtimes.length === 0) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
        <p className="text-zinc-400">No showtimes available</p>
      </div>
    );
  }

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <label className="text-white font-semibold whitespace-nowrap">Filter by Date:</label>
          <div className="relative">
            <select
              value={currentSelectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg pr-10 hover:border-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDateDisplay(date)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Provider Filter */}
        <div className="flex items-center gap-3">
          <label className="text-white font-semibold whitespace-nowrap">Filter by Provider:</label>
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg pr-10 hover:border-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Showtimes List */}
      <div className="space-y-3">
        {filteredShowtimes.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400">No showtimes available for the selected filters</p>
          </div>
        ) : (
          groupedShowtimes.map((cinema) => {
            const cinemaKey = `${cinema.provider}-${cinema.name}`;
            const isExpanded = expandedCinemas.has(cinemaKey);

            return (
              <div
                key={cinemaKey}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden"
              >
                {/* Cinema Header */}
                <button
                  onClick={() => toggleCinema(cinemaKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-white text-left">
                    {cinema.name}
                  </h2>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Cinema Content */}
                {isExpanded && (
                  <div className="bg-zinc-950/80 px-6 py-8 space-y-8 border-t border-zinc-800">
                    {cinema.formats.map((formatGroup) => (
                      <div key={formatGroup.format}>
                        {/* Format Header */}
                        <div className="mb-6">
                          <h3
                            className={`text-lg font-bold mb-4 ${getFormatColor(
                              formatGroup.format
                            )}`}
                          >
                            {formatGroup.format}
                          </h3>

                          {/* Language Groups */}
                          <div className="space-y-4">
                            {formatGroup.showtimes.map((langGroup) => (
                              <div key={langGroup.language}>
                                {/* Language and Type Label */}
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm text-zinc-400">
                                    EN •{" "}
                                    <span className="text-xs text-zinc-500">
                                      {formatGroup.format}
                                    </span>
                                  </span>
                                </div>

                                {/* Showtimes Grid */}
                                <div className="flex flex-wrap gap-2">
                                  {langGroup.times.map((time) => (
                                    <button
                                      key={time}
                                      className={`px-4 py-2 rounded-full border-2 transition-all ${cinema.provider
                                          .toLowerCase()
                                          .includes("legend")
                                          ? "border-zinc-700 text-zinc-200 hover:border-red-500 hover:bg-red-500/10"
                                          : "border-zinc-700 text-zinc-200 hover:border-blue-500 hover:bg-blue-500/10"
                                        }`}
                                    >
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
