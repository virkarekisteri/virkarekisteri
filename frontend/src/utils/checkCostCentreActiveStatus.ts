import type { Costcentre } from 'models/Costcentre';

export const checkCostCentreActiveStatus = (costCentre: Costcentre | undefined, notActiveSuffix: string): string => {
  const today = new Date();
  const costCentreFrom = costCentre?.validFrom && new Date(costCentre?.validFrom);
  const costCentreUntil = costCentre?.validUntil && new Date(costCentre?.validUntil);

  return costCentreFrom && costCentreFrom <= today && costCentreUntil && costCentreUntil >= today
    ? costCentre.name
    : costCentre?.name + ` (${notActiveSuffix})`;
};
