import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

interface ResourceViewerProps {
  open: boolean;
  onClose: () => void;
  resource: {
    title: string;
    description: string;
    resource_type: string;
    content: string | null;
    file_url: string | null;
  };
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({ open, onClose, resource }) => {
  const theme = useTheme();

  const renderContent = () => {
    switch (resource.resource_type) {
      case 'text':
        return (
          <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {resource.content}
            </Typography>
          </Paper>
        );

      case 'video':
        return (
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              src={resource.content || resource.file_url || ''}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        );

      case 'pdf':
        return (
          <Box sx={{ position: 'relative', height: '80vh', width: '100%' }}>
            <iframe
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              src={`${resource.file_url}#view=FitH`}
              title={resource.title}
            />
          </Box>
        );

      case 'image':
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <img
              src={resource.file_url || ''}
              alt={resource.title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        );

      case 'link':
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1" paragraph>
              {resource.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              endIcon={<OpenInNewIcon />}
              href={resource.content || resource.file_url || ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Resource
            </Button>
          </Box>
        );

      case 'quiz':
      case 'assignment':
      case 'practice':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              {resource.content}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Handle starting quiz/assignment/practice
                console.log('Starting:', resource.resource_type);
              }}
            >
              Start {resource.resource_type}
            </Button>
          </Box>
        );

      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Content type not supported
          </Typography>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h6">{resource.title}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {resource.description && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {resource.description}
          </Typography>
        )}
        {renderContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceViewer; 