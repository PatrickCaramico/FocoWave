# FocoWave V1.3

Aplicativo de foco estilo Pomodoro com:

- login Google (Firebase Auth)
- modo visitante com persistência local
- temas customizados
- streak diário
- dashboard com Chart.js
- favoritos de sons

## 1) Rodar localmente

Use um servidor local (não abra o HTML via `file://`).

Opções simples:

- VS Code Live Server
- `npx serve .`
- `python -m http.server 5500`

Depois abra no navegador pela URL local (ex.: `http://localhost:5500`).

## 2) Configurar Firebase (Google Login)

No arquivo `assets/js/script.js`, preencha o objeto `FIREBASE_CONFIG`.

No Firebase Console:

1. Authentication > Get started
2. Método de login > Google > Ativar
3. Defina e salve o e-mail de suporte
4. Authentication > Configurações > Domínios autorizados
   - adicione os domínios que você usa para rodar/publicar o app
   - exemplos: `localhost`, `127.0.0.1`, domínio do deploy

## 3) Publicar

Como é um projeto estático, você pode publicar em:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Checklist antes do deploy

- [ ] `FIREBASE_CONFIG` preenchido corretamente
- [ ] Google Provider ativado no Firebase
- [ ] Domínio final adicionado em Authorized domains
- [ ] Login testado no domínio final

## 4) Estrutura

- `index.html` — interface
- `assets/css/style.css` — estilos
- `assets/js/script.js` — lógica do app + autenticação
- `assets/sound/` — sons
- `assets/images/` — imagens/ícones

## 5) Observações

Se aparecer erro de domínio no login, confira o host exibido na mensagem e adicione exatamente esse host em:
`Firebase > Authentication > Configurações > Domínios autorizados`.
