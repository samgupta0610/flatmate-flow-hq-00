
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from 'lucide-react';
import { MealItem, DailyPlan } from '@/types/meal';
import { useToast } from "@/hooks/use-toast";

interface AddFoodItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealItems: MealItem[];
  selectedMealType: keyof DailyPlan;
  onAddMeal: (meal: MealItem) => void;
}

const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({ 
  open, 
  onOpenChange, 
  mealItems, 
  selectedMealType,
  onAddMeal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [peopleCount, setPeopleCount] = useState('2');
  const { toast } = useToast();

  const filteredItems = mealItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory || 
      item.category === 'general' ||
      item.category === selectedMealType;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (item: MealItem) => {
    const mealWithPeopleCount = { 
      ...item, 
      peopleCount: parseInt(peopleCount) || 2 
    };
    onAddMeal(mealWithPeopleCount);
    
    toast({
      title: "Food Item Added!",
      description: `${item.name} has been added to ${selectedMealType}.`,
    });
    
    onOpenChange(false);
    setSearchTerm('');
    setSelectedCategory('all');
    setPeopleCount('2');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2 capitalize">
            <Plus className="w-5 h-5" />
            Add Food Item to {selectedMealType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food items..."
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="text-sm">People</Label>
                <Input
                  type="number"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  min="1"
                  max="20"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Food Items List */}
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            <div className="space-y-0">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.calories} cal • {item.ingredients.join(', ')}
                        </p>
                        {item.suggestions && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {item.suggestions}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="ml-3 h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(item);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">No food items found</p>
                  <p className="text-xs mt-1">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodItemModal;
