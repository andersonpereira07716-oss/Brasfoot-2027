import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>⚽ Brasfoot NextGen</h1>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Simulador de Gestão de Futebol</p>

      <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
        <h3>Novo Jogo</h3>
        <p style={{ fontSize: '12px', color: '#cbd5e1' }}>Escolha seu clube e inicie sua carreira profissional.</p>
      </div>

      <button 
        onClick={() => alert('Inicializando Liga...')}
        style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
        Iniciar Temporada
      </button>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
