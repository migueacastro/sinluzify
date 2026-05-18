export interface AppsScriptPayload {
	email: string;
	action: string;
	jornadaType: string;
	timestamp: string;
	duration: string;
}

/**
 * Sends a payload to a Google Apps Script web app.
 * Note: Uses 'no-cors' mode as Apps Script does not support CORS preflight (OPTIONS).
 */
export async function sendToAppsScript(url: string, payload: AppsScriptPayload): Promise<void> {
	if (!url || url === 'TU_URL_DE_APPS_SCRIPT_AQUI') {
		throw new Error('URL de Apps Script no configurada');
	}

	try {
		await fetch(url, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
	} catch (error) {
		console.error('Error in sendToAppsScript:', error);
		throw error;
	}
}
