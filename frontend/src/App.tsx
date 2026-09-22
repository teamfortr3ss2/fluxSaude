import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListaSolicitacoes } from './pages/ListaSolicitacoes';
import { NovaSolicitacao } from './pages/NovaSolicitacao';
import { DetalheSolicitacao } from './pages/DetalheSolicitacao';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<ListaSolicitacoes />} />
          <Route path="/solicitacoes/nova" element={<NovaSolicitacao />} />
          <Route path="/solicitacoes/:id" element={<DetalheSolicitacao />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;