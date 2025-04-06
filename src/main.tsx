import { createRoot } from 'react-dom/client'
import './index.css'
import RootStack from './router.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './context/sessionContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <SessionProvider>
    <BrowserRouter>
      <RootStack />
    </BrowserRouter>
    <Toaster />
  </SessionProvider>
);