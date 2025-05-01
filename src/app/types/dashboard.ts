export interface Dashboard {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
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