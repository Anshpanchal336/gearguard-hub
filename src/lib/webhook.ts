const N8N_WEBHOOK_URL = 'https://ansh336.app.n8n.cloud/webhook/Gear-Guard';

export interface WebhookPayload {
  action: 'create_request' | 'update_request' | 'accept_request' | 'complete_request';
  data: Record<string, unknown>;
}

export async function sendToWebhook(payload: WebhookPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
