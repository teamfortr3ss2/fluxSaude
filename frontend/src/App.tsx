import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { RotaProtegida } from './components/RotaProtegida';
import { ListaSolicitacoes } from './pages/ListaSolicitacoes';
import { NovaSolicitacao } from './pages/NovaSolicitacao';
import { DetalheSolicitacao } from './pages/DetalheSolicitacao';
import { Login } from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RotaProtegida>
                  <ListaSolicitacoes />
                </RotaProtegida>
              }
            />
            <Route
              path="/solicitacoes/nova"
              element={
                <RotaProtegida>
                  <NovaSolicitacao />
                </RotaProtegida>
              }
            />
            <Route
              path="/solicitacoes/:id"
              element={
                <RotaProtegida>
                  <DetalheSolicitacao />
                </RotaProtegida>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;