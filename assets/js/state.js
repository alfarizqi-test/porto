export const state = {
    tree: [],
    path: [-1], // Array of visible indices. [-1] means at root, nothing selected.
    showHidden: false,
    fullscreen: false,
    searchMode: false,
    commandMode: false,
    searchQuery: "",
    commandQuery: "",
    helpVisible: false,
    systemInfo: null,
};

export const getVisibleChildren = (folderItem) => {
    const children = folderItem ? (folderItem.children || []) : state.tree;
    let visible = children;
    
    if (!state.showHidden) {
        visible = visible.filter(c => {
            const name = c.filename || c.name || '';
            return !name.startsWith('.');
        });
    }
    
    // Only apply search filter to the current viewing folder
    if (state.searchQuery && folderItem === getCurrentFolder()) {
        const query = state.searchQuery.toLowerCase();
        visible = visible.filter(c => (c.filename || c.name || '').toLowerCase().includes(query));
    }
    
    return visible;
};

export const getItemAt = (pathArray) => {
    let current = { children: state.tree };
    for (let i = 0; i < pathArray.length; i++) {
        const index = pathArray[i];
        if (index === -1) return null;
        const visible = getVisibleChildren(current);
        current = visible[index];
        if (!current) return null;
    }
    return current;
};

export const getCurrentFolder = () => {
    if (state.path.length === 1) return { name: 'portfolio', type: 'folder', children: state.tree };
    return getItemAt(state.path.slice(0, -1));
};

export const getParentFolder = () => {
    if (state.path.length <= 1) return null;
    if (state.path.length === 2) return { name: 'portfolio', type: 'folder', children: state.tree };
    return getItemAt(state.path.slice(0, -2));
};

export const getSelectedItem = () => {
    return getItemAt(state.path);
};

export const selectParentItem = (index) => {
    if (state.path.length > 1) {
        state.path.pop();
        state.path[state.path.length - 1] = index;
    }
};

export const selectCurrentItem = (index) => {
    state.path[state.path.length - 1] = index;
};

export const goIn = () => {
    const item = getSelectedItem();
    if (item && item.type === 'folder') {
        state.path.push(0);
        state.searchMode = false;
        state.searchQuery = "";
    }
};

export const goOut = () => {
    if (state.path.length > 1) {
        state.path.pop();
        state.searchMode = false;
        state.searchQuery = "";
    } else if (state.path.length === 1 && state.path[0] !== -1) {
        state.path[0] = -1;
    }
};

export const openItem = () => {
    const item = getSelectedItem();
    if (item) {
        if (item.type === 'folder') {
            goIn();
        } else if (item.type === 'url') {
            window.open(item.url, '_blank');
        } else {
            state.fullscreen = !state.fullscreen;
        }
    }
};
