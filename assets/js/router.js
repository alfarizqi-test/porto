import { loadJson } from './loader.js';
import { renderSidebar, renderNavigator, renderViewer, updateStatus, updateMobileTabs } from './ui.js';

let sidebarData = [];

export const initRouter = async () => {
    updateStatus('init', 'Loading config...');
    sidebarData = await loadJson('sidebar');
    
    window.addEventListener('hashchange', handleRoute);
    
    // Initial route
    handleRoute();
};

export const handleRoute = async () => {
    let hash = window.location.hash.substring(1);
    if (!hash) {
        hash = 'profile'; // Default route
    }

    updateStatus(hash, 'Loading...');
    
    renderSidebar(sidebarData, hash);
    
    const data = await loadJson(hash);
    
    renderNavigator(hash, data);
    renderViewer(hash, data);
    
    updateStatus(hash, 'JSON Loaded');

    // On mobile, automatically switch to viewer after selecting a menu item
    // Only if it was triggered by a hash change from sidebar
    if (window.innerWidth < 768) {
        updateMobileTabs('viewer');
    }
};
