"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

function getPreferredTheme(): "light" | "dark" {
  try {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored
  } catch {}
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }
  return "light"
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => getPreferredTheme())

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    try {
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={theme === "dark"}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  )
}
