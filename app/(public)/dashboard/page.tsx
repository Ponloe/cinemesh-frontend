"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";

const CINEMA_SHOWTIMES = [
  {
    id: "1",
    title: "Avatar: Fire and Ash",
    year: 2025,
    chain: "Legend Cinema",
    cinema: "Chipmong 271 Mega Mall",
    type: "2D ScreenX",
    showtime: "06:00 PM",
  },
  {
    id: "2",
    title: "Avatar: Fire and Ash",
    year: 2025,
    chain: "Legend Cinema",
    cinema: "Chipmong 271 Mega Mall",
    type: "2D Diamond Class",
    showtime: "06:20 PM",
  },
];

export default function CinemasPage() {
  const [activeSection, setActiveSection] = useState("cinemas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [streamingSearch, setStreamingSearch] = useState("");

  const filteredShowtimes = CINEMA_SHOWTIMES.filter((showtime) => {
    const matchesSearch = showtime.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCinema = !selectedCinema || showtime.cinema === selectedCinema;
    return matchesSearch && matchesCinema;
  });

  const uniqueCinemas = Array.from(
    new Set(CINEMA_SHOWTIMES.map((s) => s.cinema)),
  );

  const renderContent = () => {
    switch (activeSection) {
      case "cinemas":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-normal text-white mb-6">
                Search All Movies
              </h2>

              <input
                type="text"
                placeholder="Movie Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 mb-6"
              />

              <div className="grid grid-cols-3 gap-4 mb-8">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-500 focus:outline-none focus:border-zinc-700 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="">Date</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="weekend">This Weekend</option>
                </select>

                <select
                  value={selectedCinema}
                  onChange={(e) => setSelectedCinema(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-500 focus:outline-none focus:border-zinc-700 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="">Cinema</option>
                  {uniqueCinemas.map((cinema) => (
                    <option key={cinema} value={cinema}>
                      {cinema}
                    </option>
                  ))}
                </select>

                <button className="bg-white hover:bg-zinc-100 text-black font-semibold px-6 py-4 rounded-xl transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredShowtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Title</p>
                      <h3 className="text-xl font-normal text-white mb-6">
                        {showtime.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mb-2">Cinema</p>
                      <p className="text-base text-white">{showtime.cinema}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Year</p>
                      <p className="text-base text-white mb-6">
                        {showtime.year}
                      </p>
                      <p className="text-xs text-zinc-500 mb-2">Type</p>
                      <p className="text-base text-white">{showtime.type}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Chain</p>
                      <div className="flex items-center gap-2 mb-6">
                        <p className="text-base text-white">{showtime.chain}</p>
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                          LEGEND
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">Showtime</p>
                      <p className="text-xl font-normal text-white">
                        {showtime.showtime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredShowtimes.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-zinc-500">No showtimes found.</p>
                </div>
              )}
            </div>
          </>
        );

      case "streaming":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-normal text-white mb-6">
                Streaming Services
              </h2>

              <input
                type="text"
                placeholder="Search streaming service or movie..."
                value={streamingSearch}
                onChange={(e) => setStreamingSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 mb-6"
              />

              <div className="grid grid-cols-2 gap-4 mb-8">
                <select
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-zinc-500 focus:outline-none focus:border-zinc-700 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="">All Services</option>
                  <option value="netflix">Netflix</option>
                  <option value="prime">Prime Video</option>
                  <option value="disney">Disney+</option>
                  <option value="hbo">HBO Max</option>
                </select>

                <button className="bg-white hover:bg-zinc-100 text-black font-semibold px-6 py-4 rounded-xl transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  service: "Netflix",
                  title: "Stranger Things",
                  type: "Series",
                  available: "Available Now",
                },
                {
                  id: 2,
                  service: "Prime Video",
                  title: "The Boys",
                  type: "Series",
                  available: "Available Now",
                },
                {
                  id: 3,
                  service: "Disney+",
                  title: "The Mandalorian",
                  type: "Series",
                  available: "Available Now",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Service</p>
                      <h3 className="text-xl font-normal text-white mb-6">
                        {item.service}
                      </h3>
                      <p className="text-xs text-zinc-500 mb-2">Title</p>
                      <p className="text-base text-white">{item.title}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Type</p>
                      <p className="text-base text-white mb-6">{item.type}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Status</p>
                      <p className="text-base text-green-400">
                        {item.available}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "settings":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-normal text-white mb-6">
                Application Settings
              </h2>
            </div>

            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Account
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Notifications
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base text-white">
                        Email Notifications
                      </p>
                      <p className="text-sm text-zinc-500">
                        Receive updates via email
                      </p>
                    </div>
                    <button className="w-12 h-6 bg-zinc-700 rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base text-white">Push Notifications</p>
                      <p className="text-sm text-zinc-500">
                        Receive push notifications
                      </p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Preferences
                </h3>

                <div className="space-y-4">

                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Theme
                    </label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="bg-white hover:bg-zinc-100 text-black font-semibold px-8 py-3 rounded-xl transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex flex-1 max-w-6xl mx-auto w-full pt-8">
        {/* Sidebar */}
        <aside className="w-64 bg-black border-r border-zinc-900 pt-8 px-6 shrink-0">
          <nav className="space-y-2">
            <div className="mb-6">
              <h3 className="text-sm font-normal text-zinc-500 px-3">Movies</h3>
            </div>

            {[
              { label: "Cinemas", value: "cinemas" },
              { label: "Streaming", value: "streaming" },
              { label: "Settings", value: "settings" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveSection(item.value)}
                className={`
                    w-full text-left block px-4 py-3 rounded-xl text-base transition-colors cursor-pointer
                    ${
                      activeSection === item.value
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 pt-8 pb-16 px-8">{renderContent()}</div>
      </div>

      <Footer />
    </div>
  );
}
