import { state, selectSidebar, selectNavigator, openItem } from './state.js';
import { renderers } from './renderers/index.js';

export const updateUI = () => {
    let currentTree = state.tree;
    if (state.searchQuery) {
        currentTree = currentTree.filter(item => item.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
    }

    renderSidebar(currentTree);
    
    const parentFolder = state.sidebarIndex >= 0 ? currentTree[state.sidebarIndex] : null;
    if (parentFolder) {
        renderNavigator(parentFolder);
        renderViewer(parentFolder);
        updateBreadcrumb(parentFolder);
    } else {
        document.getElementById('navigator').innerHTML = '';
        renderViewer(null);
        document.getElementById('breadcrumb').textContent = '~/portfolio';
    }

    renderOverlays();
    renderStatusBar(parentFolder, currentTree);
    updatePanelsLayout();
};

const renderSidebar = (currentTree) => {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    
    currentTree.forEach((item, index) => {
        const div = document.createElement('div');
        const isSelected = index === state.sidebarIndex;
        const isActivePanel = state.activePanel === 'sidebar';
        
        let bgClass = isSelected ? (isActivePanel ? 'bg-[#3c3836]' : 'bg-[#3c3836]') : 'hover:bg-[#3c3836]';
        let textClass = isSelected ? 'text-[#fabd2f]' : 'text-[#ebdbb2]';
        
        div.className = `cursor-pointer px-2 py-1 flex items-center gap-2 ${bgClass} ${textClass}`;
        div.innerHTML = `
            <span class="text-[#83a598]">${item.icon || '📄'}</span>
            <span>${item.name}</span>
        `;
        
        // Single source of truth for clicks
        div.addEventListener('click', () => {
            selectSidebar(index);
            updateUI();
        });
        div.addEventListener('dblclick', () => {
            selectSidebar(index);
            openItem();
            updateUI();
        });

        sidebar.appendChild(div);
    });
};

const renderNavigator = (parentFolder) => {
    const nav = document.getElementById('navigator');
    nav.innerHTML = '';
    
    if (parentFolder.type !== 'folder' || !parentFolder.children) {
        const div = document.createElement('div');
        const isSelected = state.navigatorIndex === 0;
        const isActivePanel = state.activePanel === 'navigator';
        
        let bgClass = isSelected ? 'bg-[#3c3836]' : 'hover:bg-[#3c3836]';
        let textClass = isSelected ? (isActivePanel ? 'text-[#fabd2f]' : 'text-[#ebdbb2]') : 'text-[#ebdbb2]';
        
        div.className = `cursor-pointer px-2 py-1 flex items-center gap-2 ${bgClass} ${textClass}`;
        div.innerHTML = `
            <span class="text-[#83a598]">${parentFolder.icon || '📄'}</span>
            <span>${parentFolder.filename || parentFolder.name}</span>
        `;
        div.addEventListener('click', () => {
            selectSidebar(state.sidebarIndex); // Ensure sidebar is active item
            selectNavigator(0);
            updateUI();
        });
        div.addEventListener('dblclick', () => {
            selectNavigator(0);
            openItem();
            updateUI();
        });
        nav.appendChild(div);
        return;
    }

    parentFolder.children.forEach((item, index) => {
        const div = document.createElement('div');
        const isSelected = index === state.navigatorIndex;
        const isActivePanel = state.activePanel === 'navigator';
        
        let bgClass = isSelected ? 'bg-[#3c3836]' : 'hover:bg-[#3c3836]';
        let textClass = isSelected ? (isActivePanel ? 'text-[#fabd2f]' : 'text-[#ebdbb2]') : 'text-[#ebdbb2]';
        
        div.className = `cursor-pointer px-2 py-1 flex items-center gap-2 ${bgClass} ${textClass}`;
        const num = (index + 1).toString().padStart(2, '0');
        div.innerHTML = `
            <span class="text-[#504945] text-xs mr-1">${num}</span>
            <span class="text-[#83a598]">${item.icon || '📄'}</span>
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">${item.filename || item.name}</span>
        `;
        div.addEventListener('click', () => {
            selectSidebar(state.sidebarIndex);
            selectNavigator(index);
            updateUI();
        });
        div.addEventListener('dblclick', () => {
            selectNavigator(index);
            openItem();
            updateUI();
        });
        nav.appendChild(div);
    });
};

const renderViewer = (parentFolder) => {
    const viewer = document.getElementById('viewer');
    
    viewer.classList.remove('fade-in');
    void viewer.offsetWidth;
    viewer.classList.add('fade-in');

    if (state.sidebarIndex === -1) {
        viewer.innerHTML = renderers.root();
        return;
    }

    let file = null;
    if (parentFolder.type !== 'folder') {
        file = parentFolder;
    } else if (parentFolder.children && parentFolder.children.length > 0) {
        file = parentFolder.children[state.navigatorIndex];
    }

    if (!file) {
        viewer.innerHTML = `<div class="p-4 text-[#928374]">// No file selected</div>`;
        return;
    }

    const renderer = renderers[file.type];
    if (renderer) {
        viewer.innerHTML = renderer(file);
    } else {
        viewer.innerHTML = `<div class="p-4 text-[#fb4934]">// Unknown renderer type: ${file.type}</div>`;
    }
};

const updateBreadcrumb = (parentFolder) => {
    let path = '~/portfolio';
    if (state.sidebarIndex !== -1) {
        path += `/${parentFolder.name.toLowerCase()}`;
        if (parentFolder.children && parentFolder.children.length > 0) {
            const child = parentFolder.children[state.navigatorIndex];
            if (child) path += `/${child.filename || child.name}`;
        } else if (parentFolder.filename) {
            // Already appended folder name, but since it's a file, let's replace or adjust
            // If it's a root file like Profile -> profile.rs
            path = `~/portfolio/${parentFolder.filename}`;
        }
    }
    document.getElementById('breadcrumb').textContent = path;
};

const renderStatusBar = (parentFolder, currentTree) => {
    const modeIndicator = document.getElementById('status-mode');
    if (state.commandMode) {
        modeIndicator.textContent = 'COMMAND';
        modeIndicator.className = 'px-3 py-1 bg-[#fb4934] text-[#1d2021] font-bold';
    } else if (state.searchMode) {
        modeIndicator.textContent = 'SEARCH';
        modeIndicator.className = 'px-3 py-1 bg-[#83a598] text-[#1d2021] font-bold';
    } else {
        modeIndicator.textContent = 'NORMAL';
        modeIndicator.className = 'px-3 py-1 bg-[#b8bb26] text-[#1d2021] font-bold';
    }

    let fileType = 'dir';
    let fileName = 'portfolio';

    if (state.sidebarIndex === -1) {
        fileType = 'dir';
        fileName = 'portfolio';
    } else if (state.activePanel === 'navigator') {
        const file = parentFolder.children ? parentFolder.children[state.navigatorIndex] : parentFolder;
        if (file) {
            fileType = file.type;
            fileName = file.filename || file.name;
        }
    } else if (state.activePanel === 'sidebar' && parentFolder) {
        fileType = parentFolder.type;
        fileName = parentFolder.filename || parentFolder.name;
    }

    document.getElementById('status-file').textContent = fileName;
    document.getElementById('status-type').textContent = fileType.toUpperCase();
    document.getElementById('status-panel').textContent = state.activePanel;
};

const renderOverlays = () => {
    const overlay = document.getElementById('overlay');
    
    if (state.helpVisible) {
        overlay.classList.remove('hidden');
        overlay.classList.add('backdrop-blur-sm');
        overlay.innerHTML = `
            <div class="bg-[#282828]/95 border border-[#504945] p-6 rounded shadow-xl max-w-md w-full font-mono text-[#ebdbb2] fade-in">
                <h2 class="text-xl font-bold text-[#fabd2f] mb-4 border-b border-[#504945] pb-2">KEYBINDS</h2>
                <div class="grid grid-cols-2 gap-y-2 text-sm">
                    <div class="text-[#83a598]">↑ ↓ ← →</div><div>Navigation</div>
                    <div class="text-[#83a598]">h j k l</div><div>Vim Navigation</div>
                    <div class="text-[#83a598]">Enter</div><div>Open folder / file</div>
                    <div class="text-[#83a598]">o</div><div>Open / Fullscreen</div>
                    <div class="text-[#83a598]">/</div><div>Search</div>
                    <div class="text-[#83a598]">:</div><div>Command</div>
                    <div class="text-[#83a598]">r</div><div>Reload JSON</div>
                    <div class="text-[#83a598]">?</div><div>Help</div>
                    <div class="text-[#83a598]">Esc / q</div><div>Close Overlay</div>
                </div>
            </div>
        `;
        return;
    }

    overlay.classList.remove('backdrop-blur-sm');

    if (state.searchMode || state.commandMode) {
        overlay.classList.remove('hidden');
        const prefix = state.searchMode ? '/' : ':';
        const query = state.searchMode ? state.searchQuery : state.commandQuery;
        
        overlay.innerHTML = `
            <div class="absolute bottom-10 left-4 bg-[#282828] border border-[#504945] px-4 py-2 rounded shadow-lg flex gap-2 font-mono text-[#ebdbb2] min-w-[300px] fade-in">
                <span class="text-[#b8bb26] font-bold">${prefix}</span>
                <span class="flex-1">${escapeHtml(query)}<span class="animate-pulse bg-[#a89984] w-2 h-4 inline-block align-middle ml-1"></span></span>
            </div>
        `;
        return;
    }

    overlay.classList.add('hidden');
    overlay.innerHTML = '';
};

const updatePanelsLayout = () => {
    const sidebar = document.getElementById('sidebar-panel');
    const navigator = document.getElementById('navigator-panel');
    const viewer = document.getElementById('viewer-panel');

    sidebar.className = 'w-full md:w-1/4 lg:w-1/5 border-r border-[#504945] flex flex-col bg-[#282828] transition-all duration-200';
    navigator.className = 'w-full md:w-1/3 lg:w-1/4 border-r border-[#504945] flex flex-col bg-[#1d2021] transition-all duration-200';
    viewer.className = 'flex-1 flex flex-col bg-[#1d2021] min-w-0 transition-all duration-200';

    if (state.fullscreen) {
        sidebar.classList.add('hidden');
        navigator.classList.add('hidden');
        viewer.classList.replace('flex-1', 'w-full');
    } else {
        if (window.innerWidth < 768) {
            sidebar.classList.add('hidden');
            navigator.classList.add('hidden');
            viewer.classList.add('hidden');

            if (state.activePanel === 'sidebar') sidebar.classList.remove('hidden');
            if (state.activePanel === 'navigator') navigator.classList.remove('hidden');
            if (state.activePanel === 'viewer') viewer.classList.remove('hidden');
        } else {
            sidebar.classList.remove('hidden');
            navigator.classList.remove('hidden');
            viewer.classList.remove('hidden');
        }
    }
};

window.addEventListener('resize', () => updatePanelsLayout());

const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};
