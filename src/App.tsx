import { Navigate, Route, Routes } from 'react-router-dom'

import { MenuPage } from './pages/MenuPage'
import { OnboardingPage } from './pages/OnboardingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
