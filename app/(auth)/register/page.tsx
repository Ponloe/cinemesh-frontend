import { Header } from "@/components/header";
import { RegisterForm } from "@/components/auth/register-form";
import { Footer } from "@/components/footer";

export default function Register() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-xl">
            <h1 className="mb-6 text-3xl font-bold text-zinc-50 text-center">Register for CineMesh</h1>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}