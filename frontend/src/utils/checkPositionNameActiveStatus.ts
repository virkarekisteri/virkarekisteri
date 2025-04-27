import type { PositionName } from 'models/PositionName';

export const checkPositionNameActiveStatus = (
  positionName: PositionName | undefined,
  notActiveSuffix: string,
): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!positionName) {
    return '';
  }

  const positionNameFrom = positionName.validFrom ? new Date(positionName.validFrom) : null;
  const positionNameUntil = positionName.validUntil ? new Date(positionName.validUntil) : null;

  // A position name is active if:
  // - There is no validFrom date or validFrom is on/before today AND
  // - There is no validUntil date or validUntil is on/after today.
  const isActive =
    (!positionNameFrom || positionNameFrom <= today) && (!positionNameUntil || positionNameUntil >= today);

  return isActive ? positionName.name : `${positionName.name} (${notActiveSuffix})`;
};
