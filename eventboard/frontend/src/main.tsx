import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Organizer/Login'
import Dashboard from './pages/Organizer/Dashboard'
import EventSetup from './pages/Organizer/EventSetup'
import Analytics from './pages/Organizer/Analytics'
import EventEntry from './pages/Attendee/EventEntry'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Organizer routes */}
        <Route path="/organizer/login" element={<Login />} />
        <Route path="/organizer/dashboard" element={<Dashboard />} />
        <Route path="/organizer/events/new" element={<EventSetup />} />
        <Route path="/organizer/events/:eventId" element={<EventSetup />} />
        <Route path="/organizer/events/:eventId/analytics" element={<Analytics />} />

        {/* Attendee routes */}
        <Route path="/e/:eventId/*" element={<EventEntry />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/organizer/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
