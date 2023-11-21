export function verifyWebhookSecret(req: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  const headerSecret = req.headers.get('x-api-secret');
  if (!secret) {
    console.warn('WEBHOOK_SECRET not set');
    return false;
  }

  if (!headerSecret) {
    return false;
  }
  return secret?.toLowerCase() === headerSecret?.toLowerCase();
}
