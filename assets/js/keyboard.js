import { state, selectSidebar, selectNavigator, openItem } from './state.js';
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
    let currentTree = state.tree;
    if (state.searchQuery) {
        currentTree = currentTree.filter(item => item.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
    }

    const parentFolder = state.sidebarIndex >= 0 ? currentTree[state.sidebarIndex] : null;
    const children = parentFolder ? (parentFolder.children || []) : [];

    switch(action) {
        case 'up':
            if (state.activePanel === 'sidebar') {
                selectSidebar(Math.max(-1, state.sidebarIndex - 1));
            } else if (state.activePanel === 'navigator') {
                selectNavigator(Math.max(0, state.navigatorIndex - 1));
            }
            break;
        case 'down':
            if (state.activePanel === 'sidebar') {
                selectSidebar(Math.min(currentTree.length - 1, state.sidebarIndex + 1));
            } else if (state.activePanel === 'navigator') {
                selectNavigator(Math.min(children.length - 1, state.navigatorIndex + 1));
            }
            break;
        case 'left':
            if (state.activePanel === 'navigator') {
                selectSidebar(state.sidebarIndex);
            } else if (state.activePanel === 'sidebar') {
                selectSidebar(-1);
            }
            break;
        case 'right':
            if (state.activePanel === 'sidebar') {
                if (parentFolder && parentFolder.type === 'folder' && children.length > 0) {
                    selectNavigator(0);
                }
            }
            break;
        case 'open':
        case 'fullscreen':
            openItem();
            break;
        case 'top':
            if (state.activePanel === 'sidebar') selectSidebar(0);
            else if (state.activePanel === 'navigator') selectNavigator(0);
            break;
        case 'bottom':
            if (state.activePanel === 'sidebar') selectSidebar(currentTree.length - 1);
            else if (state.activePanel === 'navigator') selectNavigator(children.length - 1);
            break;
        case 'esc':
            if (state.fullscreen) {
                state.fullscreen = false;
            } else if (state.activePanel === 'navigator') {
                selectSidebar(state.sidebarIndex);
            }
            break;
        case 'help':
            state.helpVisible = true;
            break;
        case 'search':
            state.searchMode = true;
            state.searchQuery = "";
            selectSidebar(0);
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
        
        if (state.searchMode) selectSidebar(0);
        updateUI();
        return;
    }

    if (e.key.length === 1) {
        if (state.searchMode) {
            state.searchQuery += e.key;
            selectSidebar(0);
        }
        if (state.commandMode) state.commandQuery += e.key;
        updateUI();
    }
};

const executeCommand = (cmd) => {
    switch(cmd.trim()) {
        case 'reload': location.reload(); break;
        case 'help': state.helpVisible = true; break;
        case 'top': 
            selectSidebar(0);
            break;
        case 'clear':
            console.clear();
            break;
    }
};
