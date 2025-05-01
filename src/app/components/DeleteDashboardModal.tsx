'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

import { DeleteDashboardModalProps } from '../types/dashboard';

export function DeleteDashboardModal({ open, onClose, onDelete, dashboardTitle }: DeleteDashboardModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#e5e7eb' }}>Delete Dashboard</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#e5e7eb' }}>
          Are you sure you want to delete "{dashboardTitle}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          variant="contained"
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 