"use client"

import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* 404 Hero Section                             */}
      {/* ============================================ */}
      <section className="bg-primary text-primary-foreground py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8">
              <p className="text-6xl lg:text-8xl font-bold tracking-tighter">404</p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              Sorry, the page you're looking for doesn't exist. It might have been moved or removed. Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground font-medium rounded-lg hover:bg-background/90 transition-colors"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-foreground text-primary-foreground font-medium rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Helpful Links Section                        */}
      {/* ============================================ */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-12 text-center">
            Explore Our Work
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Link
              href="/industry"
              className="group p-6 border border-border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Industries
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover the industries we work with, from escape rooms to theatrical installations.
              </p>
              <span className="text-sm font-medium text-foreground inline-flex items-center group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </Link>

            <Link
              href="/services"
              className="group p-6 border border-border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Services
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                From design and fabrication to installation and support services.
              </p>
              <span className="text-sm font-medium text-foreground inline-flex items-center group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </Link>

            <Link
              href="/projects"
              className="group p-6 border border-border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Projects
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                See our latest case studies and completed installations.
              </p>
              <span className="text-sm font-medium text-foreground inline-flex items-center group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
