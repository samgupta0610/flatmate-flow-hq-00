
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroceryList } from '@/hooks/useGroceryList';
import GroceryMessagePreview from './GroceryMessagePreview';
import GroceryWhatsAppReminder from './GroceryWhatsAppReminder';
import FrequentlyBoughtItems from './FrequentlyBoughtItems';
import GroceryCart from './GroceryCart';
import GroceryItemsList from './GroceryItemsList';
import GroceryOrderLog from './GroceryOrderLog';
import LanguageSelector from './LanguageSelector';

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

  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [vendorContact, setVendorContact] = useState('');

  const handleOrderPlaced = (orderDetails: any) => {
    addOrderToHistory(orderDetails);
    clearCart();
  };

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
        {/* Vendor Contact and Language */}
        <div className="mb-4 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="vendor-contact" className="text-sm font-medium">
                Vendor Contact Number
              </Label>
              <Input
                id="vendor-contact"
                type="tel"
                placeholder="e.g. +919876543210"
                value={vendorContact}
                onChange={(e) => setVendorContact(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Preferred Language
              </Label>
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>

        {/* Message Preview and WhatsApp Send Side by Side */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <GroceryMessagePreview 
            cartItems={cartItems}
            selectedLanguage={selectedLanguage}
          />
          <GroceryWhatsAppReminder 
            cartItems={cartItems} 
            selectedLanguage={selectedLanguage}
            vendorContact={vendorContact}
            onOrderPlaced={handleOrderPlaced}
          />
        </div>

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
              vendorContact={vendorContact}
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
