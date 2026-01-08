
export type ItemStatus = 'POTDUR & EDIT' | 'PREVIEW' | 'SUDAH TAYANG';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: ItemStatus;
  lastUpdated: string;
  tags: string[];
  hasEng?: boolean;
  linkedEngId?: string;
  airDate?: string; // Format: YYYY-MM-DD
}

export interface DashboardStats {
  totalItems: number;
  checkedCount: number;
  pendingCount: number;
  categoryDistribution: { name: string; value: number }[];
}
