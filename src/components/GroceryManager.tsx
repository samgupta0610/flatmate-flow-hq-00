
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    deleteItem
  } = useGroceryList();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const placeOrder = () => {
    setOrderPlaced(true);
    
    setTimeout(() => {
      setOrderPlaced(false);
      // Reset cart items
      cartItems.forEach(item => toggleInCart(item.id));
    }, 1500);
  };

  const handleWhatsAppSent = () => {
    console.log('WhatsApp message sent, order logged');
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
        {/* Language Selector */}
        <div className="mb-4">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Message Preview and WhatsApp Send */}
        <div className="mb-4">
          <GroceryMessagePreview 
            cartItems={cartItems}
            selectedLanguage={selectedLanguage}
          />
        </div>

        <div className="mb-4">
          <GroceryWhatsAppReminder 
            cartItems={cartItems} 
            selectedLanguage={selectedLanguage}
            onMessageSent={handleWhatsAppSent}
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
              onPlaceOrder={placeOrder}
              orderPlaced={orderPlaced}
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
