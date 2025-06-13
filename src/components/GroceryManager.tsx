
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900">Grocery Manager</h1>
          <p className="text-sm text-gray-500">Loading vendor contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Grocery Manager</h1>
            <p className="text-sm text-gray-500">Smart grocery shopping</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Vendor Contact and Language Selection */}
        {vendors.length === 0 ? (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                No Vendor Contacts
              </CardTitle>
              <CardDescription>Add vendor contacts in your profile to place grocery orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/profile">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Add Vendor Contact in Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Vendor Contact</label>
              <ContactDropdown
                contacts={vendors.map(v => ({ ...v, name: v.shop_name }))}
                selectedContact={selectedVendor ? { ...selectedVendor, name: selectedVendor.shop_name } : null}
                onSelectContact={(contact) => setSelectedVendor(vendors.find(v => v.id === contact.id))}
                placeholder="Choose vendor"
                type="vendor"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        )}

        {/* Message Preview and WhatsApp Send Side by Side */}
        {selectedVendor && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <GroceryMessagePreview 
              cartItems={cartItems}
              selectedLanguage={selectedLanguage}
            />
            <GroceryWhatsAppReminder 
              cartItems={cartItems} 
              selectedLanguage={selectedLanguage}
              vendorContact={selectedVendor.phone_number}
              onOrderPlaced={handleOrderPlaced}
            />
          </div>
        )}

        {/* Frequently Bought Items */}
        <FrequentlyBoughtItems 
          items={frequentlyBoughtItems}
          onToggleInCart={toggleInCart}
        />

        {/* Main Tabs */}
        <Tabs defaultValue="cart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="cart">Cart ({cartItems.length})</TabsTrigger>
            <TabsTrigger value="grocery-list">Grocery List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cart">
            <GroceryCart 
              cartItems={cartItems}
              onToggleInCart={toggleInCart}
              onUpdateQuantity={updateQuantity}
              vendorContact={selectedVendor?.phone_number || ''}
              selectedLanguage={selectedLanguage}
              onOrderPlaced={handleOrderPlaced}
            />
          </TabsContent>
          
          <TabsContent value="grocery-list">
            <GroceryItemsList 
              items={groceryItems}
              onToggleInCart={toggleInCart}
              onUpdateQuantity={updateQuantity}
              onDeleteItem={deleteItem}
              onAddNewItem={addNewItem}
            />
          </TabsContent>
        </Tabs>

        {/* Compact Grocery Order Log */}
        <div className="mt-4">
          <GroceryOrderLog />
        </div>
      </div>
    </div>
  );
};

export default GroceryManager;
