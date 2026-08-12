import { state, getParentFolder, getCurrentFolder, getSelectedItem, getVisibleChildren, selectParentItem, selectCurrentItem, goIn, openItem } from './state.js';
import { renderers } from './renderers/index.js';

export const updateUI = () => {
    const parentFolder = getParentFolder();
    const currentFolder = getCurrentFolder();
    const selectedItem = getSelectedItem();

    renderSidebar(parentFolder);
    renderNavigator(currentFolder);
    renderViewer(selectedItem);
    
    updateBreadcrumb();
    renderOverlays();
    renderStatusBar(selectedItem, currentFolder);
    updatePanelsLayout();
};

const renderSidebar = (parentFolder) => {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    
    if (!parentFolder) return; // Empty left panel at root

    const visibleItems = getVisibleChildren(parentFolder);
    // Which item in the parent is the currentFolder?
    // The index is state.path[state.path.length - 2]
    const activeIndex = state.path.length >= 2 ? state.path[state.path.length - 2] : -1;

    visibleItems.forEach((item, index) => {
        const div = document.createElement('div');
        const isSelected = index === activeIndex;
        
        let bgClass = isSelected ? 'bg-[#3c3836]' : 'hover:bg-[#3c3836]';
        let textClass = isSelected ? 'text-[#ebdbb2] font-bold' : 'text-[#a89984]';
        
        div.className = `cursor-pointer px-2 py-1 flex items-center gap-2 ${bgClass} ${textClass}`;
        div.innerHTML = `
            <span class="text-[#83a598] opacity-75">${item.icon || '📄'}</span>
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">${item.filename || item.name}</span>
        `;
        
        div.addEventListener('click', () => {
            selectParentItem(index);
            updateUI();
        });

        sidebar.appendChild(div);
    });
};

const renderNavigator = (currentFolder) => {
    const nav = document.getElementById('navigator');
    nav.innerHTML = '';
    
    const visibleItems = getVisibleChildren(currentFolder);
    const activeIndex = state.path[state.path.length - 1];

    if (visibleItems.length === 0) {
        nav.innerHTML = `<div class="p-2 text-[#928374] text-xs italic">Empty</div>`;
        return;
    }

    visibleItems.forEach((item, index) => {
        const div = document.createElement('div');
        const isSelected = index === activeIndex;
        
        let bgClass = isSelected ? 'bg-[#3c3836]' : 'hover:bg-[#3c3836]';
        let textClass = isSelected ? 'text-[#fabd2f] font-bold' : 'text-[#ebdbb2]';
        
        div.className = `cursor-pointer px-2 py-1 flex items-center gap-2 ${bgClass} ${textClass}`;
        const num = (index + 1).toString().padStart(2, '0');
        
        // If it's a folder, maybe show a little indicator like Yazi
        const isFolder = item.type === 'folder';
        const folderArrow = isFolder ? '<span class="ml-auto text-[#928374]">▶</span>' : '';

        div.innerHTML = `
            <span class="text-[#504945] text-xs mr-1">${num}</span>
            <span class="text-[#83a598]">${item.icon || '📄'}</span>
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">${item.filename || item.name}</span>
            ${folderArrow}
        `;
        
        div.addEventListener('click', () => {
            selectCurrentItem(index);
            updateUI();
        });
        div.addEventListener('dblclick', () => {
            selectCurrentItem(index);
            openItem();
            updateUI();
        });
        nav.appendChild(div);
    });
};

const renderViewer = (selectedItem) => {
    const viewer = document.getElementById('viewer');
    
    viewer.classList.remove('fade-in');
    void viewer.offsetWidth;
    viewer.classList.add('fade-in');

    if (!selectedItem) {
        if (state.path.length === 1 && state.path[0] === -1) {
            viewer.innerHTML = renderers.root();
        } else {
            viewer.innerHTML = `<div class="p-4 text-[#928374]">// Empty</div>`;
        }
        return;
    }

    // If selected item is a folder, we might preview its contents like Yazi does
    if (selectedItem.type === 'folder') {
        const children = getVisibleChildren(selectedItem);
        let html = `<div class="p-4 font-mono text-[#a89984]"><h3 class="text-[#fabd2f] font-bold mb-4 border-b border-[#504945] pb-2">📁 ${selectedItem.name}</h3>`;
        if (children.length === 0) {
            html += `<div class="text-[#928374]">Empty directory</div>`;
        } else {
            children.forEach(c => {
                html += `<div class="flex gap-2 mb-1"><span class="text-[#83a598] w-6">${c.icon || '📄'}</span><span>${c.filename || c.name}</span></div>`;
            });
        }
        html += `</div>`;
        viewer.innerHTML = html;
        return;
    }

    const renderer = renderers[selectedItem.type];
    if (renderer) {
        viewer.innerHTML = renderer(selectedItem);
    } else {
        viewer.innerHTML = `<div class="p-4 text-[#fb4934]">// Unknown renderer type: ${selectedItem.type}</div>`;
    }
};

const updateBreadcrumb = () => {
    let pathStr = '~/portfolio';
    let current = { children: state.tree };
    
    // reconstruct the path names
    for (let i = 0; i < state.path.length; i++) {
        const index = state.path[i];
        if (index === -1) break;
        const visible = getVisibleChildren(current);
        const item = visible[index];
        if (!item) break;
        pathStr += `/${item.filename || item.name}`;
        current = item;
    }
    document.getElementById('breadcrumb').textContent = pathStr;
};

const renderStatusBar = (selectedItem, currentFolder) => {
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
    let fileName = currentFolder.name || 'portfolio';
    let activePanel = state.fullscreen ? 'viewer' : 'navigator';

    if (selectedItem) {
        fileType = selectedItem.type;
        fileName = selectedItem.filename || selectedItem.name;
    }

    // Add hidden indicator
    if (state.showHidden) {
        activePanel += ' [HIDDEN ON]';
    }

    document.getElementById('status-file').textContent = fileName;
    document.getElementById('status-type').textContent = fileType.toUpperCase();
    document.getElementById('status-panel').textContent = activePanel;
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
                    <div class="text-[#83a598]">Enter / l</div><div>Enter folder / open file</div>
                    <div class="text-[#83a598]">h</div><div>Go back to parent folder</div>
                    <div class="text-[#83a598]">o</div><div>Open URL / Fullscreen</div>
                    <div class="text-[#83a598]">.</div><div>Toggle hidden files</div>
                    <div class="text-[#83a598]">/</div><div>Search in current folder</div>
                    <div class="text-[#83a598]">:</div><div>Command palette</div>
                    <div class="text-[#83a598]">r</div><div>Reload JSON</div>
                    <div class="text-[#83a598]">?</div><div>Help</div>
                    <div class="text-[#83a598]">Esc / q</div><div>Close / Go back</div>
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
            // Mobile: only show navigator
            sidebar.classList.add('hidden');
            viewer.classList.add('hidden');
            navigator.classList.remove('hidden');
            navigator.className = 'w-full flex flex-col bg-[#1d2021] transition-all duration-200';
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
