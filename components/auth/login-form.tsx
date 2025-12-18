"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    console.log("Login:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-zinc-50 text-zinc-950 py-2 px-4 rounded-md font-semibold hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
        Login
      </button>
      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-zinc-300 hover:text-zinc-50">
          Register here
        </Link>
      </p>
    </form>
  );
}