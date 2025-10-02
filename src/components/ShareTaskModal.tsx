import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Message as MessageCircleIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  Language as GlobeIcon,
  Edit as Edit2Icon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getTranslatedTask, getTaskEmoji } from '@/utils/enhancedTranslations';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Array<{
    id: string;
    title: string;
    task_category?: string;
    remarks?: string;
    priority?: string;
  }>;
  onSend: () => void;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  tasks,
  onSend 
}) => {
  const { maidContact, saveMaidContact, updateAutoSendSettings } = useMaidContact();
  const { sendMessage, isSending } = useUltramsgSender();
  
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [autoSend, setAutoSend] = useState(maidContact?.auto_send || false);
  const [scheduledTime, setScheduledTime] = useState(maidContact?.send_time || '08:00');
  const [contactName, setContactName] = useState(maidContact?.name || '');
  const [contactPhone, setContactPhone] = useState(maidContact?.phone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [frequency, setFrequency] = useState(maidContact?.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    maidContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  );
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Update state when maidContact changes
  useEffect(() => {
    if (maidContact) {
      setContactName(maidContact.name || '');
      setContactPhone(maidContact.phone || '');
      setAutoSend(maidContact.auto_send || false);
      setScheduledTime(maidContact.send_time || '08:00');
      setFrequency(maidContact.frequency || 'daily');
      setSelectedDays(maidContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      setSelectedLanguage(maidContact.preferred_language || 'english');
    }
  }, [maidContact]);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'kannada', label: 'Kannada' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const getPriorityEmoji = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const getPriorityOrder = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  };

  const generateTranslatedMessage = () => {
    if (tasks.length === 0) return 'No tasks selected';

    // Sort tasks by priority (urgent → high → medium → low)
    const sortedTasks = [...tasks].sort((a, b) => 
      getPriorityOrder(b.priority) - getPriorityOrder(a.priority)
    );

    const greeting = selectedLanguage === 'hindi' 
      ? 'नमस्ते!' 
      : selectedLanguage === 'tamil' 
      ? 'வணக்கம்!' 
      : selectedLanguage === 'telugu'
      ? 'నమస్కారం!'
      : selectedLanguage === 'kannada'
      ? 'ನಮಸ್ಕಾರ!'
      : 'Hello!';
    
    const taskListHeader = selectedLanguage === 'hindi' 
      ? 'आज के काम:' 
      : selectedLanguage === 'tamil' 
      ? 'இன்றைய பணிகள்:' 
      : selectedLanguage === 'telugu'
      ? 'నేటి పనులు:'
      : selectedLanguage === 'kannada'
      ? 'ಇಂದಿನ ಕೆಲಸಗಳು:'
      : "Today's cleaning tasks:";
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया ये काम पूरे करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இந்த பணிகளை முடிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please complete these tasks. Thank you!';

    let message = `${greeting}\n\n${taskListHeader}\n`;
    
    sortedTasks.forEach((task, index) => {
      const translatedTask = getTranslatedTask(task.title, selectedLanguage);
      const emoji = getTaskEmoji(task.title);
      const priorityEmoji = getPriorityEmoji(task.priority);
      const priorityText = task.priority ? ` ${task.priority}`.toUpperCase() : '';
      
      message += `${index + 1}. ${priorityEmoji} ${emoji} ${translatedTask}${priorityText}`;
      if (task.remarks) {
        message += ` (${task.remarks})`;
      }
      message += '\n';
    });

    const totalTasksText = selectedLanguage === 'hindi' 
      ? 'कुल काम:' 
      : selectedLanguage === 'tamil' 
      ? 'மொத்த பணிகள்:' 
      : selectedLanguage === 'telugu'
      ? 'మొత్తం పనులు:'
      : selectedLanguage === 'kannada'
      ? 'ಒಟ್ಟು ಕೆಲಸಗಳು:'
      : 'Total tasks:';

    message += `\n${totalTasksText} ${sortedTasks.length}\n\n${thankYou}`;
    
    return message;
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateAutoSendConfirmationMessage = () => {
    const confirmationTexts = {
      english: 'Auto message is enabled at scheduled time:',
      hindi: 'स्वचालित संदेश निर्धारित समय पर सक्षम है:',
      tamil: 'தானியங்கி செய்தி திட்டமிட்ட நேரத்தில் இயக்கப்பட்டுள்ளது:',
      telugu: 'ఆటో మెసేజ్ షెడ్యూల్ చేసిన సమయంలో ప్రారంభించబడింది:',
      kannada: 'ಸ್ವಯಂಚಾಲಿತ ಸಂದೇಶವು ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ:'
    };

    const frequencyTexts = {
      daily: {
        english: 'daily',
        hindi: 'रोज़ाना',
        tamil: 'தினசரி',
        telugu: 'రోజువారీ',
        kannada: 'ದೈನಂದಿನ'
      },
      weekly: {
        english: 'weekly',
        hindi: 'साप्ताहिक',
        tamil: 'வாராந்திர',
        telugu: 'వారానికి',
        kannada: 'ಸಾಪ್ತಾಹಿಕ'
      }
    };

    const confirmationText = confirmationTexts[selectedLanguage as keyof typeof confirmationTexts];
    const frequencyText = frequencyTexts[frequency as keyof typeof frequencyTexts][selectedLanguage as keyof typeof frequencyTexts.daily];
    
    let scheduleDetails = `${scheduledTime} ${frequencyText}`;
    
    if (frequency === 'weekly') {
      const dayNames = {
        english: { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' },
        hindi: { monday: 'सोम', tuesday: 'मंगल', wednesday: 'बुध', thursday: 'गुरु', friday: 'शुक्र', saturday: 'शनि', sunday: 'रवि' },
        tamil: { monday: 'திங்கள்', tuesday: 'செவ்வாய்', wednesday: 'புதன்', thursday: 'வியாழன்', friday: 'வெள்ளி', saturday: 'சனி', sunday: 'ஞாயிறு' },
        telugu: { monday: 'సోమ', tuesday: 'మంగళ', wednesday: 'బుధ', thursday: 'గురు', friday: 'శుక్ర', saturday: 'శని', sunday: 'ఆది' },
        kannada: { monday: 'ಸೋಮ', tuesday: 'ಮಂಗಳ', wednesday: 'ಬುಧ', thursday: 'ಗುರು', friday: 'ಶುಕ್ರ', saturday: 'ಶನಿ', sunday: 'ರವಿ' }
      };
      
      const selectedDayNames = selectedDays.map(day => 
        dayNames[selectedLanguage as keyof typeof dayNames][day as keyof typeof dayNames.english] || day
      ).join(', ');
      
      scheduleDetails += ` (${selectedDayNames})`;
    }

    return `${confirmationText} ${scheduleDetails}`;
  };

  // Reset custom message when language changes to ensure preview updates
  useEffect(() => {
    if (!isEditingMessage && customMessage) {
      setCustomMessage(''); // Clear cached message to force regeneration
    }
  }, [selectedLanguage]);

  const handleSendNow = async () => {
    const messageToSend = isEditingMessage ? customMessage : generateTranslatedMessage();
    
    if (!contactPhone.trim()) {
      return;
    }

    // Send task list immediately
    const result = await sendMessage({
      to: contactPhone,
      body: messageToSend,
      messageType: 'task',
      contactName: contactName || 'Maid'
    });

    if (result.success) {
      // Save contact info if new or update language preference
      if (contactName && contactPhone) {
        try {
          await saveMaidContact(contactPhone, contactName, selectedLanguage);
        } catch (error) {
          console.error('Error saving contact:', error);
        }
      }
      
      onSend();
      onClose();
    }
  };

  const handleEnableAutoSend = async () => {
    if (!contactPhone.trim() || !contactName.trim()) {
      return;
    }

    try {
      // Save/update contact information first with language preference
      await saveMaidContact(contactPhone, contactName, selectedLanguage);
      
      // Update auto-send settings with language preference
      await updateAutoSendSettings({
        auto_send: true,
        send_time: scheduledTime,
        frequency,
        days_of_week: frequency === 'daily' ? weekDays.map(d => d.value) : selectedDays,
        preferred_language: selectedLanguage
      });

      // Send confirmation message
      const confirmationMessage = generateAutoSendConfirmationMessage();
      const result = await sendMessage({
        to: contactPhone,
        body: confirmationMessage,
        messageType: 'task',
        contactName: contactName
      });

      if (result.success) {
        onSend();
        onClose();
      }
    } catch (error) {
      console.error('Error setting up auto-send:', error);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <MessageCircleIcon color="success" />
            <Typography variant="h6" fontWeight="bold">
              Share Tasks
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ maxHeight: '85vh', overflow: 'auto', px: 3 }}>
        <Stack spacing={4} sx={{ pt: 2 }}>
          {/* Language Selection */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <GlobeIcon color="success" />
              <Typography variant="subtitle1" fontWeight="bold">
                Message Language
              </Typography>
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                label="Language"
              >
                {languages.map(lang => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Message Preview */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Message Preview
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                bgcolor: 'grey.50', 
                maxHeight: 250, 
                overflow: 'auto',
                borderRadius: 2
              }}
            >
              {isEditingMessage ? (
                <TextField
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Edit your message..."
                  multiline
                  rows={8}
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              ) : (
                <Typography 
                  component="pre" 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'monospace',
                    m: 0
                  }}
                >
                  {generateTranslatedMessage()}
                </Typography>
              )}
            </Paper>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  if (!isEditingMessage) {
                    setCustomMessage(generateTranslatedMessage());
                  }
                  setIsEditingMessage(!isEditingMessage);
                }}
              >
                {isEditingMessage ? 'Save Changes' : 'Edit Message'}
              </Button>
              {isEditingMessage && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setCustomMessage('');
                    setIsEditingMessage(false);
                  }}
                >
                  Reset
                </Button>
              )}
            </Stack>
          </Box>

          {/* Contact Details */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <UserIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Details
                </Typography>
              </Stack>
              {maidContact && !isEditingContact && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit2Icon />}
                  onClick={() => setIsEditingContact(true)}
                >
                  Edit
                </Button>
              )}
            </Stack>
            
            {maidContact && !isEditingContact ? (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body2" fontWeight="medium">{maidContact.name}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                    <Typography variant="body2" fontWeight="medium">{maidContact.phone}</Typography>
                  </Stack>
                  {maidContact.last_sent_at && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last sent:</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(maidContact.last_sent_at).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ) : (
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact name"
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1234567890"
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                {isEditingContact && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        try {
                          await saveMaidContact(contactPhone, contactName, selectedLanguage);
                          setIsEditingContact(false);
                        } catch (error) {
                          console.error('Error saving contact:', error);
                        }
                      }}
                      fullWidth
                    >
                      Save
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setContactName(maidContact?.name || '');
                        setContactPhone(maidContact?.phone || '');
                        setIsEditingContact(false);
                      }}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}
          </Box>

          {/* Auto Send Toggle */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ClockIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Auto Send
                </Typography>
              </Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSend}
                    onChange={(e) => setAutoSend(e.target.checked)}
                    color="primary"
                  />
                }
                label=""
              />
            </Stack>
            
            {autoSend && (
              <Stack spacing={3} sx={{ pl: 4 }}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select 
                      value={frequency} 
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                
                {frequency === 'weekly' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Days of Week
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {weekDays.map(day => (
                        <Chip
                          key={day.value}
                          label={day.label}
                          onClick={() => toggleDay(day.value)}
                          color={selectedDays.includes(day.value) ? "primary" : "default"}
                          variant={selectedDays.includes(day.value) ? "filled" : "outlined"}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleSendNow}
          disabled={isSending || !contactPhone.trim()}
          variant="contained"
          fullWidth
          startIcon={isSending ? <CircularProgress size={16} /> : <MessageCircleIcon />}
        >
          {isSending ? 'Sending...' : 'Send Now'}
        </Button>
        
        {autoSend && (
          <Button
            onClick={handleEnableAutoSend}
            disabled={isSending || !contactPhone.trim() || !contactName.trim()}
            variant="outlined"
            fullWidth
            startIcon={isSending ? <CircularProgress size={16} /> : <ClockIcon />}
          >
            {isSending ? 'Setting up...' : 'Enable Auto-Send'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareTaskModal;
