import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  CircularProgress,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { ResizablePreview } from './ResizablePreview';

interface ConversationHistory {
  prompts: string;
  html: string;
}

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (intervalSettings: { isEnabled: boolean; interval: number; prompt: string }) => void;
  onHtmlGenerated: (html: string) => void;
  initialConversationHistory?: {
    prompts: string;
    html: string;
  };
  initialIntervalSettings?: {
    isEnabled: boolean;
    interval: number;
    prompt: string;
  };
}

export function AddCardModal({ open, onClose, onSave, onHtmlGenerated, initialConversationHistory, initialIntervalSettings }: AddCardModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isResizablePreviewOpen, setIsResizablePreviewOpen] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory>(
    initialConversationHistory || { prompts: '', html: '' }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [intervalSettings, setIntervalSettings] = useState({
    isEnabled: initialIntervalSettings?.isEnabled || false,
    interval: initialIntervalSettings?.interval || 1,
    prompt: initialIntervalSettings?.prompt || '',
  });

  useEffect(() => {
    if (open && initialConversationHistory) {
      setConversationHistory(initialConversationHistory);
      setGeneratedHtml(initialConversationHistory.html);
    }
  }, [open, initialConversationHistory]);

  useEffect(() => {
    if (open && initialIntervalSettings) {
      setIntervalSettings(initialIntervalSettings);
    }
  }, [open, initialIntervalSettings]);

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate card');
      }

      // Check if the response contains a message
      if (data.message) {
        setErrorMessage(data.message);
        setPrompt('');
        return;
      }
      
      // Update conversation history
      const newHistory = {
        prompts: conversationHistory.prompts ? `${conversationHistory.prompts}\n${prompt}` : prompt,
        html: data.html
      };
      setConversationHistory(newHistory);

      // Update UI
      setGeneratedHtml(data.html);
      onHtmlGenerated(data.html);
      setFollowUpQuestions(data.questions || []);
      setPrompt('');
    } catch (error) {
      console.error('Error generating card:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate card');
      setPrompt('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave(intervalSettings);
    // Reset state
    setPrompt('');
    setGeneratedHtml('');
    setFollowUpQuestions([]);
    setConversationHistory(initialConversationHistory || { prompts: '', html: '' });
    setErrorMessage('');
    setIntervalSettings({
      isEnabled: false,
      interval: 1,
      prompt: '',
    });
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleBuild();
    }
  };

  const handleClose = () => {
    // Reset all states
    setPrompt('');
    setGeneratedHtml('');
    setFollowUpQuestions([]);
    setConversationHistory(initialConversationHistory || { prompts: '', html: '' });
    setErrorMessage('');
    setIntervalSettings({
      isEnabled: false,
      interval: 1,
      prompt: '',
    });
    setIsResizablePreviewOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleClose();
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            backgroundColor: '#23232a',
            color: '#e5e7eb',
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 340,
            zIndex: 12000,
          },
        }}
        BackdropProps={{
          sx: {
            zIndex: 11999,
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
              <DialogContentText sx={{ color: '#fff', fontSize: '1rem', mb: 2 }}>
                {followUpQuestions.length > 0
                  ? 'Answer the follow-up questions:'
                  : 'Enter a prompt to build your card.'}
              </DialogContentText>
              {(followUpQuestions.length > 0 || errorMessage) && (
                <Box sx={{ mb: 2 }}>
                  {errorMessage ? (
                    <DialogContentText
                      sx={{ 
                        color: '#fff', 
                        fontSize: '0.9rem', 
                        mb: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {errorMessage}
                    </DialogContentText>
                  ) : (
                    followUpQuestions.map((question, index) => (
                      <DialogContentText
                        key={index}
                        sx={{ 
                          color: '#fff', 
                          fontSize: '0.9rem', 
                          mb: 1,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        • {question}
                      </DialogContentText>
                    ))
                  )}
                </Box>
              )}
              <TextField
                autoFocus
                fullWidth
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={followUpQuestions.length > 0 ? "Type your answer here..." : "Enter your prompt here..."}
                disabled={isLoading}
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleBuild}
                  disabled={isLoading || !prompt.trim()}
                  sx={{
                    mt: 2,
                    backgroundColor: '#232326',
                    color: '#e5e7eb',
                    '&:hover': {
                      backgroundColor: '#2d2d35',
                    },
                    '&:disabled': {
                      backgroundColor: '#1a1a1d',
                      color: '#6b7280',
                    },
                  }}
                >
                  {isLoading ? 'Generating...' : followUpQuestions.length > 0 ? 'Submit Answer' : 'Build'}
                </Button>
              </Box>

              {/* Interval Settings */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                  value={intervalSettings.prompt}
                  onChange={(e) => setIntervalSettings(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Interval prompt..."
                  disabled={!intervalSettings.isEnabled}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      color: '#e5e7eb',
                      backgroundColor: '#232326',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#27272a',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#27272a',
                      },
                    },
                  }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={intervalSettings.interval}
                    onChange={(e) => setIntervalSettings(prev => ({ ...prev, interval: Number(e.target.value) }))}
                    disabled={!intervalSettings.isEnabled}
                    displayEmpty
                    sx={{
                      color: '#e5e7eb',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#27272a',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#27272a',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#27272a',
                      },
                      '.MuiSvgIcon-root': {
                        color: '#6b7280',
                      },
                    }}
                  >
                    <MenuItem value={1}>1 minute</MenuItem>
                    <MenuItem value={5}>5 minutes</MenuItem>
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={180}>3 hours</MenuItem>
                    <MenuItem value={360}>6 hours</MenuItem>
                    <MenuItem value={720}>12 hours</MenuItem>
                    <MenuItem value={1440}>24 hours</MenuItem>
                  </Select>
                </FormControl>
                <Checkbox
                  checked={intervalSettings.isEnabled}
                  onChange={(e) => setIntervalSettings(prev => ({ ...prev, isEnabled: e.target.checked }))}
                  sx={{
                    color: '#6b7280',
                    '&.Mui-checked': {
                      color: '#e5e7eb',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Preview Area - Always Visible */}
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
                  position: 'relative',
                  '&:hover .preview-overlay': {
                    opacity: generatedHtml ? 1 : 0,
                  },
                }}
              >
                {generatedHtml && (
                  <Box
                    className="preview-overlay"
                    onClick={() => setIsResizablePreviewOpen(true)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                  >
                    <DialogContentText
                      sx={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      View in preview mode
                    </DialogContentText>
                  </Box>
                )}
                {isLoading ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(35, 35, 38, 0.7)',
                      zIndex: 2,
                    }}
                  >
                    <CircularProgress sx={{ color: '#e5e7eb' }} />
                  </Box>
                ) : null}
                <iframe
                  srcDoc={generatedHtml || '<div style="width: 100%; height: 100%;"></div>'}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title="Card Preview"
                  sandbox="allow-scripts"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(generatedHtml);
            }}
            disabled={!generatedHtml}
            sx={{
              color: '#bdbdbd',
              '&:hover': {
                backgroundColor: '#2d2d35',
              },
              '&:disabled': {
                color: '#6b7280',
              },
            }}
          >
            Copy HTML
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleClose} sx={{ color: '#bdbdbd' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            sx={{ color: '#bdbdbd', fontWeight: 600 }}
            disabled={!generatedHtml}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {isResizablePreviewOpen && (
        <ResizablePreview
          htmlContent={generatedHtml}
          onClose={() => setIsResizablePreviewOpen(false)}
        />
      )}
    </>
  );
} 