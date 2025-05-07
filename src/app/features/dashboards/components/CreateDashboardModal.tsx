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
  DialogContentText,
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
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#23232a',
          color: '#e5e7eb',
          borderRadius: 2,
          boxShadow: 24,
          minWidth: 340,
        },
      }}
    >
      <DialogTitle sx={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem', background: 'none', pb: 0 }}>
        Create New Dashboard
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#bdbdbd', fontSize: '1rem', mb: 2 }}>
          Enter a title and description for your new dashboard.
        </DialogContentText>
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
                backgroundColor: '#232326',
                outline: 'none',
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
                '&.Mui-focused': {
                  color: '#fff',
                },
              },
              '& .MuiOutlinedInput-root': {
                outline: 'none',
                '& fieldset': {
                  borderColor: '#27272a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#27272a !important',
                },
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: '#27272a !important',
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
                backgroundColor: '#232326',
                outline: 'none',
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
                '&.Mui-focused': {
                  color: '#fff',
                },
              },
              '& .MuiOutlinedInput-root': {
                outline: 'none',
                '& fieldset': {
                  borderColor: '#27272a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#27272a !important',
                },
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: '#27272a !important',
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} sx={{ color: '#bdbdbd' }}>
          Cancel
        </Button>
        <Button onClick={handleCreate} sx={{ color: '#bdbdbd', fontWeight: 600 }} disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
} 