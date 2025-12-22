# Ranking BT - Baixada Santista

Sistema de ranking oficial de Beach Tennis para a região da Baixada Santista e São Paulo.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vercel** - Deploy e hospedagem

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no GitHub (para deploy)
- Conta no Vercel (grátis)

## 🛠️ Instalação Local

1. **Clone ou baixe o projeto**

```bash
cd rankingbt
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Execute o projeto localmente**

```bash
npm run dev
# ou
yarn dev
```

4. **Abra no navegador**

Acesse: `http://localhost:3000`

## 📦 Estrutura do Projeto

```
rankingbt/
├── app/                    # Páginas do Next.js (App Router)
│   ├── page.tsx           # Home
│   ├── rankings/          # Página de categorias
│   ├── ranking/[categoria]/ # Rankings individuais
│   ├── como-funciona/     # Explicação do sistema
│   ├── torneios/          # Calendário de torneios
│   └── cadastro/          # Formulário de cadastro
├── components/            # Componentes reutilizáveis
│   ├── Header.tsx        # Navegação
│   ├── Footer.tsx        # Rodapé
│   ├── RankingTable.tsx  # Tabela de ranking
│   └── PlayerSearch.tsx  # Busca de jogadores
├── data/                 # Dados (temporário)
│   └── rankings.ts       # Dados dos jogadores e torneios
└── public/               # Arquivos estáticos
```

## 🎨 Personalizando os Dados

### Atualizar Jogadores e Pontuações

Edite o arquivo `data/rankings.ts`:

```typescript
export const jogadores: Jogador[] = [
  { 
    id: '1', 
    nome: 'Seu Nome', 
    categoria: 'A', 
    pontos: 1250, 
    torneiosDispputados: 12 
  },
  // Adicione mais jogadores aqui
];
```

### Atualizar Torneios

No mesmo arquivo `data/rankings.ts`:

```typescript
export const torneios: Torneio[] = [
  {
    id: '1',
    nome: 'Nome do Torneio',
    data: '2025-01-15',
    local: 'Local do Evento',
    status: 'confirmado', // ou 'realizado' ou 'em_andamento'
    cidade: 'Santos'
  },
  // Adicione mais torneios
];
```

## 🚀 Deploy no Vercel

### 1. Criar repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/rankingbt.git
git push -u origin main
```

### 2. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório `rankingbt`
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - Deixe as outras configurações padrão
6. Clique em "Deploy"

### 3. Configurar domínio customizado

1. No dashboard do Vercel, vá em Settings > Domains
2. Adicione `rankingbt.com.br`
3. Configure os DNS conforme instruções do Vercel:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   - 
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

## 🔄 Atualizando o Site

Sempre que você fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

O Vercel fará o deploy automático em ~30 segundos!

## 📊 Próximos Passos (Evolução)

### Fase 1 - Atual ✅
- [x] Site estático com dados em JSON
- [x] Rankings por categoria
- [x] Busca de jogadores
- [x] Calendário de torneios

### Fase 2 - Curto Prazo (1-3 meses)
- [ ] Adicionar banco de dados (Supabase ou Vercel Postgres)
- [ ] Sistema de login para jogadores
- [ ] Painel administrativo para atualizar rankings
- [ ] Formulário de cadastro funcional com envio de email
- [ ] Histórico detalhado por jogador

### Fase 3 - Médio Prazo (3-6 meses)
- [ ] Sistema de inscrição em torneios
- [ ] Geração automática de chaves
- [ ] Atualização de pontuação em tempo real
- [ ] Estatísticas avançadas
- [ ] Exportação de certificados

### Fase 4 - Longo Prazo (6-12 meses)
- [ ] App mobile (React Native)
- [ ] Sistema de pagamento integrado
- [ ] Dashboard para organizadores
- [ ] Expansão para outras regiões

## 🎯 Funcionalidades Atuais

- ✅ Homepage com destaques
- ✅ Rankings por categoria (A, B, C, D, FUN)
- ✅ Busca de jogadores
- ✅ Sistema de pontuação explicado
- ✅ Calendário de torneios
- ✅ Formulário de cadastro
- ✅ Design responsivo (mobile-friendly)
- ✅ Performance otimizada

## 💡 Dicas

### Como atualizar o ranking após um torneio:

1. Abra `data/rankings.ts`
2. Atualize os pontos dos jogadores
3. Adicione novos jogadores se necessário
4. Salve o arquivo
5. Faça commit e push
6. Deploy automático!

### Como adicionar uma nova categoria:

1. Edite `data/rankings.ts` e adicione a categoria no tipo `Categoria`
2. Atualize as páginas que listam categorias
3. Crie a rota em `app/ranking/[categoria]/page.tsx`

## 📧 Suporte

Para dúvidas sobre o código ou deploy:
- Email: contato@rankingbt.com.br

## 📄 Licença

Este projeto foi desenvolvido especificamente para o Ranking BT - Baixada Santista.

---

**Desenvolvido com ❤️ para a comunidade de Beach Tennis da Baixada Santista**
