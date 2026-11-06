"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"

type Notice = { message: string; kind: "success" | "error" }
type NotificationContextValue = { notify: (message: string, kind?: Notice["kind"]) => void }
const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notify = useCallback((message: string, kind: Notice["kind"] = "success") => {
    if (timer.current) clearTimeout(timer.current)
    setNotice({ message, kind })
    timer.current = setTimeout(() => setNotice(null), 5000)
  }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notice && <div role={notice.kind === "error" ? "alert" : "status"} aria-live="polite"
        className={`fixed right-5 top-5 z-50 max-w-sm rounded border px-5 py-3 shadow-lg ${notice.kind === "error" ? "border-red-400 bg-red-50 text-red-900" : "border-green-400 bg-green-50 text-green-900"}`}>
        <span>{notice.message}</span>
        <button type="button" onClick={() => { if (timer.current) clearTimeout(timer.current); setNotice(null) }}
          className="ml-4 font-bold" aria-label="Dismiss notification">×</button>
      </div>}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error("useNotification must be used within NotificationProvider")
  return context
}
