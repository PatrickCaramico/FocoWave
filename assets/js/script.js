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
const LS_LANG = 'pomodoroLang'; // NOVO

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
    
    const btnThemeToggle = document.getElementById('btn-theme-toggle');

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
            currentTheme = savedTheme;
            document.body.classList.toggle('light-mode', currentTheme === 'light');
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

    btnThemeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        currentTheme = isLight ? 'light' : 'dark';
        saveSettings();
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
