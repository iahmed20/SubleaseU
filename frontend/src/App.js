import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home.js';
import PostListing from './PostListing.js';
import Messages from './Messages.js';
import Login from './Login.js';
import { AuthProvider, useAuth } from './AuthContext.js';

// Wraps any route that requires login.
// If not logged in → redirect to /login
// If Firebase is still loading → show nothing (avoids flash of redirect)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Public route - anyone can access */}
            <Route path='/login' element={<Login />} />

            {/* Protected routes - must be logged in */}
            <Route path='/' element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path='/post-listing' element={
              <ProtectedRoute><PostListing /></ProtectedRoute>
            } />
            <Route path='/messages' element={
              <ProtectedRoute><Messages /></ProtectedRoute>
            } />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;