
import React, { useState } from 'react';
import { UserTier } from '../types';
import { OWNER_PAYMENT_CONFIG } from '../constants';
import { 
  Check, 
  Crown, 
  Star, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  CreditCard, 
  Lock, 
  Globe, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface PricingBoardProps {
  onUpgrade: (tier: UserTier) => void;
  currentTier: UserTier;
}

const PricingBoard: React.FC<PricingBoardProps> = ({ onUpgrade, currentTier }) => {
  const [selectedPlan, setSelectedPlan] = useState<UserTier | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePaymentRedirect = (tier: UserTier) => {
    setIsRedirecting(true);
    
    // Simula a preparação do checkout seguro
    setTimeout(() => {
      const checkoutUrl = tier === 'pro' 
        ? OWNER_PAYMENT_CONFIG.stripe_pro_link 
        : OWNER_PAYMENT_CONFIG.stripe_blessed_link;
      
      // Em uma aplicação real, redirecionamos para o checkout externo do Stripe/PayPal
      // Aqui, abriremos o link e simularemos o upgrade para manter a funcionalidade do app
      window.open(checkoutUrl, '_blank');
      
      // Após o "pagamento", ativamos no app
      onUpgrade(tier);
      setIsRedirecting(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const plans = [
    {
      id: 'pro' as UserTier,
      name: 'Plano Pro Global',
      price: '€4,99',
      period: '/mês',
      icon: <Crown className="text-amber-500" />,
      color: 'bg-white',
      borderColor: 'border-slate-100',
      btnColor: 'bg-indigo-600',
      features: [
        'Chat Ilimitado com IA',
        'Sincronização em Nuvem',
        'Busca Bíblica Avançada',
        'Lembretes Personalizados',
        'Acesso ao Mural de Fé'
      ]
    },
    {
      id: 'blessed' as UserTier,
      name: 'Plano Abençoado Internacional',
      price: '€49,90',
      period: '/ano',
      bestValue: true,
      icon: <Star className="text-white" />,
      color: 'bg-gradient-to-br from-indigo-600 to-purple-700',
      textColor: 'text-white',
      borderColor: 'border-indigo-400',
      btnColor: 'bg-white text-indigo-700',
      features: [
        'Tudo do Plano Pro',
        '2 Meses Gratuitos',
        'Selo Especial de Apoiador',
        'Suporte Prioritário Global',
        'Ajude a manter o App acessível em todo o mundo'
      ]
    }
  ];

  if (isRedirecting) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-md border border-slate-100">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
            <Loader2 size={48} className="animate-spin" />
            <Globe size={20} className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1 border-4 border-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Conectando ao Gateway Seguro</h2>
          <p className="text-slate-500 mb-8">Estamos preparando seu ambiente de pagamento internacional. Você será levado para uma página protegida.</p>
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-center gap-4 opacity-40">
                <div className="w-10 h-6 bg-slate-200 rounded"></div>
                <div className="w-10 h-6 bg-slate-200 rounded"></div>
                <div className="w-10 h-6 bg-slate-200 rounded"></div>
             </div>
             <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
               <Lock size={12} />
               Criptografia de Ponta a Ponta
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto max-w-6xl mx-auto w-full">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="inline-block p-3 bg-amber-100 rounded-2xl mb-4">
          <Globe className="text-amber-600" size={32} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4">Apoie nosso Ministério Global</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Aceitamos pagamentos de mais de 135 países via Cartão de Crédito, Débito e Carteiras Digitais. 100% do seu apoio é destinado diretamente ao criador.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative rounded-[2.5rem] p-8 border-2 transition-all hover:scale-[1.02] flex flex-col ${
              plan.bestValue ? 'shadow-2xl shadow-indigo-200' : 'shadow-lg shadow-slate-100'
            } ${plan.color} ${plan.borderColor} ${plan.textColor || 'text-slate-800'}`}
          >
            {plan.bestValue && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                Melhor Valor Internacional
              </div>
            )}

            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl ${plan.bestValue ? 'bg-white/20' : 'bg-slate-50'}`}>
                {plan.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{plan.price}</div>
                <div className={`text-xs opacity-70`}>{plan.period}</div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-6">{plan.name}</h3>

            <div className="space-y-4 flex-1 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 p-0.5 rounded-full ${plan.bestValue ? 'bg-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Check size={12} className={plan.bestValue ? 'text-white' : ''} />
                  </div>
                  <span className="text-sm font-medium opacity-90">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePaymentRedirect(plan.id)}
              disabled={currentTier === plan.id}
              className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                plan.btnColor
              } ${currentTier === plan.id ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
            >
              {currentTier === plan.id ? 'Plano Ativo' : (
                <>
                  <ExternalLink size={18} />
                  Checkout Seguro
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Transação Protegida</p>
                <p className="text-xs text-slate-500">Processado via Stripe/PayPal. Seus dados nunca tocam nosso servidor.</p>
              </div>
           </div>
           <div className="flex items-center gap-2 grayscale opacity-60">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <div className="text-[10px] font-bold text-slate-400">PAGAMENTO GLOBAL</div>
           </div>
        </div>
      </div>

      <div className="mt-8 text-center">
         <p className="text-slate-400 text-xs">
           Dúvidas sobre o pagamento? <button className="text-indigo-600 font-bold hover:underline">Fale com o suporte</button>
         </p>
      </div>
    </div>
  );
};

export default PricingBoard;
