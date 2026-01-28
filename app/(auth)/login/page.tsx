import { Header } from "@/components/header";
import { LoginForm } from "@/components/auth/login-form";
import { Footer } from "@/components/footer";

export default function Login() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-xl">
            <h1 className="mb-6 text-3xl font-bold text-zinc-50 text-center">Login to CineMesh</h1>
            <LoginForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}