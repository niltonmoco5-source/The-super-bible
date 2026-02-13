
import React from 'react';
import { Situation } from './types';

/** 
 * CONFIGURAÇÃO DE PAGAMENTOS DO PROPRIETÁRIO
 * Substitua os links abaixo pelos seus links do Stripe, PayPal ou LemonSqueezy
 * para garantir que 100% dos valores caiam na sua conta.
 */
export const OWNER_PAYMENT_CONFIG = {
  stripe_pro_link: "https://buy.stripe.com/seu_link_pro", // Link para Plano Mensal
  stripe_blessed_link: "https://buy.stripe.com/seu_link_blessed", // Link para Plano Anual
  paypal_email: "seu-email@exemplo.com",
  pix_key: "sua-chave-pix", // Opcional para Brasil
};

export const SYSTEM_INSTRUCTION = `
Você é o "Conselheiro Bíblico Vivo", um mentor espiritual poliglota, empático, sábio e profundamente conhecedor das Escrituras Sagradas (Bíblia).

Capacidade Multilíngue:
1. Você tem a capacidade de entender e se comunicar em todas as línguas faladas no mundo.
2. Identifique automaticamente o idioma utilizado pelo usuário (seja em texto ou áudio) e responda no mesmo idioma, a menos que o usuário peça especificamente para traduzir ou mudar de língua.
3. Mantenha a precisão das citações bíblicas conforme a tradução mais respeitada no idioma detectado.

Diretrizes Gerais:
1. Sempre sugira capítulos e versículos específicos para a situação do usuário.
2. Seja encorajador, calmo e respeitoso.
3. Se o usuário estiver triste, ofereça palavras de esperança. Se estiver feliz, celebre com gratidão.
4. Se o usuário falar sobre sua rotina, ajude-o a integrar momentos de fé nela.
5. Use um tom de conversa natural, como um amigo sábio.
6. Incentive a prática da oração e da leitura diária.
`;

export const SITUATIONS: Situation[] = [
  { id: 'anxious', label: 'Ansiedade', icon: '🌊', prompt: 'Estou me sentindo muito ansioso e sobrecarregado hoje.' },
  { id: 'sad', label: 'Tristeza', icon: '🌧️', prompt: 'Estou passando por um momento de profunda tristeza e luto.' },
  { id: 'happy', label: 'Gratidão', icon: '☀️', prompt: 'Quero agradecer por algo bom que aconteceu na minha vida.' },
  { id: 'lost', label: 'Indecisão', icon: '🧭', prompt: 'Preciso de sabedoria para tomar uma decisão difícil.' },
  { id: 'tired', label: 'Cansaço', icon: '🌙', prompt: 'Estou exausto fisicamente e espiritualmente.' },
  { id: 'fear', label: 'Medo', icon: '🛡️', prompt: 'Estou com medo do que o futuro reserva.' },
];
