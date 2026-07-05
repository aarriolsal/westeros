import React from 'react'
import { NavBar } from './NavBar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
