# TEA Kids - Aplicativo de Comunicação Inclusiva

**TEA Kids** é um aplicativo móvil inclusivo desenvolvido para auxiliar crianças no espectro autista na comunicação, organização de rotinas e aprendizado. Com interface intuitiva e síntese de voz em português, o app promove autonomia e confiança.

---

## Funcionalidades

### 💬 Conversar

O módulo de comunicação permite que a criança expresse necessidades, sentimentos e interaja de forma simples e eficaz.

**Categorias disponíveis:**

| Categoria | Ícone | Descrição |
|-----------|-------|-----------|
| Saudações | 👋 | Olá, bom dia, boa tarde, tchau, obrigado, etc. |
| Necessidades | 🍎 | Fome, sede, banho, troca de roupa, frio, calor |
| Saúde | ❤️ | Dor, febre, médico, remédio |
| Atividades | ⚽ | Ler, brincar, desenhar, música, jogos |
| Família | 👨‍👩‍👧 | Mamãe, papai, avós, irmão, amigo |
| Locais | 🏠 | Casa, escola, parque, hospital, loja |

**Como usar:**
1. Toque na categoria desejada
2. Selecione o cartão com a frase
3. O aplicativo fala automaticamente

---

### 📅 Rotinas

Sistema de checklists diários para ajudar na organização e independência da criança.

**Períodos:**
- 🌅 **Manhã** - Acordar, fazer cama, escovar dentes, vestir, escola
- ☀️ **Tarde** - Almoço, descanso, tarefa, estudo, atividades
- 🌙 **Noite** - Jantar, banho, pijama, história, dormir

**Funcionalidades:**
- Barra de progresso visual
- Checkbox interativo para marcar tarefas
- Progresso salvo automaticamente
- Ícones intuitivos para cada atividade

---

### ✏️ Escrever

Ambiente para prática de escrita e aprendizado do alfabeto.

**Recursos:**
- **Campo de texto** - Digite qualquer texto e o app fala em português
- **Alfabeto interativo** - 26 letras com palavras e ícones associativos

| Letra | Palavra | Ícone |
|-------|---------|-------|
| A | Avião | ✈️ |
| B | Bola | ⚽ |
| C | Casa | 🏠 |
| D | Dado | 🎲 |
| E | Estrela | ⭐ |
| F | Flor | 🌸 |
| G | Gato | 🐱 |
| H | Helicóptero | 🚁 |
| I | Igreja | ⛪ |
| J | Janela | 🪟 |
| K | Kiwi | 🥝 |
| L | Leão | 🦁 |
| M | Maçã | 🍎 |
| ... | ... | ... |

---

### 🎮 Interação

Módulo educacional para aprendizado de formas, cores e vocabulário.

**Categorias de aprendizado:**

| Categoria | Itens | Descrição |
|-----------|-------|-----------|
| Formas | 12 | Círculo, quadrado, triângulo, estrela, coração |
| Cores | 12 | Vermelho, azul, verde, amarelo, roxo, etc. |
| Animais | 20 | Domésticos e fauna brasileira |
| Frutas | 15 | Frutas brasileiras (açaí, manga, goiaba) |
| Alimentos | 20 | Cereais, proteínas, laticínios |
| Números | 11 | 0 a 10 |
| Legumes | 12 | Cenoura, alface, tomate, batata |
| Casa | 12 | Cama, sofá, janela, porta |

---

## Recursos Técnicos

### Síntese de Voz (TTS)
- Engine nativamente integrado (Android)
- Fallback para Web Speech API em navegador
- Idioma: Português brasileiro (pt-BR)
- Velocidade ajustável

### Persistência de Dados
- Progresso das rotinas salvo no localStorage
- Funciona offline após primeiro carregamento

### Design Acessível
- Tema escuro para menor estimulação visual
- Alto contraste entre elementos
- Ícones universalmente compreensíveis
- Feedback visual e auditivo

---

## Instalação

### Desenvolvimento
```bash
cd vue-teakids
npm install
npm run dev
```

### Build Android
```bash
npm run build
npx capacitor sync android
cd android && ./gradlew assembleDebug
```

### APK
O APK compilado está disponível em:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## Especificações Técnicas

| Item | Detalhe |
|------|---------|
| Framework | Vue.js 3 + TypeScript |
| Build | Capacitor 8 |
| Estado | Pinia |
| Router | Vue Router 4 |
| TTS | @capacitor-community/text-to-speech |
| Plataforma | Android |

---

## Benefícios

✅ Facilita comunicação de necessidades e sentimentos  
✅ Auxilia organização da rotina diária  
✅ Estimula aprendizado de formas, cores e palavras  
✅ Promove autonomia e confiança  
✅ Ambiente seguro e inclusivo  
✅ Interface acessível e intuitiva  

---

## Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

*TEA Kids - Um mundo mais azul, um mundo mais inclusivo 💙*
