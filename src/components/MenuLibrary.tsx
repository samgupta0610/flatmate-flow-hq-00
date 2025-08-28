import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Calendar,
  Clock
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useMenuManagement } from '@/hooks/useMenuManagement';
import { formatDistanceToNow } from 'date-fns';
import { WeeklyPlan, DailyPlan } from '@/types/meal';
import MenuOnboardingWizard from './MenuOnboardingWizard';

interface MenuLibraryProps {
  onMenuSelect?: (menuId: string) => void;
}

const MenuLibrary: React.FC<MenuLibraryProps> = ({ onMenuSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
  const [duplicateMenuId, setDuplicateMenuId] = useState<string | null>(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { 
    menus, 
    activeMenu, 
    loading, 
    setActiveMenu, 
    deleteMenu, 
    duplicateMenu, 
    loadUserMenus 
  } = useMenuManagement();

  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteMenu = async () => {
    if (!deleteMenuId) return;
    
    try {
      await deleteMenu(deleteMenuId);
      setDeleteMenuId(null);
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const handleDuplicateMenu = async () => {
    if (!duplicateMenuId || !newMenuName.trim()) return;

    try {
      await duplicateMenu(duplicateMenuId, newMenuName.trim());
      setDuplicateMenuId(null);
      setNewMenuName('');
    } catch (error) {
      console.error('Error duplicating menu:', error);
    }
  };

  const getMealCount = (menuData: WeeklyPlan | null): number => {
    if (!menuData) return 0;
    
    return Object.values(menuData).reduce((total, dayPlan: DailyPlan) => {
      return total + Object.values(dayPlan).reduce((dayTotal, meals) => dayTotal + meals.length, 0);
    }, 0);
  };

  const handleSetActive = async (menuId: string) => {
    try {
      await setActiveMenu(menuId);
      onMenuSelect?.(menuId);
    } catch (error) {
      console.error('Error setting active menu:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Library</h2>
          <p className="text-muted-foreground">Manage your meal planning templates</p>
        </div>
        <Button onClick={() => setShowOnboarding(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create New Menu
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menus..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Menu Grid */}
      {filteredMenus.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Menus Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'No menus match your search criteria.' 
                : 'Get started by creating your first meal plan menu.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowOnboarding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Menu
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenus.map((menu) => (
            <Card key={menu.id} className={`relative transition-all hover:shadow-md ${menu.is_active ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg line-clamp-1">{menu.name}</CardTitle>
                      {menu.is_active && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    {menu.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {menu.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {!menu.is_active && (
                        <DropdownMenuItem onClick={() => handleSetActive(menu.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Set as Active
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
                          setDuplicateMenuId(menu.id);
                          setNewMenuName(`${menu.name} (Copy)`);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setDeleteMenuId(menu.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getMealCount(menu.menu_data as WeeklyPlan)} meals planned
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(menu.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {!menu.is_active && (
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSetActive(menu.id)}
                  >
                    Use This Menu
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMenuId} onOpenChange={() => setDeleteMenuId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu
              and all its meal planning data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMenu}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Menu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Menu Dialog */}
      <AlertDialog open={!!duplicateMenuId} onOpenChange={() => setDuplicateMenuId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for the duplicated menu:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              placeholder="Enter menu name"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewMenuName('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDuplicateMenu}
              disabled={!newMenuName.trim()}
            >
              Duplicate Menu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Menu Onboarding Wizard */}
      <MenuOnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={loadUserMenus}
      />
    </div>
  );
};

export default MenuLibrary;