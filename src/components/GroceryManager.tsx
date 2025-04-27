import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Plus, Minus, Trash, Check, AlertTriangle, ClipboardCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  critical: boolean;
  unit: string;
  category: 'dairy' | 'vegetables' | 'fruits' | 'grains' | 'other';
  inCart: boolean;
}

const GroceryManager = () => {
  const { toast } = useToast();
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kg");
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('vegetables');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedDeliveryApp, setSelectedDeliveryApp] = useState("zepto");
  const [activeTab, setActiveTab] = useState("inventory");
  
  const units = ["kg", "g", "pcs", "l", "ml", "packet"];
  
  // Mock grocery data
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    { id: 1, name: "Onions", quantity: "1", unit: "kg", critical: true, category: 'vegetables', inCart: true },
    { id: 2, name: "Milk", quantity: "500", unit: "ml", critical: true, category: 'dairy', inCart: true },
    { id: 3, name: "Butter", quantity: "100", unit: "g", critical: false, category: 'dairy', inCart: false },
    { id: 4, name: "Rice", quantity: "2", unit: "kg", critical: false, category: 'grains', inCart: false },
    { id: 5, name: "Tomatoes", quantity: "500", unit: "g", critical: true, category: 'vegetables', inCart: true },
    { id: 6, name: "Apples", quantity: "4", unit: "pcs", critical: false, category: 'fruits', inCart: false },
    { id: 7, name: "Bread", quantity: "1", unit: "packet", critical: false, category: 'other', inCart: false },
    { id: 8, name: "Potatoes", quantity: "2", unit: "kg", critical: false, category: 'vegetables', inCart: false },
  ]);
  
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
      inCart: false
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
    setGroceryItems(items => items.map(item => 
      item.id === itemId ? { ...item, inCart: !item.inCart } : item
    ));
  };
  
  const updateQuantity = (itemId: number, delta: number) => {
    setGroceryItems(items => items.map(item => {
      if (item.id === itemId) {
        const currentQty = parseFloat(item.quantity);
        const newQty = Math.max(0, currentQty + delta);
        const critical = newQty <= 1; // Set critical flag based on quantity
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
    // In a real app, this would connect to delivery app APIs
    setOrderPlaced(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrderPlaced(false);
      
      toast({
        title: "Order Placed! 🛍️",
        description: `Your order has been placed through ${selectedDeliveryApp.charAt(0).toUpperCase() + selectedDeliveryApp.slice(1)}.`,
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
  
  // Group items by category for better organization
  const itemsByCategory = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as {[key in GroceryItem['category']]: GroceryItem[]});

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-maideasy-navy">Grocery Manager</h1>
          <p className="text-gray-500 mt-1">Manage your groceries and order essentials</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
          <Button 
            onClick={addAllLowStockToCart} 
            variant="outline"
            className="border-maideasy-secondary text-maideasy-secondary hover:bg-maideasy-secondary/10 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Add Low Stock to Cart
          </Button>
          <Button 
            onClick={placeOrder} 
            disabled={cartItems.length === 0 || orderPlaced}
            className="bg-maideasy-secondary hover:bg-maideasy-secondary/90 flex items-center gap-2"
          >
            {orderPlaced ? "Placing Order..." : 
              <>
                <ShoppingCart className="w-4 h-4" /> Checkout ({cartItems.length})
              </>
            }
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inventory" className="mt-4">
                  <div className="mb-6">
                    <div className="flex items-end gap-2">
                      <div className="flex-grow">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input 
                          id="item-name" 
                          placeholder="e.g. Onions"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Label htmlFor="item-quantity">Quantity</Label>
                        <Input 
                          id="item-quantity" 
                          type="number"
                          placeholder="e.g. 2"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Label htmlFor="item-unit">Unit</Label>
                        <select
                          id="item-unit"
                          value={newItemUnit}
                          onChange={(e) => setNewItemUnit(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <Label htmlFor="item-category">Category</Label>
                        <select
                          id="item-category"
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value as GroceryItem['category'])}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="vegetables">Vegetables</option>
                          <option value="fruits">Fruits</option>
                          <option value="dairy">Dairy</option>
                          <option value="grains">Grains</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <Button 
                        onClick={addNewItem} 
                        className="bg-maideasy-blue hover:bg-maideasy-blue/90 h-10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="font-medium text-lg mb-2 capitalize">{category}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              item.critical ? 'bg-red-50 border border-red-100' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {item.critical && <span className="text-red-500">🚨</span>}
                              <span className={item.critical ? 'font-medium' : ''}>{item.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {item.quantity} {item.unit}
                              </span>
                              
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, -0.5)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, 0.5)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant={item.inCart ? "default" : "outline"}
                                size="sm"
                                className={`h-8 ${item.inCart ? 'bg-maideasy-secondary hover:bg-maideasy-secondary/90' : ''}`}
                                onClick={() => toggleInCart(item.id)}
                              >
                                {item.inCart ? 'In Cart' : 'Add to Cart'}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="cart" className="mt-4">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {item.quantity} {item.unit}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, -0.5)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, 0.5)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                              onClick={() => toggleInCart(item.id)}
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-6 flex justify-end">
                        <Button 
                          onClick={placeOrder}
                          disabled={orderPlaced} 
                          className="bg-maideasy-secondary hover:bg-maideasy-secondary/90"
                        >
                          {orderPlaced ? "Placing Order..." : "Order Like a Boss"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-4">Add items from your inventory to place an order</p>
                      <Button
                        variant="outline"
                        onClick={addAllLowStockToCart}
                        className="border-maideasy-secondary text-maideasy-secondary hover:bg-maideasy-secondary/10"
                      >
                        Add Low Stock Items to Cart
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Smart Shopping Suggestions</CardTitle>
              <CardDescription>Based on your usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Frequently Bought Together</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Tomatoes + Onions + Ginger</span>
                      <Button size="sm" variant="ghost" className="h-8">
                        <Plus className="w-3 h-3 mr-1" /> Add All
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Milk + Bread + Eggs</span>
                      <Button size="sm" variant="ghost" className="h-8">
                        <Plus className="w-3 h-3 mr-1" /> Add All
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Weekly Essentials</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Rice (5kg Bag)</span>
                      <Button size="sm" variant="ghost" className="h-8">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cooking Oil (1L)</span>
                      <Button size="sm" variant="ghost" className="h-8">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Apps</CardTitle>
              <CardDescription>Choose your preferred service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedDeliveryApp === 'zepto' ? 'border-maideasy-blue bg-maideasy-blue/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedDeliveryApp('zepto')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      Z
                    </div>
                    <div>
                      <p className="font-medium">Zepto</p>
                      <p className="text-xs text-gray-500">10 min delivery</p>
                    </div>
                  </div>
                  {selectedDeliveryApp === 'zepto' && (
                    <Check className="w-5 h-5 text-maideasy-blue" />
                  )}
                </div>
                
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedDeliveryApp === 'blinkit' ? 'border-maideasy-blue bg-maideasy-blue/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedDeliveryApp('blinkit')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                      B
                    </div>
                    <div>
                      <p className="font-medium">Blinkit</p>
                      <p className="text-xs text-gray-500">15 min delivery</p>
                    </div>
                  </div>
                  {selectedDeliveryApp === 'blinkit' && (
                    <Check className="w-5 h-5 text-maideasy-blue" />
                  )}
                </div>
                
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedDeliveryApp === 'bigbasket' ? 'border-maideasy-blue bg-maideasy-blue/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedDeliveryApp('bigbasket')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      BB
                    </div>
                    <div>
                      <p className="font-medium">BigBasket</p>
                      <p className="text-xs text-gray-500">2-hour delivery</p>
                    </div>
                  </div>
                  {selectedDeliveryApp === 'bigbasket' && (
                    <Check className="w-5 h-5 text-maideasy-blue" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets</CardTitle>
              <CardDescription>Grocery inventory sync</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-green-50 flex items-center justify-between">
                  <p className="text-sm font-medium text-green-800">Grocery Inventory Sheet</p>
                  <Badge variant="outline" className="bg-white">Connected</Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-4">
                    Your grocery inventory is synced with Google Sheets. Changes made here will be synced automatically.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open in Google Sheets
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Sync Now
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Last synced: Today at 3:15 PM
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shopping Stats</CardTitle>
              <CardDescription>Your grocery insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Most purchased items:</span>
                  <span className="text-sm font-medium">Milk, Onions, Tomatoes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. weekly spend:</span>
                  <span className="text-sm font-medium">₹1,245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Food waste avoided:</span>
                  <span className="text-sm font-medium text-green-600">12% improvement</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center mb-2">
                  <ClipboardCheck className="w-4 h-4 mr-2 text-maideasy-secondary" />
                  <h4 className="font-medium">Zero Waste Hero Badge</h4>
                </div>
                <p className="text-sm text-gray-500">You're 2 weeks away from earning this badge!</p>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-maideasy-secondary h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroceryManager;
