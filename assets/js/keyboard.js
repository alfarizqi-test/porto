import { state, goIn, goOut, openItem, getCurrentFolder, getVisibleChildren } from './state.js';
import { updateUI } from './ui.js';

export const initKeyboard = () => {
    document.addEventListener('keydown', handleKeyDown);
};

const handleKeyDown = (e) => {
    if (state.searchMode || state.commandMode) {
        handleInputMode(e);
        return;
    }

    if (state.helpVisible) {
        if (e.key === 'Escape' || e.key === 'q' || e.key === '?') {
            state.helpVisible = false;
            updateUI();
        }
        return;
    }

    let action = null;
    switch(e.key) {
        case 'ArrowUp':
        case 'k': action = 'up'; break;
        case 'ArrowDown':
        case 'j': action = 'down'; break;
        case 'ArrowLeft':
        case 'h': action = 'left'; break;
        case 'ArrowRight':
        case 'l': action = 'right'; break;
        case 'Enter': action = 'open'; break;
        case 'Escape': action = 'esc'; break;
        case 'g': action = 'top'; break;
        case 'G': action = 'bottom'; break;
        case 'Home': action = 'top'; break;
        case 'End': action = 'bottom'; break;
        case 'o': action = 'fullscreen'; break;
        case '.': action = 'toggleHidden'; break;
        case '/': 
            if (e.shiftKey) action = 'help'; 
            else action = 'search'; 
            break;
        case '?': action = 'help'; break;
        case ':': action = 'command'; break;
        case 'r': action = 'reload'; break;
        case 'q': action = 'esc'; break;
    }

    if (!action) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }

    executeAction(action);
};

const executeAction = (action) => {
    const currentFolder = getCurrentFolder();
    const visibleItems = getVisibleChildren(currentFolder);
    const currentIndex = state.path[state.path.length - 1];

    switch(action) {
        case 'up':
            if (currentIndex > (state.path.length === 1 ? -1 : 0)) {
                state.path[state.path.length - 1]--;
            }
            break;
        case 'down':
            if (currentIndex < visibleItems.length - 1) {
                state.path[state.path.length - 1]++;
            }
            break;
        case 'left':
            goOut();
            break;
        case 'right':
            goIn();
            break;
        case 'open':
        case 'fullscreen':
            openItem();
            break;
        case 'top':
            state.path[state.path.length - 1] = state.path.length === 1 ? -1 : 0;
            break;
        case 'bottom':
            state.path[state.path.length - 1] = visibleItems.length > 0 ? visibleItems.length - 1 : (state.path.length === 1 ? -1 : 0);
            break;
        case 'esc':
            if (state.fullscreen) {
                state.fullscreen = false;
            } else if (state.path.length > 1) {
                goOut();
            }
            break;
        case 'toggleHidden':
            state.showHidden = !state.showHidden;
            // Reset cursor to prevent out of bounds when toggling
            state.path[state.path.length - 1] = state.path.length === 1 ? -1 : 0;
            break;
        case 'help':
            state.helpVisible = true;
            break;
        case 'search':
            state.searchMode = true;
            state.searchQuery = "";
            state.path[state.path.length - 1] = 0; // select first when searching
            break;
        case 'command':
            state.commandMode = true;
            state.commandQuery = "";
            break;
        case 'reload':
            location.reload();
            break;
    }

    updateUI();
};

const handleInputMode = (e) => {
    if (e.key === 'Escape') {
        state.searchMode = false;
        state.commandMode = false;
        state.searchQuery = "";
        updateUI();
        return;
    }

    if (e.key === 'Enter') {
        if (state.commandMode) {
            executeCommand(state.commandQuery);
        } else if (state.searchMode) {
            state.searchMode = false;
        }
        state.commandMode = false;
        updateUI();
        return;
    }

    if (e.key === 'Backspace') {
        if (state.searchMode) state.searchQuery = state.searchQuery.slice(0, -1);
        if (state.commandMode) state.commandQuery = state.commandQuery.slice(0, -1);
        
        if (state.searchMode) state.path[state.path.length - 1] = 0;
        updateUI();
        return;
    }

    if (e.key.length === 1) {
        if (state.searchMode) {
            state.searchQuery += e.key;
            state.path[state.path.length - 1] = 0;
        }
        if (state.commandMode) state.commandQuery += e.key;
        updateUI();
    }
};

const executeCommand = (cmd) => {
    switch(cmd.trim()) {
        case 'reload': location.reload(); break;
        case 'help': state.helpVisible = true; break;
        case 'clear':
            console.clear();
            break;
    }
};
