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
import { CLOCK_HTML } from './DashboardContent';

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AddCardModal({ open, onClose, onSave }: AddCardModalProps) {
  const [prompt, setPrompt] = useState('');

  const handleBuild = () => {
    // For now, we'll just use the static CLOCK_HTML
    // In the future, this could generate HTML based on the prompt
  };

  const handleSave = () => {
    onSave();
    setPrompt('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
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
        Add New Card
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Input Area */}
          <Box>
            <DialogContentText sx={{ color: '#bdbdbd', fontSize: '1rem', mb: 2 }}>
              Enter a prompt to build your card.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
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
            <Button
              onClick={handleBuild}
              sx={{
                mt: 2,
                backgroundColor: '#232326',
                color: '#e5e7eb',
                '&:hover': {
                  backgroundColor: '#2d2d35',
                },
              }}
            >
              Build
            </Button>
          </Box>

          {/* Preview Area */}
          <Box>
            <DialogContentText sx={{ color: '#bdbdbd', fontSize: '1rem', mb: 2 }}>
              Preview
            </DialogContentText>
            <Box
              sx={{
                width: '100%',
                height: 300,
                backgroundColor: '#232326',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <iframe
                srcDoc={CLOCK_HTML}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Card Preview"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} sx={{ color: '#bdbdbd' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} sx={{ color: '#bdbdbd', fontWeight: 600 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
} 