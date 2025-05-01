'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import { CreateDashboardModalProps } from '../types/dashboard';

export function CreateDashboardModal({ open, onClose, onCreate }: CreateDashboardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (title.trim()) {
      onCreate(title, description);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#e5e7eb' }}>Create New Dashboard</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: '#e5e7eb',
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#27272a',
                },
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                color: '#e5e7eb',
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#27272a',
                },
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!title.trim()}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
} 