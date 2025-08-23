import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

import './styles/App.css';
import './styles/variables.css';
import { Notification } from './components/Notification';
import { ThemeProvider } from './components/Theme';

function App() {

    return (
        <BrowserRouter>
            <ThemeProvider>
                <Notification>
                    <Routes>

                        <Route path="/login" element={<Login />} />

                        <Route path="/home" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/login" replace />} />

                    </Routes>
                </Notification>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
