"use client";

import { useState } from "react";
import Link from "next/link";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle register logic here (e.g., API call)
    console.log("Register:", { name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Enter your name"
        />
      </div>
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
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder="Confirm your password"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-zinc-50 text-zinc-950 py-2 px-4 rounded-md font-semibold hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
        Register
      </button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-300 hover:text-zinc-50">
          Login here
        </Link>
      </p>
    </form>
  );
}