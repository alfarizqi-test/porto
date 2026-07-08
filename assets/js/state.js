export const state = {
    tree: [],
    activePanel: "sidebar", // sidebar | navigator | viewer
    sidebarIndex: -1, // -1 represents the root 'portfolio/' itself
    navigatorIndex: 0,
    fullscreen: false,
    searchMode: false,
    commandMode: false,
    searchQuery: "",
    commandQuery: "",
    currentFolder: "/",
    currentFile: null,
    helpVisible: false,
    systemInfo: null,
    showHidden: false,
};

export const selectSidebar = (index) => {
    state.sidebarIndex = index;
    state.navigatorIndex = 0;
    state.activePanel = 'sidebar';
};

export const selectNavigator = (index) => {
    state.navigatorIndex = index;
    state.activePanel = 'navigator';
};

export const openItem = () => {
    let file = null;
    if (state.activePanel === 'sidebar') {
        if (state.sidebarIndex === -1) return;
        const item = state.tree[state.sidebarIndex];
        if (item.type === 'folder') {
            state.activePanel = 'navigator';
            return;
        }
        file = item;
    } else if (state.activePanel === 'navigator') {
        const parent = state.tree[state.sidebarIndex];
        if (parent && parent.children) {
            file = parent.children[state.navigatorIndex];
        }
    }

    if (file) {
        if (file.type === 'url') {
            window.open(file.url, '_blank');
        } else {
            state.fullscreen = !state.fullscreen;
        }
    }
};
