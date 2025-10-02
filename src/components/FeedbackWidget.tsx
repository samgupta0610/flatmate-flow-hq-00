import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Message as MessageSquareIcon,
  Star as StarIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useFeedback, type FeedbackType } from "@/hooks/useFeedback";

// Remove zod schema and use simple state management

const feedbackTypeLabels: Record<FeedbackType, string> = {
  feature_request: "Feature Request",
  bug_report: "Bug Report",
  general: "General Feedback",
  improvement: "Improvement Suggestion",
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { submitFeedback, isSubmitting } = useFeedback();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    
    const success = await submitFeedback({
      feedback_type: feedbackType,
      title: title.trim(),
      description: description.trim(),
      rating: rating > 0 ? rating : undefined,
    });

    if (success) {
      setTitle('');
      setDescription('');
      setRating(0);
      setFeedbackType('general');
      setIsOpen(false);
    }
  };

  const renderStars = () => {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton
            key={star}
            onClick={() => setRating(star)}
            sx={{
              p: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <StarIcon
              sx={{
                fontSize: 24,
                color: star <= rating ? '#FCD34D' : '#D1D5DB',
                '&:hover': {
                  color: '#FCD34D',
                },
                transition: 'color 0.2s',
              }}
            />
          </IconButton>
        ))}
        {rating > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {rating} star{rating !== 1 ? 's' : ''}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #EBF5FF 0%, #E0F2FE 100%)',
        borderColor: '#93C5FD',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
        borderRadius: 3,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
          },
          transition: 'all 0.3s',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MessageSquareIcon sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="semibold" color="primary.dark">
                MVP Feedback
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>
                Help us improve MaidEasy with your thoughts!
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {isOpen ? (
              <ExpandLessIcon sx={{ color: 'primary.main' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: 'primary.main' }} />
            )}
          </IconButton>
        </Stack>
      </CardHeader>

      <Collapse in={isOpen}>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={3}>
            {/* Feedback Type */}
            <FormControl fullWidth>
              <InputLabel>Type of Feedback</InputLabel>
              <Select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                label="Type of Feedback"
              >
                {Object.entries(feedbackTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rating */}
            <Box>
              <Typography variant="body2" fontWeight="medium" color="primary.dark" sx={{ mb: 1 }}>
                Overall Rating (Optional)
              </Typography>
              {renderStars()}
            </Box>

            {/* Title */}
            <TextField
              label="Title"
              placeholder="Brief summary of your feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Tell us more about your thoughts, suggestions, or issues..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                },
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                },
              }}
            >
              {isSubmitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={16} color="inherit" />
                  <Typography>Submitting...</Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SendIcon />
                  <Typography>Submit Feedback</Typography>
                </Stack>
              )}
            </Button>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FeedbackWidget;