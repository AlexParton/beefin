import React, { Fragment, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Bottombar from './components/partials/Bottombar'
import FeedPage from './pages/FeedPage'
import useSettings from './hooks/use-settings'
import Suspensor from './components/UI/Suspensor'

const BeefCreator = React.lazy(() => import('./pages/BeefCreator'))
const AllAnswers = React.lazy(() => import('./components/post/AllAnswers'))
const BeefDetail = React.lazy(() => import('./components/post/BeefDetail'))
const InteractionsPage = React.lazy(() => import('./pages/InteractionsPage'))
const MyProfilePage = React.lazy(() => import('./pages/MyProfilePage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const SearchPage = React.lazy(() => import('./pages/SearchPage'))
const DesktopFallback = React.lazy(() => import('./pages/DesktopFallback'))

const App: React.FC = () => {
  const { darkModeActive } = useSettings(localStorage.getItem('uid') as string | null)
  const isMobile = window.matchMedia('(max-width: 660px)').matches

  if (!isMobile) {
    return (
      <Suspense fallback={<Suspensor />}>
        <DesktopFallback />
      </Suspense>
    )
  }

  return (
    <Fragment>
      <main data-theme={darkModeActive ? 'darkmode' : 'lightmode'}>
        <Suspense fallback={<Suspensor />}>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/user/:profileHash" element={<ProfilePage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />
            <Route path="/beef/:beefId" element={<BeefDetail />} />
            <Route path="/answers/:beefId" element={<AllAnswers />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="/beef-creator" element={<BeefCreator />} />
          </Routes>
        </Suspense>
      </main>
      <Bottombar />
    </Fragment>
  )
}

export default App


