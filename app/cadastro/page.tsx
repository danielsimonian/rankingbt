'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    categoriaAtual: '',
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria o envio real dos dados
    // Por enquanto, apenas simulamos o sucesso
    console.log('Dados do formulário:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cadastro realizado com sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Obrigado por se cadastrar no Ranking BT. Em breve entraremos em contato para 
              confirmar seus dados e ativar sua participação no ranking.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Você receberá um e-mail de confirmação em <strong>{formData.email}</strong>
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Voltar para home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cadastre-se no Ranking
          </h1>
          <p className="text-lg text-gray-600">
            Preencha o formulário abaixo para fazer parte do ranking oficial de Beach Tennis da Baixada Santista
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="seu@email.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="(13) 99999-9999"
              />
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <select
                id="cidade"
                name="cidade"
                required
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Selecione sua cidade</option>
                <option value="Santos">Santos</option>
                <option value="São Vicente">São Vicente</option>
                <option value="Guarujá">Guarujá</option>
                <option value="Praia Grande">Praia Grande</option>
                <option value="Mongaguá">Mongaguá</option>
                <option value="Itanhaém">Itanhaém</option>
                <option value="Peruíbe">Peruíbe</option>
                <option value="Cubatão">Cubatão</option>
                <option value="Bertioga">Bertioga</option>
                <option value="São Paulo">São Paulo (Capital)</option>
                <option value="Outra">Outra</option>
              </select>
            </div>

            {/* Categoria Atual */}
            <div>
              <label htmlFor="categoriaAtual" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria que você acredita jogar
              </label>
              <select
                id="categoriaAtual"
                name="categoriaAtual"
                value={formData.categoriaAtual}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Selecione uma categoria</option>
                <option value="FUN">FUN - Recreativo</option>
                <option value="D">D - Iniciante</option>
                <option value="C">C - Intermediário</option>
                <option value="B">B - Avançado</option>
                <option value="A">A - Elite</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Não se preocupe, sua categoria oficial será determinada após participar de torneios homologados
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Importante:</strong> Após o cadastro, você poderá participar de qualquer torneio homologado. 
                Sua categoria oficial será estabelecida automaticamente após disputar 3 torneios.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
            >
              Cadastrar
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
          <p className="mt-2">
            Dúvidas? Entre em contato: <a href="mailto:contato@rankingbt.com.br" className="text-primary-600 hover:text-primary-700 font-medium">contato@rankingbt.com.br</a>
          </p>
        </div>
      </div>
    </div>
  );
}
