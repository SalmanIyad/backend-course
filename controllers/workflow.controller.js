// controllers/workflow.controller.js
import { findSubscriptionById } from './subscription.controller.js';
import { sendReminder } from '../utils/sendEmail.js';

export const handleWorkflow = async (context) => {
  const { subscriptionId } = context.requestPayload;
  if (!subscriptionId) {
    throw new Error("Missing subscriptionId");
  }

  // Fetch subscription details without user auth
  const subscription = await context.run('fetch-subscription', async () => {
    return await findSubscriptionById(subscriptionId);
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Send a reminder email
  await context.run('send-reminder-email', async () => {
    await sendReminder(subscription);
  });

  return {
    success: true,
    message: `Reminder sent for subscription: ${subscription.name}`,
  };
};
