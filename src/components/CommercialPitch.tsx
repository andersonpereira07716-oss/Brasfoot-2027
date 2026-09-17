import React, { useState } from 'react';

export const CommercialPitch: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', offerAmount: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto text-center py-16">
        <span className="bg-emerald-500/10 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
          Ativo Tecnológico Premium Disponível
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Top Club Director
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mt-4 max-w-2xl mx-auto">
          O simulador de gestão de clubes de futebol mobile mais completo, modular e pronto para escala comercial do mercado.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div className="text-emerald-400 text-2xl mb-3">⚡</div>
          <h3 className="font-bold text-lg">Stack Moderna</h3>
          <p className="text-slate-400 text-sm mt-2">Desenvolvido com React 18, TypeScript, Tailwind CSS e Capacitor para alta performance Android/iOS.</p>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div className="text-emerald-400 text-2xl mb-3">🛡️</div>
          <h3 className="font-bold text-lg">Arquitetura Segura</h3>
          <p className="text-slate-400 text-sm mt-2">Proteção total contra fraudes com políticas Row Level Security (RLS) e webhooks validados.</p>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div className="text-emerald-400 text-2xl mb-3">⚽</div>
          <h3 className="font-bold text-lg">Gameplay Profissional</h3>
          <p className="text-slate-400 text-sm mt-2">Engine tática avançada, gestão de categorias de base Sub-20 e mercado financeiro dinâmico.</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mt-16">
        <h2 className="text-2xl font-bold text-center mb-2">Enviar Proposta de Aquisição</h2>
        <p className="text-slate-400 text-center text-sm mb-8">Adquira o código-fonte completo com direitos de revenda e distribuição exclusiva.</p>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center">
            Proposta enviada com sucesso! Entraremos em contato em breve para os trâmites de transferência.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Seu Nome / Empresa</label>
              <input 
                type="text" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Ex: João Silva (Gaming Studio)"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">E-mail de Contato</label>
              <input 
                type="email" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="seuemail@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Valor da Proposta (USD/BRL)</label>
              <input 
                type="text" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Ex: R$ 5.000 ou $1,000 USD"
                value={formData.offerAmount}
                onChange={e => setFormData({...formData, offerAmount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Mensagem ou Condições</label>
              <textarea 
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Detalhes adicionais sobre a proposta..."
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              Enviar Proposta Formal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
