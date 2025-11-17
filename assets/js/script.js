// Variável global para o Contexto de Áudio
let audioContext = null;

// Chaves para o Local Storage (facilita a gestão dos dados)
const LS_TIMES = 'pomodoroTimes';
const LS_SOUND = 'pomodoroSound';
const LS_CYCLE = 'pomodoroCycle';

document.addEventListener('DOMContentLoaded', () => {

    // ----- 1. PEGAR ELEMENTOS DO HTML (DOM) -----
    
    const display = document.getElementById('timer-display');
    const btnStartPause = document.getElementById('btn-start-pause');
    const btnReset = document.getElementById('btn-reset');
    const focusInput = document.getElementById('focus-input');
    const shortInput = document.getElementById('short-input');
    const longInput = document.getElementById('long-input');
    const timeInputs = document.querySelectorAll('.time-config input');
    const cycleCounterDisplay = document.getElementById('cycle-counter');
    const soundButtons = document.querySelectorAll('.sound-btn');
    const volumeSlider = document.getElementById('volume-slider');

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


    // ----- 3. FUNÇÕES HELPER (AJUDANTES) -----
    
    function getTimesFromInputs() {
        return {
            focus: parseInt(focusInput.value, 10) * 60,
            short: parseInt(shortInput.value, 10) * 60,
            long: parseInt(longInput.value, 10) * 60,
        };
    }

    function saveSettings() {
        const times = {
            focus: focusInput.value,
            short: shortInput.value,
            long: longInput.value
        };
        localStorage.setItem(LS_TIMES, JSON.stringify(times));
        localStorage.setItem(LS_SOUND, currentSound);
        localStorage.setItem(LS_CYCLE, currentCycle);
    }
    
    function loadSettings() {
        const savedTimes = JSON.parse(localStorage.getItem(LS_TIMES));
        if (savedTimes) {
            focusInput.value = savedTimes.focus;
            shortInput.value = savedTimes.short;
            longInput.value = savedTimes.long;
        }

        const savedSound = localStorage.getItem(LS_SOUND);
        const savedCycle = parseInt(localStorage.getItem(LS_CYCLE), 10);
        
        if (savedSound) {
            currentSound = savedSound;
            soundButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.sound-btn[data-sound="${savedSound}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
        
        if (!isNaN(savedCycle)) {
            currentCycle = savedCycle;
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

    // ----- 4. O TIMER (O CORAÇÃO - Lógica do Pomodoro) -----

    function countdown() {
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            audioAlert.play();
            stopAllSounds();
            isPaused = true; 

            if (currentMode === 'focus') {
                currentCycle++;
                updateCycleDisplay(); // ✅ CORREÇÃO 1: Atualiza o display após incrementar
                
                if (currentCycle >= 4) {
                    currentCycle = 0;
                    updateCycleDisplay(); // ✅ CORREÇÃO 2: Atualiza o display após zerar o contador
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
            switchMode(currentMode); 
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
            if (input.getAttribute('data-mode') === currentMode) {
                switchMode(currentMode);
            }
            saveSettings();
        });
    });


    // Botões de SOM
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

    // Controle de VOLUME
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
    document.querySelector(`.sound-btn[data-sound="${currentSound}"]`).classList.add('active');


    // ----- 7. TRUQUE PARA DESBLOQUEAR ÁUDIO -----
    
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