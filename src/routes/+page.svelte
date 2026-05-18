<script lang="ts">
	import { sl } from '$lib/stores/stores.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	// Reactive state for the timer display
	let elapsedTime = $state(0);

	// Timer logic and Title update
	$effect(() => {
		let interval: ReturnType<typeof setInterval>;
		if (sl.isWorking && sl.startTime) {
			interval = setInterval(() => {
				elapsedTime = Math.floor((Date.now() - sl.startTime!) / 1000);
				document.title = `${formatTime(elapsedTime)} - SinLuzify`;
			}, 1000);
		} else {
			document.title = 'SinLuzify';
			elapsedTime = 0;
		}
		return () => clearInterval(interval);
	});

	function formatTime(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	const handleEnhance: SubmitFunction = ({ formData, submitter }) => {
		const action = (submitter as HTMLButtonElement)?.value;
		
		// Fill fields for the server action
		formData.set('email', sl.email);
		formData.set('action', action || '');
		formData.set('jornadaType', sl.jornadaType);
		formData.set('timestamp', new Date().toLocaleString());
		formData.set('duration', sl.isWorking ? formatTime(elapsedTime) : 'N/A');

		return async ({ result }) => {
			if (result.type === 'success') {
				// Local state updates
				if (action === 'Iniciar Jornada') sl.start(sl.jornadaType);
				if (action === 'Terminar Jornada' || action === 'Forzar Término de Jornada') sl.stop();
				
				sl.showToast(`Registro enviado: ${action}`, 'success');
			} else if (result.type === 'failure') {
				sl.showToast((result.data as any)?.message || 'Error al enviar', 'error');
			}
		};
	};
</script>

<div class="flex items-center justify-center p-4 py-8">
	<div class="card w-full max-w-md bg-base-100 shadow-2xl">
		<form method="POST" use:enhance={handleEnhance} class="card-body gap-4">
			<div class="flex items-center justify-end">
				<div class="badge badge-secondary badge-xs font-mono">
					{sl.isWorking ? 'EN CURSO' : 'INACTIVO'}
				</div>
			</div>

			<div class="form-control flex-col flex">
				<label class="label" for="email"><span class="label-text font-bold">Email</span></label>
				<input
					id="email"
					type="email"
					name="email"
					bind:value={sl.email}
					placeholder="tu@email.com"
					disabled={sl.isWorking}
					class="w-full input input-bordered focus:input-primary {!sl.isValidEmail && sl.email ? 'input-error' : ''}"
				/>
				{#if !sl.isValidEmail && sl.email}
					<label for="email" class="label"><span class="label-text-alt text-error">Formato de email inválido</span></label>
				{/if}
			</div>

			<div class="form-control flex flex-col">
				<label class="label" for="jornada-type"><span class="label-text font-bold">Tipo de Jornada</span></label>
				<select id="jornada-type" name="jornadaType" bind:value={sl.jornadaType} class="w-full select select-bordered" disabled={sl.isWorking}>
					<option value="presencial">Presencial</option>
					<option value="clockify">Clockify</option>
				</select>
			</div>

			{#if sl.isWorking}
				<div class="stats shadow bg-primary text-primary-content mt-2 animate-pulse">
					<div class="stat place-items-center">
						<div class="stat-title text-primary-content/70">Tiempo transcurrido</div>
						<div class="stat-value font-mono text-4xl">{formatTime(elapsedTime)}</div>
						<div class="stat-desc text-primary-content/70">
							Iniciado: {new Date(sl.startTime!).toLocaleTimeString()}
						</div>
					</div>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-3 mt-4">
				{#if !sl.isWorking}
					<button 
						type="submit"
						name="action"
						value="Iniciar Jornada"
						class="btn btn-primary btn-lg shadow-lg" 
						disabled={!sl.isValidEmail}
					> Iniciar Jornada </button>
				{:else}
					<button 
						type="submit"
						name="action"
						value="Terminar Jornada"
						class="btn btn-error btn-lg shadow-lg" 
						disabled={!sl.isValidEmail}
					> Terminar Jornada </button>
				{/if}

				<div class="divider text-xs opacity-50 uppercase tracking-widest font-bold">Reportes</div>

				<button 
					type="submit"
					name="action"
					value="Ida de Luz"
					class="btn btn-warning w-full" 
					disabled={!sl.isValidEmail}
				> Ida de Luz </button>

				{#if !sl.isWorking}
					<button 
						type="submit"
						name="action"
						value="Forzar Término de Jornada"
						class="btn btn-ghost btn-xs opacity-50 hover:opacity-100 mt-2"
						disabled={!sl.isValidEmail}
					> Forzar Término de Jornada </button>
				{/if}
			</div>
		</form>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>
