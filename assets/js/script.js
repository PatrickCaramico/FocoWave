// ===== FIREBASE CONFIG — V1.3 =====
// 🔥 Substitua com as configurações do SEU projeto Firebase
// Crie um projeto gratuito em: https://console.firebase.google.com
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA0HoubqUwunHQUzg8j3X07_tr0tZi4sR4",
    authDomain: "focowaze.firebaseapp.com",
    projectId: "focowaze",
    storageBucket: "focowaze.firebasestorage.app",
    messagingSenderId: "114293421188",
    appId: "1:114293421188:web:5ea2fe14a1867b58a3fed1"
};

let firebaseAuth = null;
(function initFirebase() {
    try {
        const isConfigured = FIREBASE_CONFIG.apiKey !== 'SUA_API_KEY_AQUI';
        if (typeof firebase !== 'undefined' && isConfigured) {
            if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
            firebaseAuth = firebase.auth();
        }
    } catch (e) {
        console.warn('FocoWave: Firebase não inicializado —', e.message);
    }
})();

// Variável global para o Contexto de Áudio
let audioContext = null;

// Chaves para o Local Storage
const LS_TIMES = 'pomodoroTimes';
const LS_SOUND = 'pomodoroSound';
const LS_CYCLE = 'pomodoroCycle';
const LS_THEME = 'pomodoroTheme'; 
const LS_FOCUS_H = 'pomodoroFocusH'; 
const LS_FOCUS_M = 'pomodoroFocusM'; 
const LS_AUTO_START = 'pomodoroAutoStart';
const LS_CYCLES_LIMIT = 'pomodoroCyclesLimit'; 
const LS_TARGET_TIME = 'pomodoroTargetTime'; 
const LS_LANG       = 'pomodoroLang';
// V1.3 — Novas chaves
const LS_USER_MODE    = 'fw_mode';         // 'guest' | 'logged'
const LS_FAVORITES    = 'fw_favorites';    // array JSON
const LS_STREAK_DATE  = 'fw_streak_date';  // 'YYYY-MM-DD'
const LS_STREAK_COUNT = 'fw_streak_count'; // number
const LS_DAILY_HIST   = 'fw_daily_hist';   // objeto JSON

// Ícone Original
const originalFaviconHref = "assets/images/Icone.ico"; 

// ----- DICIONÁRIO DE TRADUÇÕES (V1.3.0) -----
const translations = {
    pt: {
        app_title: "Gerador de Foco - FocoWave",
        cycle_text: "Ciclo",
        of_text: "de",
        label_focus: "Focar (h/min):",
        unit_h: "h",
        unit_min: "min",
        label_short: "Pausa Curta:",
        label_long: "Pausa Longa:",
        label_cycles: "Ciclos:",
        label_auto_start: "Início Automático 🔄",
        label_sounds: "Som de Fundo:",
        
        btn_start_focus: "Iniciar Foco",
        btn_start_pause: "Iniciar Pausa",
        btn_pause: "Pausar",
        btn_skip: "Pular ⏭️",
        btn_reset: "Reiniciar",
        
        sound_none: "Nenhum",
        sound_rain: "Chuva",
        sound_cafe: "Cafeteria",
        sound_noise: "Ruído Branco",
        sound_piano: "Piano",
        sound_nature: "Natureza",
        sound_waves: "Ondas",
        
        notif_title_pause: "Hora da Pausa! ☕",
        notif_body_pause: "Ciclo concluído! Respire um pouco.",
        notif_title_focus: "Hora de Focar! 🚀",
        notif_body_focus: "Pausa finalizada! Vamos voltar ao fluxo?"
    },
    en: {
        app_title: "Focus Generator - FocoWave",
        cycle_text: "Cycle",
        of_text: "of",
        label_focus: "Focus (h/min):",
        unit_h: "h",
        unit_min: "min",
        label_short: "Short Break:",
        label_long: "Long Break:",
        label_cycles: "Cycles:",
        label_auto_start: "Auto Start 🔄",
        label_sounds: "Background Sound:",
        
        btn_start_focus: "Start Focus",
        btn_start_pause: "Start Break",
        btn_pause: "Pause",
        btn_skip: "Skip ⏭️",
        btn_reset: "Reset",
        
        sound_none: "None",
        sound_rain: "Rain",
        sound_cafe: "Coffee Shop",
        sound_noise: "White Noise",
        sound_piano: "Piano",
        sound_nature: "Nature",
        sound_waves: "Waves",
        
        notif_title_pause: "Break Time! ☕",
        notif_body_pause: "Cycle finished! Take a breath.",
        notif_title_focus: "Focus Time! 🚀",
        notif_body_focus: "Break over! Let's get back to flow."
    },
    es: {
        app_title: "Generador de Enfoque - FocoWave",
        cycle_text: "Ciclo",
        of_text: "de",
        label_focus: "Enfocar (h/min):",
        unit_h: "h",
        unit_min: "min",
        label_short: "Pausa Corta:",
        label_long: "Pausa Larga:",
        label_cycles: "Ciclos:",
        label_auto_start: "Inicio Automático 🔄",
        label_sounds: "Sonido de Fondo:",
        
        btn_start_focus: "Iniciar Enfoque",
        btn_start_pause: "Iniciar Pausa",
        btn_pause: "Pausar",
        btn_skip: "Saltar ⏭️",
        btn_reset: "Reiniciar",
        
        sound_none: "Ninguno",
        sound_rain: "Lluvia",
        sound_cafe: "Cafetería",
        sound_noise: "Ruido Blanco",
        sound_piano: "Piano",
        sound_nature: "Naturaleza",
        sound_waves: "Olas",
        
        notif_title_pause: "¡Hora de Descanso! ☕",
        notif_body_pause: "¡Ciclo terminado! Respira un poco.",
        notif_title_focus: "¡Hora de Enfocarse! 🚀",
        notif_body_focus: "¡Pausa terminada! Volvamos al flujo."
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // ----- 1. PEGAR ELEMENTOS DO HTML (DOM) -----
    
    const display = document.getElementById('timer-display');
    const btnStartPause = document.getElementById('btn-start-pause');
    const btnReset = document.getElementById('btn-reset');
    const btnSkip = document.getElementById('btn-skip');
    const faviconElement = document.querySelector("link[rel~='icon']");
    
    const autoStartToggle = document.getElementById('auto-start-toggle');
    const languageSelect = document.getElementById('language-select'); // NOVO

    const focusHourInput = document.getElementById('focus-hour-input'); 
    const focusMinInput = document.getElementById('focus-min-input');
    const shortInput = document.getElementById('short-input');
    const longInput = document.getElementById('long-input');
    const cyclesInput = document.getElementById('cycles-input');
    
    const timeInputs = document.querySelectorAll('.time-config input[type="number"]');
    const cycleCounterDisplay = document.getElementById('cycle-counter');
    const soundButtons = document.querySelectorAll('.sound-btn');
    const volumeSlider = document.getElementById('volume-slider');

    // ---- V1.3: Novos elementos DOM ----
    const loginOverlay      = document.getElementById('login-overlay');
    const loginSubtitleText = document.getElementById('login-subtitle-text');
    const loginStatusMessage = document.getElementById('login-status-message');
    const btnLoginGoogle    = document.getElementById('btn-login-google');
    const btnContinueGuest  = document.getElementById('btn-continue-guest');
    const btnUserMenu       = document.getElementById('btn-user-menu');
    const userDropdown      = document.getElementById('user-dropdown');
    const userAvatarMini    = document.getElementById('user-avatar-mini');
    const userIconDefault   = document.getElementById('user-icon-default');
    const dropdownUserInfo  = document.getElementById('dropdown-user-info');
    const dropdownAvatar    = document.getElementById('dropdown-avatar');
    const dropdownName      = document.getElementById('dropdown-name');
    const dropdownEmail     = document.getElementById('dropdown-email');
    const btnLogoutDropdown = document.getElementById('btn-logout-dropdown');
    const btnLoginDropdown  = document.getElementById('btn-login-dropdown');
    const userWelcome       = document.getElementById('user-welcome');
    const userAvatarWelcome = document.getElementById('user-avatar-welcome');
    const userGreetingText  = document.getElementById('user-greeting-text');
    const streakCountEl     = document.getElementById('streak-count');
    const themeButtons      = document.querySelectorAll('.theme-btn');
    const btnDashboardToggle  = document.getElementById('btn-dashboard-toggle');
    const btnDashboardHelp    = document.getElementById('btn-dashboard-help');
    const dashboardBody       = document.getElementById('dashboard-body');
    const dashboardHelpPanel  = document.getElementById('dashboard-help-panel');
    const btnCloseHelp        = document.getElementById('btn-close-help');
    const statCyclesToday     = document.getElementById('stat-cycles-today');
    const statFocusTime       = document.getElementById('stat-focus-time');
    const statStreakDash      = document.getElementById('stat-streak-dash');

    // Elementos de Áudio
    const audioRain = document.getElementById('audio-rain');
    const audioCafe = document.getElementById('audio-cafe');
    const audioNoise = document.getElementById('audio-noise');
    const audioPiano = document.getElementById('audio-piano');
    const audioNature = document.getElementById('audio-nature');
    const audioWeightless = document.getElementById('audio-weightless');
    const audioWaves = document.getElementById('audio-waves');
    const audioDreams = document.getElementById('audio-dreams');

    const audioAlert = document.getElementById('audio-alert');
    
    // ----- 2. VARIÁVEIS DE ESTADO -----
    
    let currentMode = 'focus';
    let currentTime = 0;
    let timerInterval = null;
    let isPaused = true;
    let isAutoStart = false;
    let currentSound = 'none';
    let currentAudio = null;
    let currentCycle = 0;
    let cyclesLimit = 4; 
    let currentTheme = 'dark';
    let targetTime = null; 
    let currentLang = 'pt'; // Padrão
    // V1.3 — novas variáveis
    let currentUser    = null;  // Firebase user ou null
    let userMode       = null;  // 'guest' | 'logged'
    let favoriteSounds = [];    // sons favoritados
    let focusChartInstance = null;
    let dashboardOpen  = false;
    let greetingInterval = null;


    // ----- 3. FUNÇÕES HELPER -----
    
    // --- FUNÇÃO DE TRADUÇÃO ATUALIZADA ---
    function updateLanguage(lang) {
        currentLang = lang;
        const t = translations[lang];

        // Atualiza textos fixos
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        // --- NOVO: Ajuste de Layout para Espanhol ---
        if (lang === 'es') {
            document.body.classList.add('es-mode');
        } else {
            document.body.classList.remove('es-mode');
        }
        // -------------------------------------------

        updateCycleDisplay();
        updateDisplay(); 
        updateLoginMotivation();

        if (currentUser && userGreetingText) {
            renderGreetingNow(currentUser.displayName || 'Usuário');
        }
        
        languageSelect.value = lang;
    }

    function getTimesFromInputs() {
        const focusHours = parseInt(focusHourInput.value, 10) * 3600; 
        const focusMinutes = parseInt(focusMinInput.value, 10) * 60; 
        
        return {
            focus: focusHours + focusMinutes,
            short: parseInt(shortInput.value, 10) * 60,
            long: parseInt(longInput.value, 10) * 60,
        };
    }

    function saveSettings() {
        localStorage.setItem(LS_FOCUS_H, focusHourInput.value);
        localStorage.setItem(LS_FOCUS_M, focusMinInput.value);
        
        const breakTimes = {
            short: shortInput.value,
            long: longInput.value
        };
        localStorage.setItem(LS_TIMES, JSON.stringify(breakTimes)); 
        
        localStorage.setItem(LS_SOUND, currentSound);
        localStorage.setItem(LS_CYCLE, currentCycle);
        localStorage.setItem(LS_THEME, currentTheme);
        localStorage.setItem(LS_AUTO_START, autoStartToggle.checked);
        localStorage.setItem(LS_CYCLES_LIMIT, cyclesInput.value);
        localStorage.setItem(LS_LANG, currentLang); // Salva idioma
        
        localStorage.setItem('pomodoroCurrentMode', currentMode);
        if (isPaused) {
             localStorage.setItem('pomodoroCurrentTime', currentTime);
        }
    }
    
    function loadSettings() {
        const savedFocusH = localStorage.getItem(LS_FOCUS_H);
        const savedFocusM = localStorage.getItem(LS_FOCUS_M);
        
        if (savedFocusH) focusHourInput.value = savedFocusH;
        if (savedFocusM) focusMinInput.value = savedFocusM;

        const savedBreakTimes = JSON.parse(localStorage.getItem(LS_TIMES));
        if (savedBreakTimes) {
            shortInput.value = savedBreakTimes.short;
            longInput.value = savedBreakTimes.long;
        }

        const savedSound = localStorage.getItem(LS_SOUND);
        const savedCycle = parseInt(localStorage.getItem(LS_CYCLE), 10);
        const savedTheme = localStorage.getItem(LS_THEME);
        const savedAutoStart = localStorage.getItem(LS_AUTO_START);
        const savedCyclesLimit = localStorage.getItem(LS_CYCLES_LIMIT);
        const savedLang = localStorage.getItem(LS_LANG);
        
        const savedMode = localStorage.getItem('pomodoroCurrentMode');
        const savedTime = localStorage.getItem('pomodoroCurrentTime');
        const savedTarget = localStorage.getItem(LS_TARGET_TIME); 

        if (savedSound) currentSound = savedSound;
        if (!isNaN(savedCycle)) currentCycle = savedCycle;

        if (savedTheme) {
            applyTheme(savedTheme);
        }

        if (savedAutoStart === 'true') {
            isAutoStart = true;
            autoStartToggle.checked = true;
        }

        if (savedCyclesLimit) {
            cyclesLimit = parseInt(savedCyclesLimit, 10);
            cyclesInput.value = cyclesLimit;
        }

        // Carrega Idioma
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        }
        updateLanguage(currentLang);
        
        if (savedMode) currentMode = savedMode;

        if (savedTarget) {
            const now = Date.now();
            const remaining = Math.ceil((parseInt(savedTarget, 10) - now) / 1000);
            
            if (remaining > 0) {
                currentTime = remaining;
                targetTime = parseInt(savedTarget, 10);
                isPaused = false; 
                startTimerLogic(false); 
            } else {
                currentTime = 0;
                isPaused = false;
                countdown(); 
            }
        } else {
            if (savedTime) {
                currentTime = parseInt(savedTime, 10);
            } else {
                currentTime = getTimesFromInputs().focus;
            }
        }
    }

    function updateFavicon(mode) {
        if (!faviconElement) return;
        const colorFocus = '%2303DAC5'; 
        const colorPause = '%23FFC107'; 
        let color = mode === 'focus' ? colorFocus : colorPause;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="${color}" />
            </svg>
        `;
        faviconElement.href = `data:image/svg+xml,${svg}`;
    }

    function resetFavicon() {
        if (faviconElement) faviconElement.href = originalFaviconHref;
    }

    function updateCycleDisplay() {
        const t = translations[currentLang];
        cycleCounterDisplay.textContent = `${t.cycle_text}: ${currentCycle} ${t.of_text} ${cyclesLimit}`;
    }

    function updateDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        document.title = `${display.textContent} - FocoWave`;
        
        // Lógica de texto do botão baseada na tradução
        const t = translations[currentLang];
        if (isPaused) {
            btnStartPause.textContent = currentMode === 'focus' ? t.btn_start_focus : t.btn_start_pause;
        } else {
            btnStartPause.textContent = t.btn_pause;
        }
        
        document.body.setAttribute('data-mode', currentMode);
    }
    
    function stopAllSounds() {
        audioRain.pause();
        audioCafe.pause();
        audioNoise.pause();
        audioPiano.pause();
        audioNature.pause();
        audioWeightless.pause();
        audioWaves.pause();
        audioDreams.pause();
        
        if (currentAudio) {
            currentAudio.currentTime = 0;
        }
        currentAudio = null;
    }

    function playCurrentSound() {
        stopAllSounds();

        if (currentSound === 'rain') { currentAudio = audioRain; }    
        else if (currentSound === 'cafe') { currentAudio = audioCafe; }    
        else if (currentSound === 'noise') { currentAudio = audioNoise; }    
        else if (currentSound === 'piano') { currentAudio = audioPiano; }    
        else if (currentSound === 'nature') { currentAudio = audioNature; }
        else if (currentSound === 'weightless') { currentAudio = audioWeightless; }
        else if (currentSound === 'waves') { currentAudio = audioWaves; }
        else if (currentSound === 'dreams') { currentAudio = audioDreams; }

        if (currentAudio) {
            currentAudio.volume = volumeSlider.value;
            currentAudio.play().catch(e => console.error("Falha no play:", e));    
        }
    }

    function switchMode(newMode) {
        currentMode = newMode;
        const times = getTimesFromInputs();    

        if (currentMode === 'focus') { currentTime = times.focus; }    
        else if (currentMode === 'short') { currentTime = times.short; }    
        else if (currentMode === 'long') { currentTime = times.long; }

        updateFavicon(currentMode);
        updateDisplay();
        
        localStorage.removeItem(LS_TARGET_TIME);
        
        if (isPaused) {
            stopAllSounds();
        }
    }

    function sendNotification() {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            const t = translations[currentLang];
            const title = currentMode === 'focus' ? t.notif_title_pause : t.notif_title_focus;
            const body = currentMode === 'focus' ? t.notif_body_pause : t.notif_body_focus;
            
            new Notification("FocoWave", {
                body: body,
                icon: "assets/images/Icone.ico" 
            });
        }
    }
    
    function initTimer() {
        currentMode = 'focus';
        currentTime = getTimesFromInputs().focus;
        localStorage.removeItem(LS_TARGET_TIME); 
        updateDisplay();
        updateCycleDisplay();
        if (isPaused) resetFavicon();
    }

    function startTimerLogic(createNewTarget = true) {
         clearInterval(timerInterval);
         
         if (createNewTarget) {
             targetTime = Date.now() + (currentTime * 1000);
             localStorage.setItem(LS_TARGET_TIME, targetTime);
         }

         timerInterval = setInterval(countdown, 1000);
         isPaused = false;
         
         updateFavicon(currentMode);

         if (currentMode === 'focus') {
             playCurrentSound();
         } else {
             stopAllSounds();
         }
         updateDisplay();
    }

    // ===================================================================
    // V1.3 — NOVAS FUNÇÕES
    // ===================================================================

    // ----- Toast -----
    function showToast(msg, duration = 3000) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), duration);
    }

    function getAuthErrorMessage(error) {
        const code = error?.code || 'unknown';
        const currentHost = window.location.hostname || 'host-desconhecido';
        const errorMap = {
            'auth/unauthorized-domain': `⚠️ Domínio não autorizado: ${currentHost}. Adicione esse host em Authentication > Settings > Authorized domains.`,
            'auth/operation-not-allowed': '⚠️ Login Google desativado. Ative Google em Authentication > Sign-in method.',
            'auth/popup-blocked': '⚠️ Popup bloqueado. Vou tentar por redirecionamento...',
            'auth/cancelled-popup-request': '⚠️ O popup foi cancelado. Vou tentar por redirecionamento...',
            'auth/popup-closed-by-user': 'Login cancelado.',
            'auth/network-request-failed': '⚠️ Falha de rede. Verifique internet/VPN/firewall.',
            'auth/invalid-api-key': '⚠️ API Key inválida. Revise o FIREBASE_CONFIG.',
            'auth/configuration-not-found': '⚠️ Firebase Auth não está pronto. No Console: Authentication > Get started > Sign-in method > Google > Enable + e-mail de suporte.',
            'auth/operation-not-supported-in-this-environment': '⚠️ Ambiente não suportado. Abra o app via http://localhost (não file://).'
        };
        return errorMap[code] || `❌ Erro de login (${code}). Veja o Console (F12).`;
    }

    const loginMotivationMessages = {
        pt: [
            'Hoje é um ótimo dia para avançar 1% a mais. 🌊',
            'Pequenos focos constroem grandes resultados. 🚀',
            'Respira fundo. Um ciclo por vez e você chega lá. 💪',
            'Seu futuro agradece cada minuto de foco de agora. 🎯',
            'Disciplina hoje, liberdade amanhã. Vamos nessa? ⚡'
        ],
        en: [
            'One focused cycle at a time. You got this. 🚀',
            'Small focus sessions build big wins. 🎯',
            'Show up today, thank yourself tomorrow. 💪'
        ],
        es: [
            'Un ciclo de enfoque a la vez. ¡Tú puedes! 🚀',
            'Los pequeños avances crean grandes resultados. 🎯',
            'Disciplina hoy, resultados mañana. 💪'
        ]
    };

    function updateLoginMotivation() {
        if (!loginSubtitleText) return;
        const msgs = loginMotivationMessages[currentLang] || loginMotivationMessages.pt;
        loginSubtitleText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    }

    function showLoginStatus(message, type = 'warning') {
        if (!loginStatusMessage) return;
        loginStatusMessage.textContent = message;
        loginStatusMessage.classList.remove('hidden', 'warning', 'error', 'success');
        loginStatusMessage.classList.add(type);
    }

    function clearLoginStatus() {
        if (!loginStatusMessage) return;
        loginStatusMessage.textContent = '';
        loginStatusMessage.classList.remove('warning', 'error', 'success');
        loginStatusMessage.classList.add('hidden');
    }

    // ----- Login Overlay -----
    function showLoginOverlay() {
        if (loginOverlay) loginOverlay.classList.remove('hidden');
        updateLoginMotivation();
        clearLoginStatus();
    }
    function hideLoginOverlay() {
        if (loginOverlay) loginOverlay.classList.add('hidden');
    }

    // ----- Tema (4 opções) -----
    function applyTheme(theme) {
        document.body.classList.remove('light-mode', 'forest-theme', 'minimal-theme');
        if (theme === 'light')   document.body.classList.add('light-mode');
        if (theme === 'forest')  document.body.classList.add('forest-theme');
        if (theme === 'minimal') document.body.classList.add('minimal-theme');
        currentTheme = theme;
        themeButtons.forEach(btn =>
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme)
        );
    }

    // ----- User UI -----
    const greetingMsgs = {
        pt: [n => `Bom trabalho, ${n}! Vamos focar? 🚀`, n => `Pronto para o próximo ciclo, ${n}? 💪`,
             n => `Vamos lá, ${n}! Foco total 🎯`, n => `Hora de brilhar, ${n}! ⚡`],
        en: [n => `Good work, ${n}! Let's focus? 🚀`, n => `Ready, ${n}? Full focus 🎯`],
        es: [n => `¡Buen trabajo, ${n}! ¿A enfocarse? 🚀`, n => `¡Adelante, ${n}! Enfoque total 🎯`]
    };
    function getGreeting(name) {
        const msgs = greetingMsgs[currentLang] || greetingMsgs.pt;
        return msgs[Math.floor(Math.random() * msgs.length)](name);
    }

    function renderGreetingNow(name) {
        if (!userGreetingText) return;
        userGreetingText.textContent = getGreeting(name);
    }

    function stopGreetingRotation() {
        if (greetingInterval) {
            clearInterval(greetingInterval);
            greetingInterval = null;
        }
    }

    function startGreetingRotation(name) {
        stopGreetingRotation();
        renderGreetingNow(name);
        greetingInterval = setInterval(() => {
            renderGreetingNow(name);
        }, 15000);
    }

    function updateUserUI(user) {
        if (user) {
            const name = user.displayName || 'Usuário';
            const photo = user.photoURL || '';
            if (photo) {
                userAvatarMini.src = photo;
                userAvatarMini.classList.remove('hidden');
                userIconDefault.classList.add('hidden');
                userAvatarWelcome.src = photo;
                userAvatarWelcome.classList.remove('hidden');
                dropdownAvatar.src = photo;
            }
            if (dropdownUserInfo) {
                dropdownName.textContent = name;
                dropdownEmail.textContent = user.email || '';
                dropdownUserInfo.classList.remove('hidden');
            }
            if (btnLogoutDropdown) btnLogoutDropdown.classList.remove('hidden');
            if (btnLoginDropdown)  btnLoginDropdown.classList.add('hidden');
            if (userWelcome) {
                userWelcome.classList.remove('hidden');
                startGreetingRotation(name);
            }
            // Desbloquear temas premium
            themeButtons.forEach(btn => btn.classList.remove('locked'));

        } else {
            stopGreetingRotation();
            // Visitante
            userAvatarMini.classList.add('hidden');
            userIconDefault.classList.remove('hidden');
            if (dropdownUserInfo) dropdownUserInfo.classList.add('hidden');
            if (btnLogoutDropdown) btnLogoutDropdown.classList.add('hidden');
            if (btnLoginDropdown)  btnLoginDropdown.classList.remove('hidden');
            if (userWelcome) userWelcome.classList.add('hidden');
            if (userGreetingText) userGreetingText.textContent = '';
            // Bloquear temas premium
            themeButtons.forEach(btn => {
                if (btn.dataset.theme === 'forest' || btn.dataset.theme === 'minimal')
                    btn.classList.add('locked');
            });
            // Rebaixar tema premium para dark
            if (currentTheme === 'forest' || currentTheme === 'minimal') {
                applyTheme('dark');
                saveSettings();
            }
        }
    }

    // ----- Streak -----
    function updateStreakDisplay() {
        const count = parseInt(localStorage.getItem(LS_STREAK_COUNT) || '0');
        if (streakCountEl) streakCountEl.textContent = count;
        if (statStreakDash) statStreakDash.textContent = count;
    }

    function recordStreakForToday() {
        const today = new Date().toISOString().split('T')[0];
        const lastDate  = localStorage.getItem(LS_STREAK_DATE) || '';
        let count = parseInt(localStorage.getItem(LS_STREAK_COUNT) || '0');
        if (lastDate === today) return; // já registrado hoje
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        count = lastDate === yStr ? count + 1 : 1; // consecutivo ou reinicia
        localStorage.setItem(LS_STREAK_COUNT, count);
        localStorage.setItem(LS_STREAK_DATE, today);
        updateStreakDisplay();
        if (count > 1) showToast(`🔥 ${count} dias em sequência! Continue assim!`);
    }

    // ----- Favoritos -----
    function loadFavorites() {
        favoriteSounds = JSON.parse(localStorage.getItem(LS_FAVORITES) || '[]');
        injectFavStars();
        updateFavoritesUI();
    }
    function saveFavorites() {
        localStorage.setItem(LS_FAVORITES, JSON.stringify(favoriteSounds));
    }
    function injectFavStars() {
        soundButtons.forEach(btn => {
            if (btn.dataset.sound === 'none' || btn.querySelector('.fav-star')) return;
            const star = document.createElement('span');
            star.className = 'fav-star';
            star.title = 'Favoritar';
            star.textContent = '☆';
            btn.appendChild(star);
            star.addEventListener('click', e => {
                e.stopPropagation();
                const s = btn.dataset.sound;
                const idx = favoriteSounds.indexOf(s);
                if (idx === -1) { favoriteSounds.push(s); showToast('⭐ Adicionado aos favoritos!'); }
                else            { favoriteSounds.splice(idx, 1); showToast('Removido dos favoritos.'); }
                saveFavorites();
                updateFavoritesUI();
            });
        });
    }
    function updateFavoritesUI() {
        soundButtons.forEach(btn => {
            const s = btn.dataset.sound;
            if (s === 'none') { btn.style.order = '-1'; return; }
            const isFav = favoriteSounds.includes(s);
            const star = btn.querySelector('.fav-star');
            if (star) star.textContent = isFav ? '⭐' : '☆';
            btn.classList.toggle('is-favorite', isFav);
            btn.style.order = isFav ? '0' : '1';
        });
    }

    // ----- Histórico Diário -----
    function getTodayKey() { return new Date().toISOString().split('T')[0]; }
    function getDailyHistory() {
        return JSON.parse(localStorage.getItem(LS_DAILY_HIST) || '{}');
    }
    function recordFocusCycleHistory(focusSecs) {
        const today = getTodayKey();
        const h = getDailyHistory();
        if (!h[today]) h[today] = { cycles: 0, focusSecs: 0, pauseSecs: 0 };
        h[today].cycles++;
        h[today].focusSecs = (h[today].focusSecs || 0) + focusSecs;
        // manter apenas últimos 7 dias
        const keys = Object.keys(h).sort();
        if (keys.length > 7) delete h[keys[0]];
        localStorage.setItem(LS_DAILY_HIST, JSON.stringify(h));
        recordStreakForToday();
        updateDashboard(h);
    }
    function recordPauseHistory(pauseSecs) {
        const today = getTodayKey();
        const h = getDailyHistory();
        if (!h[today]) h[today] = { cycles: 0, focusSecs: 0, pauseSecs: 0 };
        h[today].pauseSecs = (h[today].pauseSecs || 0) + pauseSecs;
        localStorage.setItem(LS_DAILY_HIST, JSON.stringify(h));
        if (dashboardOpen) updateDashboard(h);
    }

    // ----- Dashboard & Chart -----
    function initFocusChart() {
        const canvas = document.getElementById('focus-chart');
        if (!canvas || typeof Chart === 'undefined') return;
        if (focusChartInstance) { focusChartInstance.destroy(); focusChartInstance = null; }
        const isDark = !document.body.classList.contains('light-mode')
                    && !document.body.classList.contains('minimal-theme');
        const legendColor = isDark ? '#AAA' : '#666';
        focusChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Foco', 'Pausa'],
                datasets: [{ data: [1, 0], backgroundColor: ['#03DAC5', '#BB86FC'], borderWidth: 0, hoverOffset: 4 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: legendColor, font: { size: 11 }, padding: 12 } }
                }
            }
        });
    }
    function updateDashboard(histArg) {
        const h   = histArg || getDailyHistory();
        const d   = h[getTodayKey()] || { cycles: 0, focusSecs: 0, pauseSecs: 0 };
        const min = Math.floor((d.focusSecs || 0) / 60);
        if (statCyclesToday) statCyclesToday.textContent = d.cycles;
        if (statFocusTime)   statFocusTime.textContent   = min < 60 ? `${min}min` : `${Math.floor(min/60)}h${min%60}m`;
        if (statStreakDash)  statStreakDash.textContent   = localStorage.getItem(LS_STREAK_COUNT) || '0';
        if (focusChartInstance) {
            const f = d.focusSecs || 0, p = d.pauseSecs || 0;
            focusChartInstance.data.datasets[0].data = [f || 1, p];
            focusChartInstance.update('none');
        }
    }

    // ----- 4. O TIMER -----

    function countdown() {
        if (targetTime) {
            const now = Date.now();
            const timeLeft = Math.ceil((targetTime - now) / 1000);
            currentTime = timeLeft;
        } else {
            currentTime--;
        }

        if (currentTime <= 0) {
            currentTime = 0; 
            clearInterval(timerInterval);
            localStorage.removeItem(LS_TARGET_TIME); 

            audioAlert.play();
            sendNotification();

            if (currentMode === 'focus') {
                currentCycle++;
                updateCycleDisplay();
                // V1.3: registrar ciclo de foco no histórico
                const cycleTimes = getTimesFromInputs();
                recordFocusCycleHistory(cycleTimes.focus);
                
                if (currentCycle >= cyclesLimit) {
                    currentCycle = 0;
                    updateCycleDisplay();
                    switchMode('long');
                } else {
                    switchMode('short');
                }
            } else {
                // V1.3: registrar pausa no histórico
                const pauseTimes = getTimesFromInputs();
                recordPauseHistory(currentMode === 'short' ? pauseTimes.short : pauseTimes.long);
                switchMode('focus');
            }
            
            if (isAutoStart) {
                startTimerLogic(true); 
            } else {
                stopAllSounds();
                isPaused = true;
                updateDisplay();
                resetFavicon();
                saveSettings(); 
            }
            return;
        }

        updateDisplay();
    }

    // ----- 5. EVENT LISTENERS -----

    btnStartPause.addEventListener('click', () => {
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        if (isPaused) {
            if (currentTime <= 0) initTimer(); 
            startTimerLogic(true); 
        } else {
            isPaused = true;
            clearInterval(timerInterval);
            stopAllSounds();
            
            localStorage.removeItem(LS_TARGET_TIME);
            saveSettings();
            
            updateDisplay();
            resetFavicon();
        }
    });

    btnSkip.addEventListener('click', () => {
        clearInterval(timerInterval);
        stopAllSounds();
        isPaused = true; 
        localStorage.removeItem(LS_TARGET_TIME); 
        
        if (currentMode === 'focus') {
            currentCycle++;
            updateCycleDisplay();

            if (currentCycle >= cyclesLimit) {
                currentCycle = 0;
                updateCycleDisplay();
                switchMode('long');
            } else {
                switchMode('short');
            }
        } else {
            switchMode('focus');
        }

        updateDisplay();
        updateFavicon(currentMode);
        saveSettings();
    });

    btnReset.addEventListener('click', () => {
        isPaused = true;
        clearInterval(timerInterval);
        stopAllSounds();
        currentCycle = 0;
        localStorage.removeItem(LS_TARGET_TIME); 
        
        initTimer();
        resetFavicon();
        saveSettings();
    });

    autoStartToggle.addEventListener('change', () => {
        isAutoStart = autoStartToggle.checked;
        saveSettings();
    });
    
    cyclesInput.addEventListener('input', () => {
        cyclesLimit = parseInt(cyclesInput.value, 10);
        if (cyclesLimit < 1) cyclesLimit = 1; 
        updateCycleDisplay();
        saveSettings();
    });

    // Listener do Seletor de Idioma
    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
        saveSettings();
    });

    timeInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'cycles-input') return;
            const inputMode = input.getAttribute('data-mode');
            
            if (inputMode === 'focus-h' || inputMode === 'focus-m') {
                if (currentMode === 'focus') {
                    switchMode('focus');
                }
            } else if (inputMode === currentMode) {
                switchMode(currentMode);
            }
            saveSettings();
        });
    });

    // ----- NOVOS LISTENERS V1.3 -----

    // Menu do usuário
    btnUserMenu.addEventListener('click', e => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', e => {
        const area = document.getElementById('user-menu-area');
        if (area && !area.contains(e.target)) userDropdown.classList.add('hidden');
    });

    // Botões de Tema
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked')) {
                showToast('🔒 Tema exclusivo! Entre com sua conta Google para desbloquear.');
                return;
            }
            applyTheme(btn.dataset.theme);
            saveSettings();
            userDropdown.classList.add('hidden');
        });
    });

    // Login com Google
    btnLoginGoogle.addEventListener('click', async () => {
        if (!firebaseAuth) {
            showToast('⚠️ Firebase não configurado. Edite FIREBASE_CONFIG em script.js', 4000);
            showLoginStatus('Firebase ainda não foi inicializado neste app.', 'error');
            return;
        }

        if (window.location.protocol === 'file:') {
            showToast('⚠️ Abra via servidor local (ex: Live Server) para usar login Google.', 5000);
            showLoginStatus('Abra por servidor local (ex: Live Server) para habilitar o login.', 'warning');
            return;
        }

        clearLoginStatus();
        updateLoginMotivation();

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebaseAuth.signInWithPopup(provider);
            showLoginStatus('Login efetuado com sucesso. Preparando sua sessão...', 'success');
        } catch (e) {
            console.error('FocoWave Firebase Auth error:', e);

            if (e.code === 'auth/unauthorized-domain') {
                showToast(getAuthErrorMessage(e), 8000);
                showLoginStatus(getAuthErrorMessage(e), 'warning');
                setTimeout(() => {
                    const url = `https://console.firebase.google.com/project/${FIREBASE_CONFIG.projectId}/authentication/settings`;
                    window.open(url, '_blank');
                }, 800);
                return;
            }

            if (e.code === 'auth/configuration-not-found') {
                showToast(getAuthErrorMessage(e), 7000);
                showLoginStatus(getAuthErrorMessage(e), 'warning');
                setTimeout(() => {
                    const url = `https://console.firebase.google.com/project/${FIREBASE_CONFIG.projectId}/authentication/providers`;
                    window.open(url, '_blank');
                }, 800);
                return;
            }

            if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request') {
                try {
                    showToast(getAuthErrorMessage(e), 3500);
                    showLoginStatus('Popup bloqueado. Tentando login por redirecionamento...', 'warning');
                    const provider = new firebase.auth.GoogleAuthProvider();
                    await firebaseAuth.signInWithRedirect(provider);
                    return;
                } catch (redirectError) {
                    console.error('FocoWave Firebase redirect error:', redirectError);
                    showToast(getAuthErrorMessage(redirectError), 6000);
                    showLoginStatus(getAuthErrorMessage(redirectError), 'error');
                    return;
                }
            }

            const friendlyMessage = getAuthErrorMessage(e);
            if (e.code !== 'auth/popup-closed-by-user') {
                showToast(friendlyMessage, 6000);
                showLoginStatus(friendlyMessage, 'error');
            }
        }
    });

    // Continuar como visitante
    btnContinueGuest.addEventListener('click', () => {
        localStorage.setItem(LS_USER_MODE, 'guest');
        userMode = 'guest';
        hideLoginOverlay();
        updateUserUI(null);
    });

    // Logout (dropdown)
    btnLogoutDropdown.addEventListener('click', async () => {
        if (firebaseAuth && currentUser) await firebaseAuth.signOut();
        localStorage.removeItem(LS_USER_MODE);
        currentUser = null;
        userMode    = null;
        updateUserUI(null);
        userDropdown.classList.add('hidden');
        showLoginOverlay();
    });

    // Fazer login (a partir do dropdown)
    btnLoginDropdown.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
        showLoginOverlay();
    });

    // Dashboard toggle
    btnDashboardToggle.addEventListener('click', () => {
        dashboardOpen = !dashboardOpen;
        dashboardBody.classList.toggle('collapsed', !dashboardOpen);
        btnDashboardToggle.textContent = dashboardOpen ? '▲' : '▼';
        if (dashboardOpen) {
            if (!focusChartInstance) initFocusChart();
            updateDashboard();
        }
    });

    // Ajuda do dashboard
    btnDashboardHelp.addEventListener('click', e => {
        e.stopPropagation();
        dashboardHelpPanel.classList.toggle('hidden');
    });
    btnCloseHelp.addEventListener('click', () => {
        dashboardHelpPanel.classList.add('hidden');
    });

    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentSound = button.getAttribute('data-sound');
            soundButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (!isPaused && currentMode === 'focus') {
                playCurrentSound();
            }
            saveSettings();
        });
    });

    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value;
        audioRain.volume = volume;
        audioCafe.volume = volume;
        audioNoise.volume = volume;
        audioPiano.volume = volume;
        audioNature.volume = volume;
        audioWeightless.volume = volume;
        audioWaves.volume = volume;
        audioDreams.volume = volume;
    });

    // ----- 6. INICIALIZAÇÃO -----
    loadSettings();

    if (isPaused) {
        updateDisplay();
        updateCycleDisplay();
    }
    
    const activeSoundButton = document.querySelector(`.sound-btn[data-sound="${currentSound}"]`);
    if (activeSoundButton) {
        activeSoundButton.classList.add('active');
    }

    // === V1.3: Inicializar novas funcionalidades ===

    // Firebase Auth observer
    if (firebaseAuth) {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                userMode    = 'logged';
                localStorage.setItem(LS_USER_MODE, 'logged');
                hideLoginOverlay();
                updateUserUI(user);
                themeButtons.forEach(btn => btn.classList.remove('locked'));
            } else {
                currentUser = null;
                if (userMode === 'logged') updateUserUI(null);
            }
        });
    }

    // Verificar modo salvo
    const savedUserMode = localStorage.getItem(LS_USER_MODE);
    if (savedUserMode === 'guest') {
        userMode = 'guest';
        hideLoginOverlay();
        updateUserUI(null);
    } else if (savedUserMode === 'logged' && !firebaseAuth) {
        // Firebase não configurado mas ja teve login → tratar como visitante
        hideLoginOverlay();
        updateUserUI(null);
    } else if (!savedUserMode) {
        // Primeira visita → exibir overlay
        showLoginOverlay();
    }

    // Carregar favoritos
    loadFavorites();

    // Streak e Dashboard inicial
    updateStreakDisplay();
    updateDashboard();

    function unlockAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        document.body.removeEventListener('click', unlockAudioContext);
        document.body.removeEventListener('touchstart', unlockAudioContext);
    }

    document.body.addEventListener('click', unlockAudioContext);
    document.body.addEventListener('touchstart', unlockAudioContext);

});