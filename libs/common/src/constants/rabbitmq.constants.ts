export const RABBITMQ_EXCHANGE = 'app_exchange';

// Dead Letter Exchange
export const RABBITMQ_DLX = 'app_dlx';
export const RABBITMQ_DLQ = 'app_dlq';

// Email service
export const EMAIL_QUEUE = 'email_queue';
export const EMAIL_ROUTING_KEY = 'email.#';

// Notification service
export const NOTIFICATION_QUEUE = 'notification_queue';
export const NOTIFICATION_ROUTING_KEY = 'notification.#';

// Retry configuration
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 5000; // 5 seconds
