"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const defaultProjectTypes = [
  "Escape Room",
  "Immersive Attraction",
  "Theatre & Fringe",
  "Props & Scenic",
  "Other",
]

const defaultBudgetRanges = [
  "Under £10,000",
  "£10,000 - £25,000",
  "£25,000 - £50,000",
  "£50,000 - £100,000",
  "Over £100,000",
  "Not sure yet",
]

interface FormField {
  id?: string
  name?: string
  fieldName?: string
  fieldId?: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: string[]
  rows?: number
  colSpan?: number
}

interface ContactFormProps {
  formspreeId?: string
  submitLabel?: string
  successMessage?: string
  footerNote?: string
  fields?: FormField[]
}

export function ContactForm({
  formspreeId = "mbdaqknq",
  submitLabel = "Send message",
  successMessage = "Thanks for getting in touch. We'll respond within 2 working days.",
  footerNote = "We'll respond within 2 working days. Your information is kept confidential.",
  fields,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  // Track Select values separately since Radix Select doesn't write to native FormData
  const [selectValues, setSelectValues] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    const form = e.currentTarget
    const formData = new FormData(form)

    // Honeypot check
    if (formData.get("website")) {
      setStatus("error")
      setErrorMessage("Spam detected.")
      return
    }

    // Manually append Select values since Radix doesn't write to native FormData
    for (const [key, value] of Object.entries(selectValues)) {
      if (value) formData.set(key, value)
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setStatus("success")
        form.reset()
        setSelectValues({})
      } else {
        const data = await response.json()
        throw new Error(data.error || "Form submission failed")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  // If CMS fields provided, render dynamically; otherwise use static defaults
  const renderFields = () => {
    if (fields && fields.length > 0) {
      // Group fields into rows based on colSpan hints
      const rows: FormField[][] = []
      let currentRow: FormField[] = []
      for (const field of fields) {
        currentRow.push(field)
        // Start new row after every 2 half-width fields, or immediately after a full-width field
        const isFullWidth = field.colSpan === 2 || field.type === "textarea" || field.type === "select-solo"
        if (isFullWidth || currentRow.length === 2) {
          rows.push(currentRow)
          currentRow = []
        }
      }
      if (currentRow.length > 0) rows.push(currentRow)

      return rows.map((row, i) => (
        <div key={i} className={row.length > 1 ? "grid gap-6 sm:grid-cols-2" : ""}>
          {row.map((field) => {
            // Resolve field identifier from whichever key the CMS uses
            const fieldId = field.id ?? field.name ?? field.fieldId ?? field.fieldName ?? ""
            const opts = field.options ?? (fieldId === "projectType" ? defaultProjectTypes : fieldId === "budget" || fieldId === "budgetRange" ? defaultBudgetRanges : [])
            return (
              <div key={fieldId} className="space-y-2">
                <Label htmlFor={fieldId}>
                  {field.label}{field.required ? " *" : ""}
                </Label>
                {field.type === "select" || field.type === "select-solo" ? (
                  <Select
                    name={fieldId}
                    required={field.required}
                    onValueChange={(val) => setSelectValues((prev) => ({ ...prev, [fieldId]: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {opts.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={fieldId}
                    name={fieldId}
                    required={field.required}
                    rows={field.rows ?? 6}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    id={fieldId}
                    name={fieldId}
                    type={field.type ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))
    }

    // Static fallback
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required placeholder="your@email.com" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company / Organisation</Label>
            <Input id="company" name="company" placeholder="Your company name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Project Location</Label>
            <Input id="location" name="location" placeholder="City or region" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type *</Label>
            <Select name="projectType" required onValueChange={(val) => setSelectValues((prev) => ({ ...prev, projectType: val }))}>
              <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
              <SelectContent>
                {defaultProjectTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input id="timeline" name="timeline" placeholder="e.g., Q3 2026, ASAP" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range</Label>
          <Select name="budget" onValueChange={(val) => setSelectValues((prev) => ({ ...prev, budget: val }))}>
            <SelectTrigger><SelectValue placeholder="Select budget range (optional)" /></SelectTrigger>
            <SelectContent>
              {defaultBudgetRanges.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Tell us about your project *</Label>
          <Textarea id="message" name="message" required rows={6} placeholder="Describe your project, requirements, and any specific challenges..." />
        </div>
      </>
    )
  }

  if (status === "success") {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          <h3 className="mt-4 text-xl font-semibold text-green-900 dark:text-green-100">
            Message sent!
          </h3>
          <p className="mt-2 text-green-700 dark:text-green-300">
            {successMessage}
          </p>
          <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] top-[-9999px]" />

          {renderFields()}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
            ) : submitLabel}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {footerNote}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
