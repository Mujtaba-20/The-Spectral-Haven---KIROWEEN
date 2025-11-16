// Router - Handle page navigation and transitions

export class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.currentRoute = '/';
    }

    init() {
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        // Handle initial route
        this.handleRoute();
    }

    register(path, pageComponent) {
        this.routes[path] = pageComponent;
    }

    navigate(path) {
        if (this.currentRoute === path) {
            return; // Already on this page
        }

        this.currentRoute = path;
        
        // Update URL without reload
        window.history.pushState({ path }, '', `#${path}`);
        
        // Trigger transition and page change
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        
        // Update current route
        this.currentRoute = hash;
        
        const PageComponent = this.routes[hash] || this.routes['/'];
        
        if (!PageComponent) {
            console.error(`No component registered for route: ${hash}`);
            return;
        }

        // Use transition manager if available
        if (window.transitionManager) {
            window.transitionManager.start(() => {
                this.renderPage(PageComponent, hash);
            });
        } else {
            this.renderPage(PageComponent, hash);
        }
    }

    renderPage(PageComponent, route) {
        // Destroy current page
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            this.currentPage.destroy();
        }

        // Update active nav icon
        this.updateActiveNav(route);

        // Create and render new page
        this.currentPage = new PageComponent();
        this.currentPage.render();
    }

    updateActiveNav(route) {
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icon => {
            const iconRoute = icon.getAttribute('data-route');
            if (iconRoute === route) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }
}
