
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Warning as AlertCircleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGroceryList } from '@/hooks/useGroceryList';
import { useVendorContacts } from '@/hooks/useVendorContacts';
import GroceryMessagePreview from './GroceryMessagePreview';
import GroceryWhatsAppReminder from './GroceryWhatsAppReminder';
import FrequentlyBoughtItems from './FrequentlyBoughtItems';
import GroceryCart from './GroceryCart';
import GroceryItemsList from './GroceryItemsList';
import GroceryOrderLog from './GroceryOrderLog';
import LanguageSelector from './LanguageSelector';
import ContactDropdown from './ContactDropdown';

const GroceryManager = () => {
  const {
    groceryItems,
    cartItems,
    frequentlyBoughtItems,
    addItemFromMealPlanner,
    toggleInCart,
    updateQuantity,
    addNewItem,
    deleteItem,
    clearCart,
    addOrderToHistory
  } = useGroceryList();

  const { vendors, loading: vendorsLoading } = useVendorContacts();
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const handleOrderPlaced = (orderDetails: any) => {
    addOrderToHistory(orderDetails);
    clearCart();
  };

  if (vendorsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Grocery Manager
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading vendor contacts...
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: { xs: 'calc(100vh - 80px)', md: '100vh' },
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Grocery Manager
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="medium">
            Smart grocery shopping made simple
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        px: 2, 
        pb: 6 
      }}>
        <Container maxWidth="lg">
        {/* Vendor Contact and Language Selection */}
        {vendors.length === 0 ? (
          <Card sx={{ mb: 3 }}>
            <CardHeader>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AlertCircleIcon color="warning" />
                <Typography variant="h6" fontWeight="bold">
                  No Vendor Contacts
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Add vendor contacts in your profile to place grocery orders.
              </Typography>
            </CardHeader>
            <CardContent>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                startIcon={<SettingsIcon />}
                fullWidth
              >
                Add Vendor Contact in Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Vendor Contact
              </Typography>
              <ContactDropdown
                contacts={vendors.map(v => ({ ...v, name: v.shop_name }))}
                selectedContact={selectedVendor ? { ...selectedVendor, name: selectedVendor.shop_name } : null}
                onSelectContact={(contact) => setSelectedVendor(vendors.find(v => v.id === contact.id))}
                placeholder="Choose vendor"
                type="vendor"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Language
              </Typography>
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </Box>
          </Stack>
        )}

        {/* Message Preview and WhatsApp Send Side by Side */}
        {selectedVendor && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <GroceryMessagePreview 
                cartItems={cartItems}
                selectedLanguage={selectedLanguage}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <GroceryWhatsAppReminder 
                cartItems={cartItems} 
                selectedLanguage={selectedLanguage}
                vendorContact={selectedVendor.phone_number}
                onOrderPlaced={handleOrderPlaced}
              />
            </Box>
          </Stack>
        )}

        {/* Frequently Bought Items */}
        <Box sx={{ mb: 3 }}>
          <FrequentlyBoughtItems 
            items={frequentlyBoughtItems}
            onToggleInCart={toggleInCart}
          />
        </Box>

        {/* Main Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={0} sx={{ mb: 2 }}>
            <Tab label={`Cart (${cartItems.length})`} />
            <Tab label="Grocery List" />
          </Tabs>
          
          <Box>
            <GroceryCart 
              cartItems={cartItems}
              onToggleInCart={toggleInCart}
              onUpdateQuantity={updateQuantity}
              vendorContact={selectedVendor?.phone_number || ''}
              selectedLanguage={selectedLanguage}
              onOrderPlaced={handleOrderPlaced}
            />
          </Box>
        </Box>

        {/* Compact Grocery Order Log */}
        <Box>
          <GroceryOrderLog />
        </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default GroceryManager;
