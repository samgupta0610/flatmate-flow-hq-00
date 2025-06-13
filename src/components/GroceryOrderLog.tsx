
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useGroceryList } from '@/hooks/useGroceryList';

const GroceryOrderLog = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { orderHistory } = useGroceryList();

  return (
    <Card className="mb-4">
      <CardHeader 
        className="pb-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Order History
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {orderHistory.length} orders
            </Badge>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardTitle>
        <CardDescription className="text-xs">
          Recent grocery orders sent via WhatsApp
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {orderHistory.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                No orders placed yet
              </p>
            ) : (
              orderHistory.map((order) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium">
                      {order.date} at {order.time}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Sent
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    Vendor: {order.vendorNumber}
                  </p>
                  <p className="text-xs text-gray-600">
                    Items: {order.cartList.join(', ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default GroceryOrderLog;
