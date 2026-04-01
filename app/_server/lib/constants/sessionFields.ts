/** Fields stripped from session payloads before sending to the client (passwords, tokens). */
export const unselectedFields = [
  '+auth.password',
  '+auth.password.value',
  '+auth.password.passwordChangedAt',
  '+auth.refreshTokenJTI',
  '+ísDeleted',
  '+deleteRequestedAt',
  '+deletionApprovedAt',
  '+deletionApprovedBy',
];
