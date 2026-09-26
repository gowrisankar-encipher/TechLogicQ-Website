import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">404</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Page not found</h1>
          <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <ButtonLink href="/" className="mt-8" size="lg">
            Back to Home
          </ButtonLink>
        </section>
      </main>
      <Footer />
    </>
  );
}
