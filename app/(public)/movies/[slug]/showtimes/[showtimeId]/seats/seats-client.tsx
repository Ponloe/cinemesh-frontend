"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

const CORE_API =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/public", "") ||
  "http://localhost:8080";

interface SeatsClientProps {
  showtimeId: string;
  movieTitle: string;
}

const ROWS = "ABCDEFGH".split("");
const SEATS_PER_ROW = 12;

function buildSeatLabels() {
  const labels: string[] = [];
  for (const row of ROWS) {
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      labels.push(`${row}${i}`);
    }
  }
  return labels;
}

export default function SeatsClient({ showtimeId, movieTitle }: SeatsClientProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const getToken = () => localStorage.getItem("token") || "";

  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allSeats = useMemo(() => buildSeatLabels(), []);

  const fetchReservedSeats = async () => {
    try {
      const res = await fetch(
        `${CORE_API}/api/public/showtimes/${showtimeId}/reserved-seats`,
        {
          cache: "no-store",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
          },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setReservedSeats((data.data as string[]) ?? []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchReservedSeats();
  }, [showtimeId, isAuthenticated]);

  const toggleSeat = (label: string) => {
    if (reservedSeats.includes(label)) return;
    setSelectedSeats((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  const handleConfirm = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    if (!selectedSeats.length) {
      setError("Please select at least one seat.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      for (const seat of selectedSeats) {
        const res = await fetch(`${CORE_API}/api/public/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({
            showtime_id: Number(showtimeId),
            seat_label: seat,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (res.status === 409) {
            setError(`Seat ${seat} was just taken. Please pick another.`);
          } else {
            setError(body.error || "Failed to create reservation.");
          }
          return;
        }
      }

      setSuccess("Your seats have been reserved!");
      setSelectedSeats([]);
      await fetchReservedSeats();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center space-y-3">
        <p className="text-zinc-300">
          You need to be logged in to reserve seats for {movieTitle}.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
        <p className="text-zinc-400 text-sm mb-2">Screen</p>
        <div className="h-1 bg-gradient-to-r from-transparent via-zinc-400 to-transparent rounded-full mb-4" />

        <div className="grid gap-2 justify-center">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-2 justify-center">
              <span className="w-6 text-right text-xs text-zinc-500">{row}</span>
              {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                const label = `${row}${i + 1}`;
                const isReserved = reservedSeats.includes(label);
                const isSelected = selectedSeats.includes(label);

                return (
                  <button
                    key={label}
                    onClick={() => toggleSeat(label)}
                    disabled={isReserved}
                    className={[
                      "w-8 h-8 rounded-sm text-[10px] flex items-center justify-center border",
                      isReserved
                        ? "bg-zinc-700 border-zinc-700 text-zinc-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-red-600 border-red-500 text-white"
                        : "bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800",
                    ].join(" ")}
                    aria-label={`Seat ${label}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-zinc-900 border border-zinc-700" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-red-600 border border-red-500" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-zinc-700 border border-zinc-700" />
            <span>Reserved</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">
            Selected seats:{" "}
            {selectedSeats.length ? (
              <span className="text-white font-medium">
                {selectedSeats.join(", ")}
              </span>
            ) : (
              <span className="text-zinc-500">none</span>
            )}
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !selectedSeats.length}
          className={`inline-flex items-center px-5 py-2 rounded-md text-sm font-medium ${
            isSubmitting || !selectedSeats.length
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-500"
          }`}
        >
          {isSubmitting ? "Reserving..." : "Confirm Seats"}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-md px-3 py-2">
          {success}
        </div>
      )}
    </div>
  );
}