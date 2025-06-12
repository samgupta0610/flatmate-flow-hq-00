
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Calendar, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface GroceryOrder {
  id: string;
  items: string[];
  totalCost: number;
  date: string;
  vendor: string;
}

const GroceryOrderLog: React.FC = () => {
  const [orders, setOrders] = useState<GroceryOrder[]>([
    {
      id: '1',
      items: ['Onions - 1kg', 'Milk - 500ml', 'Tomatoes - 500g'],
      totalCost: 150,
      date: '2024-06-11 10:30 AM',
      vendor: '+919876543210'
    },
    {
      id: '2',
      items: ['Rice - 2kg', 'Oil - 1L', 'Sugar - 1kg'],
      totalCost: 280,
      date: '2024-06-10 2:15 PM',
      vendor: '+919876543210'
    }
  ]);
  
  const [newOrderCost, setNewOrderCost] = useState('');
  const [showAddCost, setShowAddCost] = useState(false);
  const { toast } = useToast();

  const addOrderLog = (items: string[], vendor: string) => {
    if (!newOrderCost.trim()) {
      toast({
        title: "Cost required",
        description: "Please enter the total cost for this order.",
        variant: "destructive"
      });
      return;
    }

    const newOrder: GroceryOrder = {
      id: Date.now().toString(),
      items,
      totalCost: parseFloat(newOrderCost),
      date: new Date().toLocaleString(),
      vendor
    };

    setOrders([newOrder, ...orders]);
    setNewOrderCost('');
    setShowAddCost(false);
    
    toast({
      title: "Order logged! 📝",
      description: "Your grocery order has been added to the log.",
    });
  };

  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + order.totalCost, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Grocery Order Log
        </CardTitle>
        <CardDescription>Track your grocery orders and spending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-bold text-maideasy-secondary">{orders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold text-green-600">₹{getTotalSpent()}</p>
          </div>
        </div>

        {/* Add Cost Input (shown when needed) */}
        {showAddCost && (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-3">
            <div className="space-y-2">
              <Label htmlFor="order-cost">Total Cost for Last Order</Label>
              <Input
                id="order-cost"
                type="number"
                placeholder="e.g. 250"
                value={newOrderCost}
                onChange={(e) => setNewOrderCost(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => addOrderLog(['Recent order items'], 'Vendor')}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddCost(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Order History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Recent Orders</h4>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAddCost(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Log Cost
            </Button>
          </div>
          
          {orders.map((order) => (
            <div key={order.id} className="p-3 border rounded-lg bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">₹{order.totalCost}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Items:</p>
                <div className="flex flex-wrap gap-1">
                  {order.items.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No orders logged yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroceryOrderLog;
