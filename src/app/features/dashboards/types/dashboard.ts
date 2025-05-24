export interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  boxes: Box[];
  zoom: number; // 1 = 100%
}

export interface CreateDashboardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

export interface DeleteDashboardModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  dashboardTitle: string;
} 