<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { sl } from '$lib/stores/stores.svelte';

	let { children } = $props();

	// Global theme management
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', sl.theme);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-200 transition-colors duration-300">
	<div class="navbar bg-base-100 shadow-md px-4 md:px-8">
		<div class="flex-1">
			<a href="/" class="text-2xl font-black text-primary tracking-tighter">SinLuzify</a>
		</div>
		<div class="flex-none">
			<button class="btn btn-ghost btn-circle text-xl" onclick={() => sl.toggleTheme()}>
				{sl.theme === 'light' ? '🌙' : '☀️'}
			</button>
		</div>
	</div>
	
	<main>
		{@render children()}
	</main>

	{#if sl.toast.visible}
		<div class="toast toast-bottom toast-center z-50">
			<div class="alert alert-{sl.toast.type} shadow-lg">
				<span>{sl.toast.message}</span>
			</div>
		</div>
	{/if}
</div>
