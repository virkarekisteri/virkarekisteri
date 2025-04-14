import type { Costcentre } from 'models/Costcentre';

export const checkCostCentreActiveStatus = (costCentre: Costcentre | undefined, notActiveSuffix: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!costCentre) {
    return '';
  }

  const costCentreFrom = costCentre.validFrom ? new Date(costCentre.validFrom) : null;
  const costCentreUntil = costCentre.validUntil ? new Date(costCentre.validUntil) : null;

  // A cost centre is active if:
  // - There is no validFrom date or validFrom is on/before today AND
  // - There is no validUntil date or validUntil is on/after today.
  const isActive = (!costCentreFrom || costCentreFrom <= today) && (!costCentreUntil || costCentreUntil >= today);

  return isActive ? costCentre.name : `${costCentre.name} (${notActiveSuffix})`;
};
