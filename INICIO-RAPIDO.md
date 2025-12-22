# 🚀 GUIA RÁPIDO - Ranking BT

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Node.js
- Baixe em: https://nodejs.org
- Instale a versão LTS (recomendada)

### 2. Instalar dependências
```bash
cd rankingbt
npm install
```

### 3. Rodar localmente
```bash
npm run dev
```

Abra: http://localhost:3000

## 🌐 Deploy no Vercel (GRÁTIS)

### Passo 1: Criar conta GitHub
- Acesse: https://github.com
- Crie uma conta gratuita

### Passo 2: Criar repositório
1. Clique em "New repository"
2. Nome: `rankingbt`
3. Público ou Privado (sua escolha)
4. Clique em "Create repository"

### Passo 3: Fazer upload do código
No terminal, dentro da pasta rankingbt:

```bash
git init
git add .
git commit -m "Primeiro commit - Ranking BT"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/rankingbt.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu usuário do GitHub!

### Passo 4: Deploy no Vercel
1. Acesse: https://vercel.com
2. Clique em "Sign Up" e entre com GitHub
3. Clique em "New Project"
4. Importe o repositório `rankingbt`
5. Clique em "Deploy"
6. Pronto! Seu site está no ar! 🎉

### Passo 5: Configurar domínio (rankingbt.com.br)
1. No Vercel, vá em Settings > Domains
2. Adicione: `rankingbt.com.br`
3. Configure o DNS do seu domínio:

**No painel do Registro.br ou onde comprou o domínio:**

Tipo A:
- Host: @
- Valor: 76.76.21.21

Tipo CNAME:
- Host: www
- Valor: cname.vercel-dns.com

Aguarde até 24h para propagar (geralmente é rápido, ~1h)

## 📝 Como Atualizar os Dados

### Adicionar/Atualizar Jogadores

Edite: `data/rankings.ts`

```typescript
export const jogadores: Jogador[] = [
  { 
    id: '1', 
    nome: 'Carlos Silva', 
    categoria: 'A', 
    pontos: 1250, 
    torneiosDispputados: 12 
  },
  // Adicione novos jogadores aqui
];
```

### Adicionar Torneios

No mesmo arquivo `data/rankings.ts`:

```typescript
export const torneios: Torneio[] = [
  {
    id: '1',
    nome: 'Open Santos 2025',
    data: '2025-01-15',
    local: 'Arena Beach Santos',
    status: 'confirmado',
    cidade: 'Santos'
  },
];
```

### Publicar mudanças

```bash
git add .
git commit -m "Atualização do ranking"
git push
```

Aguarde 30 segundos e as mudanças estarão no ar!

## 🎨 Personalização

### Cores
Edite: `tailwind.config.ts`

### Textos
Cada página está em: `app/[nome-da-pagina]/page.tsx`

### Logo
Substitua o ícone Trophy por sua logo em: `components/Header.tsx`

## 📞 Precisa de Ajuda?

Problemas com:
- **Instalação**: Verifique se instalou o Node.js
- **Deploy**: Confira se fez commit de todos os arquivos
- **Domínio**: Aguarde até 24h após configurar DNS

## ✅ Checklist

- [ ] Instalei Node.js
- [ ] Rodei `npm install`
- [ ] Testei localmente com `npm run dev`
- [ ] Criei repositório no GitHub
- [ ] Fiz deploy no Vercel
- [ ] Configurei meu domínio
- [ ] Atualizei os dados de exemplo

## 🎯 Próximos Passos

Após ter o site no ar:

1. **Customize os dados** - Adicione seus jogadores reais
2. **Adicione seus torneios** - Atualize o calendário
3. **Divulgue** - Compartilhe o link com os jogadores
4. **Colete feedback** - Veja o que precisa melhorar
5. **Evolua** - Implemente novas funcionalidades

Sucesso! 🚀🎾
