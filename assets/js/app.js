import { state } from './state.js';
import { loadJson } from './loader.js';
import { initKeyboard } from './keyboard.js';
import { updateUI } from './ui.js';

const initApp = async () => {
    // Load config files
    state.tree = await loadJson('data/tree.json') || [];
    state.systemInfo = await loadJson('data/system.json') || null;

    initKeyboard();
    
    // Initial Render
    updateUI();
};

document.addEventListener('DOMContentLoaded', initApp);
