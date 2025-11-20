# ⏳ Gerador de Foco - FocoWave: Seu Aliado de Produtividade com a Técnica Pomodoro

<div align="center">
  <a href="[FocoWave](https://focowaves.netlify.app/)" target="_blank">
    <img src="https://img.shields.io/badge/Acesse_o_Projeto_Online-000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy Link">
  </a>
</div>

---

## ✨ Visão Geral

O **FocoWave** é uma ferramenta web elegante e intuitiva, projetada para maximizar sua produtividade e concentração utilizando a renomada Técnica Pomodoro. Inspirado na simplicidade e eficácia, esta aplicação ajuda você a gerenciar seus tempos de trabalho e descanso de forma eficiente, promovendo sessões de foco ininterruptas e descansos merecidos.

Com uma interface limpa e personalizável, o Gerador de Foco oferece o ambiente ideal para quem busca otimizar a rotina de estudos ou trabalho, minimizando distrações e aumentando a atenção.

---

## 📸 Demonstração Visual

Confira como o **FocoWave** se adapta ao seu estilo, seja no modo claro ou escuro.

<div align="center">
  <table>
    <tr>
      <td align="center"><b>🌞 Tema Claro</b></td>
      <td align="center"><b>🌚 Tema Escuro</b></td>
    </tr>
    <tr>
      <td>
        <img src="assets/images/FocoWave_Claro.png" alt="FocoWave Tema Claro" width="400">
      </td>
      <td>
        <img src="assets/images/FocoWave_Escuro.png" alt="FocoWave Tema Escuro" width="400">
      </td>
    </tr>
  </table>
</div>

### 🎥 Em Ação
Veja o FocoWave funcionando (Timer e troca de temas):

![Gif do Projeto](assets/images/Animacao_FocoWave.gif)

---

## 🆕 O que há de novo na v1.1.0?

### ✨ Versão 1.1.0 - O Foco é Seu (Tema & Flexibilidade)
Esta atualização foca em entregar maior flexibilidade na definição do tempo e na experiência visual.

#### 🚀 Registro de Alterações (Changelog)

| Recurso | Descrição |
| :--- | :--- |
| **Tema Flexível (Claro/Escuro)** | Adicionado um botão de alternância (**sol/lua**) para trocar entre o Tema Escuro (padrão) e o novo Tema Claro. A preferência é salva no navegador. |
| **Foco Configurável (H/M)** | O tempo de **Foco** agora tem campos separados para **Horas** e **Minutos** (máximo de 10 horas). As pausas continuam em minutos. |
| **Persistência Completa** | Todas as configurações (tempos, tema, som e ciclo) são salvas no `localStorage`. |
| **Otimização de Layout** | Ajuste fino na escala e espaçamento dos inputs para garantir alinhamento perfeito em 100% de zoom. |
| **Ajuste Estético** | O botão de tema foi reposicionado para melhorar o equilíbrio visual. |

#### 💡 Guia Rápido (Novos Recursos)

1.  **Alternando Temas:** Use o botão (**Sol/Lua**) no canto superior direito.
2.  **Definindo Tempo de Foco (H/M):**
    * **Foco (h):** Insira as horas (ex: `1`).
    * **Foco (min):** Insira os minutos.
    * *> Nota: Pausas permanecem apenas em minutos.*

---

## 🚀 Principais Funcionalidades (Geral)

- **Timer Personalizável:** Defina a duração exata para suas sessões de `Foco`, `Pausa Curta` e `Pausa Longa`.
- **Contador de Ciclos:** Monitore seu progresso visualmente (ex: "Ciclo: 1 de 4").
- **Sons Ambientes:** Escolha entre Chuva, Café, Ruído Branco, Piano Suave, Natureza ou Nenhum.
- **Alertas Sonoros:** Notificações discretas ao fim de cada sessão.
- **Persistência:** Suas configurações são salvas automaticamente (Local Storage).
- **Design Responsivo:** Layout otimizado para diversos dispositivos sem barras de rolagem desnecessárias.

## 🛠️ Tecnologias Utilizadas

<div style="display: inline_block"><br>
  <img align="center" alt="HTML5" height="40" width="50" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg">
  <img align="center" alt="CSS3" height="40" width="50" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg">
  <img align="center" alt="Js" height="40" width="50" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg">
  <img align="center" alt="Git" height="40" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg">
</div>

## 📂 Estrutura do Projeto

```bash
FocoWave/
├── assets/          # Imagens (prints), ícones e sons
├── css/             # Estilos (style.css)
├── js/              # Lógica (script.js, timer.js)
├── index.html       # Estrutura principal
└── README.md        # Documentação
```

## 🗺️ Roadmap (Próximos Passos)

- [x] Adicionar tema Dark/Light (v1.1.0)
- [x] Persistência de dados local
- [ ] Transformar em PWA (para instalar no celular)
- [ ] Adicionar dashboard de estatísticas semanais
- [ ] Integração com Spotify API

## 💡 Como Usar

1.  **Defina seus Tempos:** Insira a duração desejada para Foco e Pausas.
2.  **Escolha seu Som:** Selecione o áudio de fundo ideal.
3.  **Comece a Focar:** Clique em "Iniciar Foco".
4.  **Reiniciar:** Use o botão "Reiniciar" para zerar o timer e ciclos.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---
**Desenvolvido com 💜 por [PatrickCaramico](https://github.com/PatrickCaramico)**
