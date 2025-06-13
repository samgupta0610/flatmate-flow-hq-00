
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardList, Plus, Calendar, DollarSign, Edit, Trash2, Save, X } from 'lucide-react';
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
      items: ['Onions - 500g', 'Milk - 500ml', 'Tomatoes - 500g'],
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
  
  const [editingOrder, setEditingOrder] = useState<GroceryOrder | null>(null);
  const [editCost, setEditCost] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const { toast } = useToast();

  // Listen for grocery orders sent via WhatsApp
  useEffect(() => {
    const handleOrderSent = (event: CustomEvent) => {
      const { items, vendor, date } = event.detail;
      
      const newOrder: GroceryOrder = {
        id: Date.now().toString(),
        items,
        totalCost: 0, // Will be edited by user
        date,
        vendor
      };

      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Order logged! 📝",
        description: "Your grocery order has been added. Don't forget to update the cost.",
      });
    };

    window.addEventListener('groceryOrderSent', handleOrderSent as EventListener);
    
    return () => {
      window.removeEventListener('groceryOrderSent', handleOrderSent as EventListener);
    };
  }, [toast]);

  const startEditing = (order: GroceryOrder) => {
    setEditingOrder(order);
    setEditCost(order.totalCost.toString());
  };

  const saveEdit = () => {
    if (!editingOrder || !editCost.trim()) return;

    const cost = parseFloat(editCost);
    if (isNaN(cost) || cost < 0) {
      toast({
        title: "Invalid cost",
        description: "Please enter a valid cost amount.",
        variant: "destructive"
      });
      return;
    }

    setOrders(prev => prev.map(order => 
      order.id === editingOrder.id 
        ? { ...order, totalCost: cost }
        : order
    ));

    setEditingOrder(null);
    setEditCost('');
    
    toast({
      title: "Order updated! ✅",
      description: "The order cost has been updated.",
    });
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setEditCost('');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    setShowDeleteDialog(null);
    
    toast({
      title: "Order deleted!",
      description: "The order has been removed from your log.",
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
            <p className="text-xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold text-green-600">₹{getTotalSpent()}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Orders</h4>
          
          {orders.map((order) => (
            <div key={order.id} className="p-3 border rounded-lg bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  {editingOrder?.id === order.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editCost}
                        onChange={(e) => setEditCost(e.target.value)}
                        placeholder="Cost"
                        className="w-20 h-6 text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-green-600"
                        onClick={saveEdit}
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={cancelEdit}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">₹{order.totalCost}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-blue-500"
                          onClick={() => startEditing(order)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        
                        <Dialog open={showDeleteDialog === order.id} onOpenChange={(open) => setShowDeleteDialog(open ? order.id : null)}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500"
                              onClick={() => setShowDeleteDialog(order.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Delete Order</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this order? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteOrder(order.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
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
                {order.vendor && (
                  <p className="text-xs text-gray-500 mt-1">Vendor: {order.vendor}</p>
                )}
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No orders logged yet</p>
              <p className="text-sm">Orders will be automatically logged when you send WhatsApp messages</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroceryOrderLog;
