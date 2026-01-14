'use client';

import { useState, useRef } from 'react';
import { Mail, User, Building2, MapPin, Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function FormularioApoiador() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [instagram, setInstagram] = useState('');

  // Máscara de telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      } else if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      setTelefone(value);
    }
  };

  // Instagram sempre com @
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove @ se usuário digitar
    value = value.replace(/@/g, '');
    
    // Remove espaços
    value = value.replace(/\s/g, '');
    
    setInstagram(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      // EmailJS - substitua pelos seus IDs
      await emailjs.sendForm(
        'service_n50u8hn',      // ← Service ID
        'template_yxsdjse',     // ← Template ID
        formRef.current!,
        'tE9JeCtPd35ah3zjK'       // ← Public Key
      );

      setSuccess(true);
      formRef.current?.reset();
      setTelefone('');
      setInstagram('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-royal-100 px-5 py-2.5 rounded-full mb-4 border-2 border-primary-200/50">
          <Mail className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-bold text-primary-900">Formulário de Contato</span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          Quero Ser Apoiador!
        </h3>
        <p className="text-gray-600">
          Preencha o formulário e entraremos em contato em breve
        </p>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Campo oculto para enviar pro email certo */}
        <input type="hidden" name="to_email" value="rankingbtbydama@gmail.com" />
        <input type="hidden" name="reply_to" value="rankingbtbydama@gmail.com" />
        
        {/* Nome */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Nome Completo *
          </label>
          <input
            type="text"
            name="from_name"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Building2 className="w-4 h-4" />
            Tipo de Apoiador *
          </label>
          <select
            name="tipo"
            required
            defaultValue=""
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-900 bg-white"
          >
            <option value="" disabled>Selecione um tipo</option>
            <option value="Professor de Beach Tennis">Professor de Beach Tennis</option>
            <option value="Point / Arena">Point / Arena</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {/* Grid: Cidade + Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Cidade *
            </label>
            <input
              type="text"
              name="cidade"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              placeholder="Ex: Santos"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              required
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              placeholder="(13) 99999-9999"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="relative">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
            </svg>
            Instagram
          </label>
          <input
            type="text"
            name="instagram"
            value={instagram}
            onChange={handleInstagramChange}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="seuperfil"
          />
          {/* @ fixo */}
          <div className="absolute left-4 top-[42px] text-gray-900 font-bold pointer-events-none">
            @
          </div>
        </div>

        {/* Mensagem */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Mensagem (opcional)
          </label>
          <textarea
            name="message"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-400"
            placeholder="Conte um pouco mais sobre você e por que quer apoiar o ranking..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Enviar Solicitação
            </>
          )}
        </button>

        {/* Success Message - Abaixo do botão */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="text-center">
                <div className="font-bold text-green-900 mb-1">✅ Mensagem enviada com sucesso!</div>
                <div className="text-sm text-green-700">Entraremos em contato em breve. Obrigado!</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message - Abaixo do botão */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-center">
                <div className="font-bold text-red-900 mb-1">❌ Erro ao enviar</div>
                <div className="text-sm text-red-700">Tente novamente ou entre em contato pelo WhatsApp.</div>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          * Campos obrigatórios
        </p>
      </form>
    </div>
  );
}