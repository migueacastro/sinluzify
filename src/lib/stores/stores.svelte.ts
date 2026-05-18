import { browser } from '$app/environment';

class SinLuzStore {
	email = $state(browser ? (localStorage.getItem('sinluzify_email') || '') : '');
	theme = $state(browser ? (localStorage.getItem('sinluzify_theme') || 'light') : 'light');
	jornadaType = $state(browser ? (localStorage.getItem('sinluzify_jornada_type') || 'presencial') : 'presencial');
	startTime = $state(browser ? (localStorage.getItem('sinluzify_start_time') ? Number(localStorage.getItem('sinluzify_start_time')) : null) : null);
	
	// Hardcoded URL - User should replace this value here
	scriptUrl = 'TU_URL_DE_APPS_SCRIPT_AQUI';
	
	toast = $state({ message: '', type: 'info', visible: false });

	// Derived states for reactivity (Svelte 5)
	isWorking = $derived(this.startTime !== null);
	isValidEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email));

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => { localStorage.setItem('sinluzify_email', this.email); });
				$effect(() => { localStorage.setItem('sinluzify_theme', this.theme); });
				$effect(() => { localStorage.setItem('sinluzify_jornada_type', this.jornadaType); });
				$effect(() => {
					if (this.startTime !== null) {
						localStorage.setItem('sinluzify_start_time', this.startTime.toString());
					} else {
						localStorage.removeItem('sinluzify_start_time');
					}
				});
			});
		}
	}

	showToast(message, type = 'info', duration = 3000) {
		this.toast = { message, type, visible: true };
		setTimeout(() => {
			this.toast.visible = false;
		}, duration);
	}

	start(type) {
		this.startTime = Date.now();
		this.jornadaType = type;
	}

	stop() {
		this.startTime = null;
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
	}
}

export const sl = new SinLuzStore();
