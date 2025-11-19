// Variável global para o Contexto de Áudio
let audioContext = null;

// Chaves para o Local Storage
const LS_TIMES = 'pomodoroTimes';
const LS_SOUND = 'pomodoroSound';
const LS_CYCLE = 'pomodoroCycle';
const LS_THEME = 'pomodoroTheme'; 
const LS_FOCUS_H = 'pomodoroFocusH'; // NOVO: Chave para foco em Horas
const LS_FOCUS_M = 'pomodoroFocusM'; // NOVO: Chave para foco em Minutos

document.addEventListener('DOMContentLoaded', () => {

    // ----- 1. PEGAR ELEMENTOS DO HTML (DOM) -----
    
    const display = document.getElementById('timer-display');
    const btnStartPause = document.getElementById('btn-start-pause');
    const btnReset = document.getElementById('btn-reset');
    
    // NOVOS INPUTS DE FOCO
    const focusHourInput = document.getElementById('focus-hour-input'); 
    const focusMinInput = document.getElementById('focus-min-input');
    
    const shortInput = document.getElementById('short-input');
    const longInput = document.getElementById('long-input');
    
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
    const audioAlert = document.getElementById('audio-alert');
    
    // ----- 2. VARIÁVEIS DE ESTADO (O CÉREBRO) -----
    
    let currentMode = 'focus';
    let currentTime = 0;
    let timerInterval = null;
    let isPaused = true;
    let currentSound = 'none';
    let currentAudio = null;
    let currentCycle = 0;
    let currentTheme = 'dark';


    // ----- 3. FUNÇÕES HELPER (AJUDANTES) -----
    
    function getTimesFromInputs() {
        const focusHours = parseInt(focusHourInput.value, 10) * 3600; // Horas em segundos
        const focusMinutes = parseInt(focusMinInput.value, 10) * 60; // Minutos em segundos
        
        return {
            // Soma as horas e minutos
            focus: focusHours + focusMinutes,
            // Pausas permanecem em minutos * 60
            short: parseInt(shortInput.value, 10) * 60,
            long: parseInt(longInput.value, 10) * 60,
        };
    }

    function saveSettings() {
        // Salva foco separado em H e M
        localStorage.setItem(LS_FOCUS_H, focusHourInput.value);
        localStorage.setItem(LS_FOCUS_M, focusMinInput.value);
        
        const breakTimes = {
            short: shortInput.value,
            long: longInput.value
        };
        localStorage.setItem(LS_TIMES, JSON.stringify(breakTimes)); // Pausas agrupadas
        
        localStorage.setItem(LS_SOUND, currentSound);
        localStorage.setItem(LS_CYCLE, currentCycle);
        localStorage.setItem(LS_THEME, currentTheme);
    }
    
    function loadSettings() {
        const savedFocusH = localStorage.getItem(LS_FOCUS_H);
        const savedFocusM = localStorage.getItem(LS_FOCUS_M);
        
        // Carrega o Foco
        if (savedFocusH) focusHourInput.value = savedFocusH;
        if (savedFocusM) focusMinInput.value = savedFocusM;

        const savedBreakTimes = JSON.parse(localStorage.getItem(LS_TIMES));
        // Carrega as Pausas
        if (savedBreakTimes) {
            shortInput.value = savedBreakTimes.short;
            longInput.value = savedBreakTimes.long;
        }

        const savedSound = localStorage.getItem(LS_SOUND);
        const savedCycle = parseInt(localStorage.getItem(LS_CYCLE), 10);
        const savedTheme = localStorage.getItem(LS_THEME);

        if (savedSound) {
            currentSound = savedSound;
        }
        
        if (!isNaN(savedCycle)) {
            currentCycle = savedCycle;
        }

        // Aplica o tema salvo
        if (savedTheme) {
            currentTheme = savedTheme;
            document.body.classList.toggle('light-mode', currentTheme === 'light');
        }
    }

    function updateCycleDisplay() {
        cycleCounterDisplay.textContent = `Ciclo: ${currentCycle} de 4`;
    }

    function updateDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${display.textContent} - FocoWave`;
        
        btnStartPause.textContent = isPaused ? `Iniciar ${currentMode === 'focus' ? 'Foco' : 'Pausa'}` : 'Pausar';
        document.body.setAttribute('data-mode', currentMode);
    }
    
    function stopAllSounds() {
        audioRain.pause();
        audioCafe.pause();
        audioNoise.pause();
        audioPiano.pause();
        audioNature.pause();
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

        isPaused = true;
        timerInterval = clearInterval(timerInterval);

        updateDisplay();
        stopAllSounds();
    }
    
    function initTimer() {
        currentMode = 'focus';
        currentTime = getTimesFromInputs().focus;
        updateDisplay();
        updateCycleDisplay();
    }

    // ----- 4. O TIMER (Lógica do Pomodoro) -----

    function countdown() {
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            audioAlert.play();
            stopAllSounds();
            isPaused = true;    

            if (currentMode === 'focus') {
                currentCycle++;
                updateCycleDisplay();
                
                if (currentCycle >= 4) {
                    currentCycle = 0;
                    updateCycleDisplay();
                    switchMode('long');
                } else {
                    switchMode('short');
                }
            } else {
                switchMode('focus');
            }
            
            saveSettings();
            return;
        }

        currentTime--;
        updateDisplay();
    }

    // ----- 5. EVENT LISTENERS (OS "OUVIDOS") -----

    btnStartPause.addEventListener('click', () => {
        if (isPaused) {
            isPaused = false;
            // Garante que o tempo de foco seja maior que 0
            if (currentTime <= 0) {
                 initTimer(); // Reinicializa com os inputs atuais
            }
            timerInterval = setInterval(countdown, 1000);

            if (currentMode === 'focus') {
                playCurrentSound();
            }

        } else {
            isPaused = true;
            clearInterval(timerInterval);
            stopAllSounds();
            saveSettings();
        }
        updateDisplay();
    });

    btnReset.addEventListener('click', () => {
        isPaused = true;
        clearInterval(timerInterval);
        stopAllSounds();
        currentCycle = 0;
        
        initTimer();
        saveSettings();
    });

    // Inputs de Tempo (Configurável)
    timeInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Verifica se o input mudado é de horas ou minutos de foco
            const inputMode = input.getAttribute('data-mode');
            
            if (inputMode === 'focus-h' || inputMode === 'focus-m') {
                if (currentMode === 'focus') {
                    // Se o foco é alterado, reseta o tempo de foco para o novo valor
                    switchMode('focus');
                }
            } else if (inputMode === currentMode) {
                // Se pausa é alterada no modo pausa, reseta
                switchMode(currentMode);
            }

            saveSettings();
        });
    });

    // Listener para o botão de alternância de Tema
    btnThemeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        currentTheme = isLight ? 'light' : 'dark';
        saveSettings();
    });


    // Botões de SOM e Controle de VOLUME (Mantidos)
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
    });

    // ----- 6. INICIALIZAÇÃO -----
    loadSettings();
    initTimer();
    const activeSoundButton = document.querySelector(`.sound-btn[data-sound="${currentSound}"]`);
    if (activeSoundButton) {
        activeSoundButton.classList.add('active');
    }

    // ----- 7. TRUQUE PARA DESBLOQUEAR ÁUDIO (Mantido) -----
    
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
