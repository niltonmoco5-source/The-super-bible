
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { startBibleChat, sendMessageWithAudio } from '../services/geminiService';
import { Send, User, Sparkles, Loader2, Mic, Square, Share2, Check } from 'lucide-react';

interface ChatInterfaceProps {
  initialMessage?: string;
  onClearInitial?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage, onClearInitial }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Olá! Sou seu companheiro bíblico. Como você está se sentindo hoje? Podemos conversar por texto ou você pode clicar no microfone para falar comigo.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
      if (onClearInitial) onClearInitial();
    }
  }, [initialMessage]);

  const handleShareMessage = async (text: string, idx: number) => {
    const textToShare = `${text}\n\nCompartilhado via Bíblia Viva ✨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mensagem de Edificação',
          text: textToShare,
        });
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await handleSendAudio(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudio = async (audioBase64: string) => {
    setIsLoading(true);
    const userMessage: Message = {
      role: 'user',
      text: '🎤 Mensagem de voz enviada',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const responseText = await sendMessageWithAudio(audioBase64, messages);
      const botMessage: Message = {
        role: 'model',
        text: responseText || 'Ouvi seu áudio, mas não consegui processar uma resposta.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Audio Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Sinto muito, tive um problema ao ouvir sua voz. Pode tentar falar novamente ou digitar?',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = startBibleChat(messages);
      const result = await chat.sendMessage({ message: textToSend });
      
      const botMessage: Message = {
        role: 'model',
        text: result.text || 'Desculpe, tive um problema ao processar sua mensagem.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Sinto muito, houve um erro de conexão. Por favor, tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 transition-colors">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Conselheiro Bíblico</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{isRecording ? 'Ouvindo...' : 'Online agora'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/20"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`relative px-4 py-3 rounded-2xl shadow-sm group ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap pr-4">{msg.text}</p>
                
                <button 
                  onClick={() => handleShareMessage(msg.text, idx)}
                  className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                    msg.role === 'user' ? 'text-indigo-200 hover:text-white hover:bg-white/10' : 'text-slate-300 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title="Compartilhar esta mensagem"
                >
                  {copiedIdx === idx ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                </button>

                <p className={`text-[10px] mt-1.5 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-slate-400 dark:text-slate-500">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <span className="text-xs italic">Buscando sabedoria nas escrituras...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl items-center">
            <input
              type="text"
              value={isRecording ? "Gravando áudio..." : input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Diga como foi seu dia ou peça orientação..."
              disabled={isRecording}
              className={`flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-200 ${isRecording ? 'italic text-red-500' : ''}`}
            />
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title={isRecording ? "Parar gravação" : "Falar mensagem"}
            >
              {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
            </button>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || isRecording}
            className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
          {isRecording ? "Solte ou clique no quadrado para enviar" : "Lembre-se: A Bíblia sempre tem uma palavra de vida para você."}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
