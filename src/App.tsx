
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import MyBets from '@/pages/MyBets';
import ValueBets from '@/pages/ValueBets';
import LiveEvents from '@/pages/LiveEvents';
import AIInsights from '@/pages/AIInsights';
import Analytics from '@/pages/Analytics';
import Notifications from '@/pages/Notifications';
import Football from '@/pages/Football';
import Basketball from '@/pages/Basketball';
import Baseball from '@/pages/Baseball';
import Hockey from '@/pages/Hockey';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/my-bets" element={
                <ProtectedRoute>
                  <MyBets />
                </ProtectedRoute>
              } />
              <Route path="/value-bets" element={
                <ProtectedRoute>
                  <ValueBets />
                </ProtectedRoute>
              } />
              <Route path="/live-events" element={
                <ProtectedRoute>
                  <LiveEvents />
                </ProtectedRoute>
              } />
              <Route path="/ai-insights" element={
                <ProtectedRoute>
                  <AIInsights />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/football" element={
                <ProtectedRoute>
                  <Football />
                </ProtectedRoute>
              } />
              <Route path="/basketball" element={
                <ProtectedRoute>
                  <Basketball />
                </ProtectedRoute>
              } />
              <Route path="/baseball" element={
                <ProtectedRoute>
                  <Baseball />
                </ProtectedRoute>
              } />
              <Route path="/hockey" element={
                <ProtectedRoute>
                  <Hockey />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
