import { Header } from "@/components/header";
import { LoginForm } from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-3xl font-bold text-zinc-50 text-center">Login to CineMesh</h1>
          <LoginForm />
        </div>
      </main>

      <footer className="mt-24 border-t border-zinc-800 bg-zinc-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h4 className="mb-1 text-lg font-bold text-zinc-50">CineMesh</h4>
              <p className="text-sm text-zinc-500">
                A Modern Film Discovery Experience
              </p>
            </div>
            <p className="text-sm text-zinc-600">
              © 2025 CineMesh. Mock data for demonstration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}