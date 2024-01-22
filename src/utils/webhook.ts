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

/*
{
  network_id: 'networks/base-mainnet',
  block_hash: '0x2b3a26af59f09f922bc1df5ad91d8993def16294fc6ce0c1f74319cfd08ca786',
  block_timestamp: 'seconds:1705930919',
  event_type: 'EVENT_TYPE_CONTRACT_EXECUTION',
  from_address: '0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5',
  value: '0x0',
  contract_address: '0xcbd226ad2aae2c658063f4e3ef610aae378513e6',
  transaction_hash: '0x89bbdaf6684a9d6a0d73973113b5a82e534196bd94bc11f58bc9736859d6af4d',
  is_from_address_cbw: true,
  is_to_address_cbw: false
}

[webhook transfer] body: {
  network_id: 'networks/base-mainnet',
  block_hash: '0x2b3a26af59f09f922bc1df5ad91d8993def16294fc6ce0c1f74319cfd08ca786',
  block_timestamp: 'seconds:1705930919',
  event_type: 'EVENT_TYPE_TRANSFER_ERC1155',
  from_address: '0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5',
  to_address: '0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5',
  value: '0x0',
  contract_address: '0xcbd226ad2aae2c658063f4e3ef610aae378513e6',
  transaction_hash: '0x89bbdaf6684a9d6a0d73973113b5a82e534196bd94bc11f58bc9736859d6af4d',
  log_index: '0x1',
  is_from_address_cbw: true,
  is_to_address_cbw: true
}

*/

export type WebhookData = {
  network_id: string;
  block_hash: string;
  block_timestamp: string;
  event_type: string;
  from_address: string;
  to_address: string;
  value: string;
  contract_address: string;
  transaction_hash: string;
  log_index: string;
  is_from_address_cbw: boolean;
  is_to_address_cbw: boolean;
};
