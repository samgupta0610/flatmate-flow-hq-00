import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
  Message,
  AccessTime,
  Person,
  Language,
  Edit,
  Close,
  Send
} from '@mui/icons-material';
import { getTranslatedMeal, getMealEmoji } from '@/utils/mealTranslations';
import { useMealContact } from '@/hooks/useMealContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { DailyPlan } from '@/types/meal';

interface ShareMealPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todaysPlan: DailyPlan;
  todayName: string;
}

const ShareMealPlanModal: React.FC<ShareMealPlanModalProps> = ({ 
  open, 
  onOpenChange, 
  todaysPlan,
  todayName 
}) => {
  const { mealContact, saveMealContact, updateAutoSendSettings } = useMealContact();
  const { sendMessage, isSending } = useUltramsgSender();
  
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [autoSend, setAutoSend] = useState(mealContact?.auto_send || false);
  const [scheduledTime, setScheduledTime] = useState(mealContact?.send_time || '08:00');
  const [contactName, setContactName] = useState(mealContact?.name || '');
  const [contactPhone, setContactPhone] = useState(mealContact?.phone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [frequency, setFrequency] = useState(mealContact?.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    mealContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  );
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [servings, setServings] = useState(4);

  // Update state when mealContact changes
  useEffect(() => {
    if (mealContact) {
      setContactName(mealContact.name || '');
      setContactPhone(mealContact.phone || '');
      setAutoSend(mealContact.auto_send || false);
      setScheduledTime(mealContact.send_time || '08:00');
      setFrequency(mealContact.frequency || 'daily');
      setSelectedDays(mealContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    }
  }, [mealContact]);

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

  const generateTranslatedMessage = () => {
    const greeting = selectedLanguage === 'hindi' 
      ? 'नमस्ते!' 
      : selectedLanguage === 'tamil' 
      ? 'வணக்கம்!' 
      : selectedLanguage === 'telugu'
      ? 'నమస్కారం!'
      : selectedLanguage === 'kannada'
      ? 'ನಮಸ್ಕಾರ!'
      : 'Hello!';
    
    const mealPlanHeader = selectedLanguage === 'hindi' 
      ? `आज का भोजन (${todayName}):` 
      : selectedLanguage === 'tamil' 
      ? `இன்றைய உணவு (${todayName}):` 
      : selectedLanguage === 'telugu'
      ? `నేటి భోజనం (${todayName}):`
      : selectedLanguage === 'kannada'
      ? `ಇಂದಿನ ಊಟ (${todayName}):`
      : `Today's meal plan (${todayName}):`;
    
    const servingsText = selectedLanguage === 'hindi' 
      ? `${servings} लोगों के लिए` 
      : selectedLanguage === 'tamil' 
      ? `${servings} பேருக்கு` 
      : selectedLanguage === 'telugu'
      ? `${servings} మందికి`
      : selectedLanguage === 'kannada'
      ? `${servings} ಜನರಿಗೆ`
      : `For ${servings} people`;
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया इन्हें तैयार करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இவற்றை தயாரிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి వీటిని తయారు చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಇವುಗಳನ್ನು ತಯಾರಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please prepare these items. Thank you!';

    let message = `${greeting}\n\n${mealPlanHeader}\n${servingsText}\n\n`;
    
    // Breakfast
    if (todaysPlan.breakfast.length > 0) {
      const breakfastHeader = selectedLanguage === 'hindi' ? '🌅 नाश्ता:' 
        : selectedLanguage === 'tamil' ? '🌅 காலை உணவு:' 
        : selectedLanguage === 'telugu' ? '🌅 అల్పాహారం:'
        : selectedLanguage === 'kannada' ? '🌅 ಬೆಳಗಿನ ಊಟ:'
        : '🌅 Breakfast:';
      message += `${breakfastHeader}\n`;
      todaysPlan.breakfast.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Lunch
    if (todaysPlan.lunch.length > 0) {
      const lunchHeader = selectedLanguage === 'hindi' ? '🌞 दोपहर का खाना:' 
        : selectedLanguage === 'tamil' ? '🌞 மதிய உணவு:' 
        : selectedLanguage === 'telugu' ? '🌞 మధ్యాహ్న భోజనం:'
        : selectedLanguage === 'kannada' ? '🌞 ಮಧ್ಯಾಹ್ನದ ಊಟ:'
        : '🌞 Lunch:';
      message += `${lunchHeader}\n`;
      todaysPlan.lunch.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Dinner
    if (todaysPlan.dinner.length > 0) {
      const dinnerHeader = selectedLanguage === 'hindi' ? '🌙 रात का खाना:' 
        : selectedLanguage === 'tamil' ? '🌙 இரவு உணவு:' 
        : selectedLanguage === 'telugu' ? '🌙 రాత్రి భోజనం:'
        : selectedLanguage === 'kannada' ? '🌙 ರಾತ್ರಿಯ ಊಟ:'
        : '🌙 Dinner:';
      message += `${dinnerHeader}\n`;
      todaysPlan.dinner.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Snacks
    if (todaysPlan.snack && todaysPlan.snack.length > 0) {
      const snackHeader = selectedLanguage === 'hindi' ? '🍪 नाश्ता:' 
        : selectedLanguage === 'tamil' ? '🍪 சிற்றுண்டி:' 
        : selectedLanguage === 'telugu' ? '🍪 చిరుతిండి:'
        : selectedLanguage === 'kannada' ? '🍪 ತಿಂಡಿ:'
        : '🍪 Snacks:';
      message += `${snackHeader}\n`;
      todaysPlan.snack.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    message += thankYou;
    
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
      english: 'Auto meal plan message is enabled at scheduled time:',
      hindi: 'स्वचालित भोजन संदेश निर्धारित समय पर सक्षम है:',
      tamil: 'தானியங்கி உணவு திட்ட செய்தி திட்டமிட்ட நேரத்தில் இயக்கப்பட்டுள்ளது:',
      telugu: 'ఆటో మీల్ ప్లాన్ మెసేజ్ షెడ్యూల్ చేసిన సమయంలో ప్రారంభించబడింది:',
      kannada: 'ಸ್ವಯಂಚಾಲಿತ ಊಟದ ಯೋಜನೆ ಸಂದೇಶವು ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ:'
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

    // Send meal plan immediately
    const result = await sendMessage({
      to: contactPhone,
      body: messageToSend,
      messageType: 'meal',
      contactName: contactName || 'Cook'
    });

    if (result.success) {
      // Save contact info if new
      if (contactName && contactPhone && !mealContact) {
        try {
          await saveMealContact(contactPhone, contactName);
        } catch (error) {
          console.error('Error saving contact:', error);
        }
      }
      
      onOpenChange(false);
    }
  };

  const handleEnableAutoSend = async () => {
    if (!contactPhone.trim() || !contactName.trim()) {
      return;
    }

    try {
      // Save/update contact information first
      await saveMealContact(contactPhone, contactName);
      
      // Update auto-send settings
      await updateAutoSendSettings({
        auto_send: true,
        send_time: scheduledTime,
        frequency,
        days_of_week: frequency === 'daily' ? weekDays.map(d => d.value) : selectedDays
      });

      // Send confirmation message
      const confirmationMessage = generateAutoSendConfirmationMessage();
      const result = await sendMessage({
        to: contactPhone,
        body: confirmationMessage,
        messageType: 'meal',
        contactName: contactName
      });

      if (result.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error setting up auto-send:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Message color="success" />
            <Typography variant="h6" fontWeight="bold">
              Share Meal Plan
            </Typography>
          </Stack>
          <IconButton onClick={() => onOpenChange(false)} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ maxHeight: '85vh', overflow: 'auto', px: 3 }}>
        <Stack spacing={4} sx={{ pt: 2 }}>
          {/* Servings */}
          <TextField
            label="Number of Servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: 20 }}
            fullWidth
            variant="outlined"
          />

          {/* Language Selection */}
          <FormControl fullWidth>
            <InputLabel id="language-select-label">Message Language</InputLabel>
            <Select 
              labelId="language-select-label"
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              label="Message Language"
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              {languages.map(lang => (
                <MenuItem key={lang.value} value={lang.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography>{lang.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Message Preview */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
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
                <Person color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Details
                </Typography>
              </Stack>
              {mealContact && !isEditingContact && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => setIsEditingContact(true)}
                >
                  Edit
                </Button>
              )}
            </Stack>
            
            {mealContact && !isEditingContact ? (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body2" fontWeight="medium">{mealContact.name}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                    <Typography variant="body2" fontWeight="medium">{mealContact.phone}</Typography>
                  </Stack>
                  {mealContact.last_sent_at && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last sent:</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(mealContact.last_sent_at).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ) : (
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter contact name"
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  label="Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Enter phone number"
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                {isEditingContact && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        try {
                          await saveMealContact(contactPhone, contactName);
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
                        setContactName(mealContact?.name || '');
                        setContactPhone(mealContact?.phone || '');
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
                <AccessTime color="primary" />
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
          startIcon={isSending ? <CircularProgress size={16} /> : <Send />}
        >
          {isSending ? 'Sending...' : 'Send Now'}
        </Button>
        
        {autoSend && (
          <Button
            onClick={handleEnableAutoSend}
            disabled={isSending || !contactPhone.trim() || !contactName.trim()}
            variant="outlined"
            fullWidth
            startIcon={isSending ? <CircularProgress size={16} /> : <AccessTime />}
          >
            {isSending ? 'Setting up...' : 'Enable Auto-Send'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareMealPlanModal;