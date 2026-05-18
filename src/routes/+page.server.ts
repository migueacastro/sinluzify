import { sendToAppsScript, SCRIPT_URL, type AppsScriptPayload } from '$lib/api/utils';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		
		const payload: AppsScriptPayload = {
			email: formData.get('email') as string,
			action: formData.get('action') as string,
			jornadaType: formData.get('jornadaType') as string,
			timestamp: formData.get('timestamp') as string,
			duration: formData.get('duration') as string
		};

		if (!payload.email || !payload.action) {
			return fail(400, { message: 'Datos incompletos' });
		}

		try {
			await sendToAppsScript(SCRIPT_URL, payload);
			return { success: true, action: payload.action };
		} catch (e: any) {
			console.error('Action error:', e);
			return fail(500, { message: e.message || 'Error en el servidor' });
		}
	}
} satisfies Actions;
