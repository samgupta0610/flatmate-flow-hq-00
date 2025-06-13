
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Plus, Minus, Trash, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import GroceryWhatsAppReminder from './GroceryWhatsAppReminder';
import GroceryOrderLog from './GroceryOrderLog';
import LanguageSelector from './LanguageSelector';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  critical: boolean;
  unit: string;
  category: 'dairy' | 'vegetables' | 'fruits' | 'grains' | 'other';
  inCart: boolean;
  usageFrequency: number; // Track how often this item is used
}

const GroceryManager = () => {
  const { toast } = useToast();
  
  // Smart quantity multipliers based on product type
  const getQuantityMultiplier = (category: string, name: string): number => {
    const lowerName = name.toLowerCase();
    
    // 250g/ml for vegetables, fruits, dairy, oil, ghee
    if (category === 'vegetables' || category === 'fruits' || category === 'dairy') {
      return 250;
    }
    
    // Oil and ghee
    if (lowerName.includes('oil') || lowerName.includes('ghee')) {
      return 250;
    }
    
    // Default to 1 for grains and other items (use quantity as unit)
    return 1;
  };

  const units = ["g", "ml", "kg", "l", "pcs", "packet"];

  // Mock grocery data with usage frequency for smart cart suggestions
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    { id: 1, name: "Onions", quantity: "500", unit: "g", critical: true, category: 'vegetables', inCart: false, usageFrequency: 8 },
    { id: 2, name: "Milk", quantity: "500", unit: "ml", critical: true, category: 'dairy', inCart: false, usageFrequency: 9 },
    { id: 3, name: "Butter", quantity: "250", unit: "g", critical: false, category: 'dairy', inCart: false, usageFrequency: 4 },
    { id: 4, name: "Rice", quantity: "2", unit: "kg", critical: false, category: 'grains', inCart: false, usageFrequency: 7 },
    { id: 5, name: "Tomatoes", quantity: "500", unit: "g", critical: true, category: 'vegetables', inCart: false, usageFrequency: 8 },
    { id: 6, name: "Apples", quantity: "750", unit: "g", critical: false, category: 'fruits', inCart: false, usageFrequency: 5 },
    { id: 7, name: "Bread", quantity: "1", unit: "packet", critical: false, category: 'other', inCart: false, usageFrequency: 6 },
    { id: 8, name: "Potatoes", quantity: "750", unit: "g", critical: false, category: 'vegetables', inCart: false, usageFrequency: 7 },
    { id: 9, name: "Curd", quantity: "500", unit: "g", critical: false, category: 'dairy', inCart: false, usageFrequency: 6 },
    { id: 10, name: "Cooking Oil", quantity: "500", unit: "ml", critical: false, category: 'other', inCart: false, usageFrequency: 3 },
  ]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("g");
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('vegetables');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const cartItems = groceryItems.filter(item => item.inCart);

  const addNewItem = () => {
    if (!newItemName.trim() || !newItemQuantity.trim()) return;
    
    const newItem: GroceryItem = {
      id: Math.max(...groceryItems.map(i => i.id)) + 1,
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      critical: false,
      category: newItemCategory,
      inCart: false,
      usageFrequency: 1
    };
    
    setGroceryItems([...groceryItems, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    
    toast({
      title: "Item Added!",
      description: `${newItemName} has been added to your inventory.`,
    });
  };

  const toggleInCart = (itemId: number) => {
    setGroceryItems(items => items.map(item => {
      if (item.id === itemId) {
        // Increase usage frequency when added to cart
        const updatedUsageFrequency = item.inCart ? item.usageFrequency : item.usageFrequency + 1;
        return { ...item, inCart: !item.inCart, usageFrequency: updatedUsageFrequency };
      }
      return item;
    }));
  };

  const updateQuantity = (itemId: number, increment: boolean) => {
    setGroceryItems(items => items.map(item => {
      if (item.id === itemId) {
        const currentQty = parseFloat(item.quantity);
        const multiplier = getQuantityMultiplier(item.category, item.name);
        const delta = increment ? multiplier : -multiplier;
        const newQty = Math.max(multiplier, currentQty + delta);
        const critical = newQty <= multiplier; // Set critical based on one unit
        return { ...item, quantity: newQty.toString(), critical };
      }
      return item;
    }));
  };

  const markCritical = (itemId: number) => {
    setGroceryItems(items => items.map(item => 
      item.id === itemId ? { ...item, critical: !item.critical } : item
    ));
  };

  const deleteItem = (itemId: number) => {
    setGroceryItems(items => items.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Deleted!",
      description: "The item has been removed from your inventory.",
    });
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    
    setTimeout(() => {
      setOrderPlaced(false);
      
      toast({
        title: "Order Placed! 🛍️",
        description: "Your order has been placed successfully.",
      });
      
      // Reset cart
      setGroceryItems(items => items.map(item => ({ ...item, inCart: false })));
    }, 1500);
  };

  const addAllLowStockToCart = () => {
    setGroceryItems(items => items.map(item => 
      item.critical ? { ...item, inCart: true } : item
    ));
    
    toast({
      title: "Low Stock Items Added!",
      description: "All low stock items have been added to your cart.",
    });
  };

  // Smart suggestions based on usage frequency
  const getFrequentlyUsedItems = () => {
    return groceryItems
      .filter(item => !item.inCart && item.usageFrequency >= 6)
      .sort((a, b) => b.usageFrequency - a.usageFrequency)
      .slice(0, 4);
  };

  const addFrequentItemsToCart = () => {
    const frequentItems = getFrequentlyUsedItems();
    setGroceryItems(items => items.map(item => 
      frequentItems.some(fi => fi.id === item.id) ? { ...item, inCart: true } : item
    ));
    
    toast({
      title: "Frequent Items Added!",
      description: `Added ${frequentItems.length} frequently used items to your cart.`,
    });
  };

  // Callback function to handle when WhatsApp message is sent
  const handleWhatsAppSent = () => {
    // This will be called from the WhatsApp component when message is sent
    console.log('WhatsApp message sent, order logged');
  };

  // Group items by category for better organization
  const itemsByCategory = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as {[key in GroceryItem['category']]: GroceryItem[]});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Grocery Manager</h1>
            <p className="text-sm text-gray-500">Smart grocery shopping</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {cartItems.length} items
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={addAllLowStockToCart} 
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> 
            Add Low Stock
          </Button>
          <Button 
            onClick={addFrequentItemsToCart} 
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
          >
            Add Frequent
          </Button>
          <Button 
            onClick={placeOrder} 
            disabled={cartItems.length === 0 || orderPlaced}
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
          >
            {orderPlaced ? "Placing..." : "Checkout"}
          </Button>
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

        {/* Smart Suggestions */}
        {getFrequentlyUsedItems().length > 0 && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Frequently Used Items</CardTitle>
              <CardDescription className="text-sm">Based on your shopping history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {getFrequentlyUsedItems().map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleInCart(item.id)}
                    className="h-auto p-2 text-left"
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.quantity} {item.unit}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cartItems.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            {/* Add New Item */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add New Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <Input 
                      placeholder="Item name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                  </div>
                  <Input 
                    type="number"
                    placeholder="Qty"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as GroceryItem['category'])}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="dairy">Dairy</option>
                  <option value="grains">Grains</option>
                  <option value="other">Other</option>
                </select>
                <Button onClick={addNewItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
            
            {/* Items by Category */}
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border ${
                        item.critical ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.critical && <span className="text-red-500 text-sm">🚨</span>}
                          <span className={`font-medium ${item.critical ? 'text-red-700' : ''}`}>
                            {item.name}
                          </span>
                          {item.usageFrequency >= 7 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              Frequent
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, false)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm min-w-[4rem] text-center">
                            {item.quantity} {item.unit}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, true)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant={item.inCart ? "default" : "outline"}
                          size="sm"
                          className={`h-6 text-xs px-2 ${item.inCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => toggleInCart(item.id)}
                        >
                          {item.inCart ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="cart" className="space-y-4">
            {cartItems.length > 0 ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Shopping Cart</CardTitle>
                    <CardDescription className="text-sm">
                      {cartItems.length} items ready for order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.quantity} {item.unit}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {item.category}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, false)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, true)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                            onClick={() => toggleInCart(item.id)}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="pt-4 border-t">
                    <Button 
                      onClick={placeOrder}
                      disabled={orderPlaced} 
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {orderPlaced ? "Placing Order..." : `Order ${cartItems.length} Items`}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Add items from your inventory to place an order
                  </p>
                  <Button
                    variant="outline"
                    onClick={addAllLowStockToCart}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    Add Low Stock Items
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* WhatsApp Vendor Reminder */}
        <div className="mt-6">
          <GroceryWhatsAppReminder 
            cartItems={cartItems} 
            selectedLanguage={selectedLanguage}
            onMessageSent={handleWhatsAppSent}
          />
        </div>

        {/* Grocery Order Log */}
        <div className="mt-6">
          <GroceryOrderLog />
        </div>
      </div>
    </div>
  );
};

export default GroceryManager;
