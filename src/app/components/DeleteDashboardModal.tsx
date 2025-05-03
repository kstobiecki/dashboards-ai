'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from '@mui/material';

import { DeleteDashboardModalProps } from '../types/dashboard';

export function DeleteDashboardModal({ open, onClose, onDelete, dashboardTitle }: DeleteDashboardModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#e5e7eb' }}>Delete Dashboard</DialogTitle>
      <Divider sx={{ background: 'rgba(255,255,255,0.08)', width: '95%', mx: 'auto' }} />
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
            color: '#fff',
            fontWeight: 600,
            letterSpacing: 1,
            '&:hover': {
              backgroundColor: '#dc2626',
              color: '#fff',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 