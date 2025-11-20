## 📄 Documentação do Projeto FocoWave

### ✨ Versão 1.1.0 - O Foco é Seu (Tema & Flexibilidade)

Esta atualização do FocoWave foca em entregar maior flexibilidade e personalização na definição do tempo de foco e na experiência visual.

***

### 🚀 Registro de Alterações (Changelog)

| Recurso | Descrição |
| :--- | :--- |
| **Tema Flexível (Claro/Escuro)** | Adicionado um botão de alternância (**sol/lua**) para trocar entre o Tema Escuro (padrão) e um novo Tema Claro. A preferência de tema é salva automaticamente no navegador. |
| **Foco Configurável (H/M)** | O tempo de **Foco** agora pode ser definido com campos separados para **Horas** e **Minutos**, permitindo a configuração de longas sessões de trabalho (máximo de 10 horas). As pausas continuam em minutos. |
| **Persistência Completa** | Todas as configurações (tempos, tema, som e ciclo) são salvas no `localStorage`, garantindo que suas preferências sejam mantidas ao reabrir o FocoWave. |
| **Otimização de Layout** | **Ajuste Fino de Layout:** Otimizada a escala e o espaçamento horizontal dos inputs, garantindo que os três grupos de tempo (**Foco (h/min)**, **Pausa Curta** e **Pausa Longa**) fiquem perfeitamente alinhados na mesma linha, mesmo em visualização 100%. |
| **Ajuste Estético** | O botão de troca de tema foi reposicionado com um espaçamento de **3px** da borda direita, melhorando o equilíbrio visual. |

***

### 💡 Guia de Início Rápido (Novos Recursos)

#### 1. Alternando Temas

* **Localização:** Use o botão de alternância (**Sol/Lua**) localizado no canto superior direito do contêiner principal.
* **Uso:** Clique no botão para trocar o esquema de cores.

#### 2. Definindo o Tempo de Foco (H/M)

O campo de **Foco** agora está dividido para maior precisão:

* **Foco (h):** Insira o número desejado de horas (ex: `1`).
* **Foco (min):** Insira o número desejado de minutos para completar o tempo.

> 📝 **Nota:** Os campos **Pausa Curta (min)** e **Pausa Longa (min)** permanecem configuráveis apenas em **Minutos**, seguindo o padrão Pomodoro para intervalos.

<br>

# ⏳ Gerador de Foco - FocoWave: Seu Aliado de Produtividade com a Técnica Pomodoro

## ✨ Visão Geral

O **FocoWave** é uma ferramenta web elegante e intuitiva, projetada para maximizar sua produtividade e concentração utilizando a renomada Técnica Pomodoro. Inspirado na simplicidade e eficácia, esta aplicação ajuda você a gerenciar seus tempos de trabalho e descanso de forma eficiente, promovendo sessões de foco ininterruptas e descansos merecidos.

Com uma interface limpa e personalizável, o Gerador de Foco oferece o ambiente ideal para quem busca otimizar a rotina de estudos ou trabalho, minimizando distrações e aumentando a atenção.

## 🚀 Principais Funcionalidades

- **Timer Personalizável:** Defina a duração exata (em minutos/horas) para suas sessões de `Foco`, `Pausa Curta` e `Pausa Longa`, adaptando-se perfeitamente à sua rotina.
- **Contador de Ciclos Pomodoro:** Monitore seu progresso com um contador visual de ciclos (ex: "Ciclo: 1 de 4"), garantindo a adesão à técnica e uma pausa longa merecida ao final de cada bloco.
- **Sons Ambientes Relaxantes:** Escolha entre uma variedade de sons de fundo (Chuva, Café, Ruído Branco, Piano Suave, Sons da Natureza ou Nenhum) para criar a atmosfera perfeita para sua concentração.
- **Alertas Sonoros:** Notificações discretas para sinalizar o fim de cada sessão.
- **Persistência de Configurações:** Suas últimas configurações de tempo e som são salvas automaticamente no navegador (Local Storage), garantindo que você retome exatamente de onde parou.
- **Design Otimizado:** Layout ajustado para evitar barras de rolagem verticais desnecessárias, garantindo uma experiência de usuário fluida em vários dispositivos.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura de conteúdo semântica e acessível.
- **CSS3:** Estilização moderna e responsiva, focando em uma experiência visual agradável.
- **JavaScript (ES6+):** Lógica dinâmica para o timer, controle de áudio, gerenciamento de estado e persistência de dados (Local Storage).

## 💡 Como Usar

1. **Defina seus Tempos:** No topo da página, insira a duração desejada para Foco, Pausa Curta e Pausa Longa.
2. **Escolha seu Som:** Na seção "Som de Fundo", selecione o áudio que melhor se adapta a você.
3. **Comece a Focar:** Clique no botão "Iniciar Foco" para começar sua primeira sessão.
    * *O contador "Ciclo: X de 4" ajuda você a acompanhar seu progresso, indicando quando a próxima pausa longa se aproxima.*
4. **Reiniciar:** Use o botão "Reiniciar" a qualquer momento para zerar o timer e o contador de ciclos.

## 🤝 Contribuições

Sinta-se à vontade para explorar o código, sugerir melhorias ou reportar bugs.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---
**Desenvolvido com 💜 por [PatrickCaramico](https://github.com/PatrickCaramico)**
