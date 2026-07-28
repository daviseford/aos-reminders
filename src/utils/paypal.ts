export const getPaypalSubscriptionManagementUrl = (subscriptionId: string, sandbox: boolean) =>
  `https://www.${sandbox ? 'sandbox.' : ''}paypal.com/myaccount/autopay/connect/${encodeURIComponent(
    subscriptionId
  )}`

export const openPaypalSubscriptionManagement = (subscriptionId: string, sandbox: boolean) => {
  window.location.replace(getPaypalSubscriptionManagementUrl(subscriptionId, sandbox))
}
