"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from "lucide-react"
import type { NavEntry } from "@/lib/contentful"

interface HeaderClientProps {
  navEntries: NavEntry[]
  ctaText: string
  ctaUrl: string
}

export function HeaderClient({ navEntries, ctaText, ctaUrl }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter nav items by placement (header only) and visibility
  const mainNav = navEntries.filter(
    (entry) => entry.placement !== false && entry.visible !== false,
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-color-horizontal.png"
            alt="Full Set Productions"
            width={180}
            height={52}
            className="h-11 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((entry) =>
            entry.children.length > 0 ? (
              <DropdownMenu key={entry.href}>
                <div className="flex items-center">
                  <Link
                    href={entry.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/10"
                  >
                    {entry.label}
                  </Link>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent align="start">
                  {entry.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      {child.openInNewTab ? (
                        <a
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link href={child.href}>{child.label}</Link>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={entry.href}
                variant="ghost"
                asChild
                className="text-foreground"
              >
                <Link href={entry.href}>{entry.label}</Link>
              </Button>
            ),
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={ctaUrl}>{ctaText}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] px-6 sm:w-80">
            <nav className="mt-8 flex flex-col gap-4">
              {mainNav.map((entry) =>
                entry.children.length > 0 ? (
                  <div key={entry.href} className="space-y-1">
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        window.location.href = entry.href
                      }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {entry.label}
                    </button>
                    {entry.children.map((child) =>
                      child.openInNewTab ? (
                        <a
                          key={child.href}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-foreground hover:text-accent"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-foreground hover:text-accent"
                        >
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                ) : (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-foreground hover:text-accent"
                  >
                    {entry.label}
                  </Link>
                ),
              )}
              <Button
                asChild
                className="mt-4 bg-primary text-primary-foreground"
              >
                <Link href={ctaUrl} onClick={() => setMobileOpen(false)}>
                  {ctaText}
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
