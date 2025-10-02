# Migration Guide: Shadcn/UI to Material UI (Material Design 3)

## Overview
This guide will help you migrate components from Shadcn/UI (Radix UI + Tailwind) to Material UI following Material Design 3 specifications.

Reference: [Material Design 3 Documentation](https://m3.material.io/)

## ✅ What's Already Done

### 1. MUI Theme Setup
- ✅ Created Material Design 3 theme configuration in `src/theme/muiTheme.ts`
- ✅ Integrated ThemeProvider in `src/App.tsx`
- ✅ Configured custom color palette matching existing brand colors
- ✅ Set up typography, spacing, and shape systems
- ✅ Customized component styles for Material Design 3 aesthetics

### 2. Migrated Components
- ✅ **AddTaskModal** - Fully migrated to MUI Dialog with Material Design 3 styling

## 🎨 Material Design 3 Principles

### Key Design Changes
1. **Rounded Corners**: MD3 uses more rounded corners (16-28px)
2. **Elevation/Shadow**: Softer, more subtle shadows
3. **Typography**: Sentence case for buttons (not uppercase)
4. **State Layers**: Hover and focus states use color overlays
5. **Color System**: Dynamic color tokens with surface tints

## 📦 Component Migration Map

### Dialog/Modal Components
```tsx
// OLD (Shadcn)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// NEW (MUI)
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
```

**Key Changes:**
- `DialogHeader` → Remove wrapper, use `DialogTitle` directly
- Actions go in `DialogActions` component
- Use `dividers` prop on `DialogContent` for visual separation
- Control with `open` and `onClose` instead of `onOpenChange`

### Button Components
```tsx
// OLD (Shadcn)
import { Button } from "@/components/ui/button";
<Button variant="outline" size="sm">Click</Button>

// NEW (MUI)
import { Button } from '@mui/material';
<Button variant="outlined" size="small">Click</Button>
```

**Variant Mapping:**
- `default` → `contained`
- `outline` → `outlined`
- `ghost` → `text`
- `link` → `text` with `sx={{ textDecoration: 'underline' }}`

### Input Components
```tsx
// OLD (Shadcn)
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
<Label>Name</Label>
<Input placeholder="Enter name" />

// NEW (MUI)
import { TextField } from '@mui/material';
<TextField label="Name" placeholder="Enter name" fullWidth />
```

**Key Changes:**
- Label is integrated into TextField
- Use `helperText` prop for hint text
- `fullWidth` prop for responsive width

### Textarea Components
```tsx
// OLD (Shadcn)
import { Textarea } from "@/components/ui/textarea";
<Textarea rows={3} />

// NEW (MUI)
import { TextField } from '@mui/material';
<TextField multiline rows={3} fullWidth />
```

### Checkbox Components
```tsx
// OLD (Shadcn)
import { Checkbox } from "@/components/ui/checkbox";
<Checkbox checked={value} onCheckedChange={setValue} />

// NEW (MUI)
import { Checkbox, FormControlLabel } from '@mui/material';
<FormControlLabel 
  control={<Checkbox checked={value} onChange={(e) => setValue(e.target.checked)} />}
  label="Label text"
/>
```

### Collapsible Components
```tsx
// OLD (Shadcn)
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// NEW (MUI)
import { Collapse } from '@mui/material';
// Use state to control open/closed
<Collapse in={open}>
  {/* Content */}
</Collapse>
```

### Select/Dropdown Components
```tsx
// OLD (Shadcn)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// NEW (MUI)
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
<FormControl fullWidth>
  <InputLabel>Label</InputLabel>
  <Select value={value} onChange={(e) => setValue(e.target.value)}>
    <MenuItem value="option1">Option 1</MenuItem>
    <MenuItem value="option2">Option 2</MenuItem>
  </Select>
</FormControl>
```

### Card Components
```tsx
// OLD (Shadcn)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// NEW (MUI)
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
<Card>
  <CardHeader title="Title" />
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badge/Chip Components
```tsx
// OLD (Shadcn)
import { Badge } from "@/components/ui/badge";
<Badge variant="secondary">Label</Badge>

// NEW (MUI)
import { Chip } from '@mui/material';
<Chip label="Label" color="secondary" />
```

### Switch Components
```tsx
// OLD (Shadcn)
import { Switch } from "@/components/ui/switch";
<Switch checked={value} onCheckedChange={setValue} />

// NEW (MUI)
import { Switch, FormControlLabel } from '@mui/material';
<FormControlLabel
  control={<Switch checked={value} onChange={(e) => setValue(e.target.checked)} />}
  label="Label"
/>
```

### Slider Components
```tsx
// OLD (Shadcn)
import { Slider } from "@/components/ui/slider";
<Slider value={[value]} onValueChange={([v]) => setValue(v)} />

// NEW (MUI)
import { Slider } from '@mui/material';
<Slider value={value} onChange={(_, v) => setValue(v as number)} />
```

### Tabs Components
```tsx
// OLD (Shadcn)
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// NEW (MUI)
import { Tabs, Tab, Box } from '@mui/material';
// Use with state management for active tab
```

### Toast/Snackbar Components
```tsx
// OLD (Shadcn/Sonner)
import { toast } from "sonner";
toast("Message");

// NEW (MUI)
import { Snackbar, Alert } from '@mui/material';
// Implement with state management
```

### Tooltip Components
```tsx
// OLD (Shadcn)
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// NEW (MUI)
import { Tooltip } from '@mui/material';
<Tooltip title="Tooltip text">
  <Button>Hover me</Button>
</Tooltip>
```

### Table Components
```tsx
// OLD (Shadcn)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// NEW (MUI)
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Header</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {/* rows */}
    </TableBody>
  </Table>
</TableContainer>
```

## 🎯 Icons Migration

### Lucide React → MUI Icons Material
```tsx
// OLD
import { Plus, Settings, ChevronDown } from 'lucide-react';

// NEW
import { Add, Settings, ExpandMore } from '@mui/icons-material';
```

**Common Icon Mappings:**
- `Plus` → `Add`
- `ChevronDown` → `ExpandMore`
- `ChevronUp` → `ExpandLess`
- `ChevronRight` → `ChevronRight`
- `ChevronLeft` → `ChevronLeft`
- `X` → `Close`
- `Check` → `Check`
- `Trash` → `Delete`
- `Edit` → `Edit`
- `Search` → `Search`
- `Menu` → `Menu`
- `MoreVertical` → `MoreVert`
- `MoreHorizontal` → `MoreHoriz`
- `AlertCircle` → `Error`
- `AlertTriangle` → `Warning`
- `Info` → `Info`
- `Calendar` → `CalendarToday`

## 🎨 Styling Approach

### CSS-in-JS with `sx` prop
Material UI uses emotion for styling. Instead of className with Tailwind, use the `sx` prop:

```tsx
// OLD (Tailwind)
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">

// NEW (MUI sx prop)
<Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: 2,  // theme.spacing(2) = 16px
  p: 4,    // theme.spacing(4) = 32px
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 1
}}>
```

### Common Tailwind to MUI Conversions:

**Layout:**
- `flex` → `display: 'flex'`
- `flex-col` → `flexDirection: 'column'`
- `items-center` → `alignItems: 'center'`
- `justify-between` → `justifyContent: 'space-between'`
- `gap-2` → `gap: 2` (2 * 8px = 16px)
- `w-full` → `width: '100%'` or `fullWidth` prop
- `h-12` → `height: 48` (use px values or spacing units)

**Spacing:**
- `p-4` → `p: 4` (4 * 8px = 32px)
- `px-6` → `px: 6` (48px)
- `py-2` → `py: 2` (16px)
- `m-4` → `m: 4`
- `mt-2` → `mt: 2`
- `mb-4` → `mb: 4`

**Typography:**
- `text-sm` → `fontSize: '0.875rem'` or use Typography variant
- `text-base` → `fontSize: '1rem'`
- `text-lg` → `fontSize: '1.125rem'`
- `font-medium` → `fontWeight: 500`
- `font-bold` → `fontWeight: 700`

**Colors:**
- `text-gray-600` → `color: 'text.secondary'`
- `bg-white` → `bgcolor: 'background.paper'`
- `bg-blue-600` → `bgcolor: 'primary.main'`
- `border-gray-200` → `borderColor: 'divider'`

**Border Radius:**
- `rounded` → `borderRadius: 1`
- `rounded-lg` → `borderRadius: 2`
- `rounded-full` → `borderRadius: '50%'`

**Shadows:**
- `shadow-sm` → `boxShadow: 1`
- `shadow-md` → `boxShadow: 2`
- `shadow-lg` → `boxShadow: 3`

## 📐 Layout Components

### Use MUI Layout Components
```tsx
import { Box, Stack, Grid, Container } from '@mui/material';

// Stack for vertical/horizontal layouts
<Stack spacing={2} direction="row">
  {/* items */}
</Stack>

// Grid for responsive layouts
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    {/* content */}
  </Grid>
</Grid>

// Container for max-width centering
<Container maxWidth="lg">
  {/* content */}
</Container>
```

## 🎭 Form Handling

### React Hook Form Integration
```tsx
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

const { control, handleSubmit } = useForm();

<Controller
  name="taskName"
  control={control}
  render={({ field }) => (
    <TextField {...field} label="Task Name" fullWidth />
  )}
/>
```

## 🚀 Migration Strategy

### Step-by-Step Process:

1. **Identify Component Usage**
   ```bash
   # Find all usages of a shadcn component
   grep -r "from \"@/components/ui/" src/
   ```

2. **Create MUI Version**
   - Start with a new file or duplicate
   - Replace imports
   - Update component structure
   - Migrate styles from Tailwind to sx prop
   - Test functionality

3. **Replace Gradually**
   - Migrate one component at a time
   - Test thoroughly before moving to next
   - Update imports in consuming components

4. **Clean Up**
   - Remove unused shadcn components from `src/components/ui/`
   - Remove Radix UI dependencies (after full migration)
   - Keep Tailwind for utility classes if needed

## 📊 Priority Order for Migration

### High Priority (User-Facing)
1. ✅ AddTaskModal
2. ⏳ EditTaskModal
3. ⏳ TaskItem
4. ⏳ TaskTable
5. ⏳ Dashboard components

### Medium Priority
6. ⏳ Settings modals
7. ⏳ Profile components
8. ⏳ Navigation components
9. ⏳ Meal planner components
10. ⏳ Grocery manager components

### Low Priority
11. ⏳ Utility components
12. ⏳ Shared UI components

## 🔧 Testing Checklist

After migrating each component:
- [ ] Visual appearance matches design
- [ ] All interactions work (clicks, keyboard navigation)
- [ ] Form validation works
- [ ] Accessibility (ARIA labels, keyboard support)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Theme colors apply correctly
- [ ] Dark mode support (if applicable)
- [ ] Performance (no lag or jank)

## 📚 Resources

- [Material Design 3](https://m3.material.io/)
- [MUI Documentation](https://mui.com/material-ui/)
- [MUI Components](https://mui.com/material-ui/all-components/)
- [MUI System (sx prop)](https://mui.com/system/getting-started/the-sx-prop/)
- [MUI Customization](https://mui.com/material-ui/customization/theming/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)

## 💡 Pro Tips

1. **Use Stack for Quick Layouts**: Replace flex divs with `<Stack>` for cleaner code
2. **Leverage Theme**: Use theme tokens instead of hardcoded values
3. **Consistent Spacing**: Use theme spacing units (multiples of 8px)
4. **FormControl Pattern**: Wrap form inputs in FormControl for consistent styling
5. **Typography Component**: Use `<Typography>` instead of div/p/span for text
6. **Box for Containers**: Use `<Box>` as a general-purpose container
7. **Theme Colors**: Reference colors via `primary.main`, `text.secondary`, etc.
8. **Responsive Props**: Many components accept responsive object values

## 🐛 Common Issues

### Issue: Styling not applying
**Solution**: Ensure sx prop is used correctly, check theme provider is wrapping app

### Issue: Form not submitting
**Solution**: Check event handlers match MUI patterns (e.g., `onChange` vs `onCheckedChange`)

### Issue: Icons not showing
**Solution**: Import from `@mui/icons-material`, not `lucide-react`

### Issue: Layout breaking
**Solution**: Use MUI's Box/Stack/Grid instead of Tailwind flex classes

### Issue: Colors not matching
**Solution**: Update theme configuration in `muiTheme.ts`

## 🎉 Next Steps

After completing component migration:
1. Remove unused Radix UI packages
2. Clean up shadcn ui components folder
3. Update documentation
4. Train team on MUI patterns
5. Establish component library guidelines

---

**Last Updated**: October 1, 2025
**Status**: 🟢 In Progress - AddTaskModal completed

