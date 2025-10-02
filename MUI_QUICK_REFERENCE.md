# Material UI Quick Reference Cheat Sheet

## 🚀 Quick Start

```tsx
import { Button, Box, Stack, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
```

## 📦 Most Used Components

### Button
```tsx
<Button variant="contained" color="primary" startIcon={<Add />}>
  Create
</Button>

// Variants: contained | outlined | text
// Colors: primary | secondary | error | warning | info | success
// Sizes: small | medium | large
```

### TextField (Input)
```tsx
<TextField
  label="Name"
  placeholder="Enter name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  fullWidth
  required
  helperText="Helper text"
  error={hasError}
/>

// Multi-line (textarea)
<TextField multiline rows={4} />
```

### Dialog (Modal)
```tsx
<Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Title</DialogTitle>
  <DialogContent dividers>
    {/* Content */}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="contained">Save</Button>
  </DialogActions>
</Dialog>
```

### Box (Container)
```tsx
<Box sx={{ 
  p: 2,                    // padding: 16px
  m: 1,                    // margin: 8px
  bgcolor: 'primary.main',
  color: 'white',
  borderRadius: 2,         // 16px
  boxShadow: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}}>
  Content
</Box>
```

### Stack (Flex Layout)
```tsx
// Vertical stack (default)
<Stack spacing={2}>
  <Item />
  <Item />
</Stack>

// Horizontal stack
<Stack direction="row" spacing={1} alignItems="center">
  <Item />
  <Item />
</Stack>
```

### Card
```tsx
<Card>
  <CardHeader 
    title="Title"
    subheader="Subtitle"
    avatar={<Avatar>A</Avatar>}
  />
  <CardContent>
    <Typography>Content</Typography>
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>
```

### Select (Dropdown)
```tsx
<FormControl fullWidth>
  <InputLabel>Category</InputLabel>
  <Select value={value} onChange={(e) => setValue(e.target.value)}>
    <MenuItem value="option1">Option 1</MenuItem>
    <MenuItem value="option2">Option 2</MenuItem>
  </Select>
</FormControl>
```

### Chip (Badge)
```tsx
<Chip 
  label="Label"
  color="primary"
  variant="filled"      // filled | outlined
  onDelete={handleDelete}
  icon={<Icon />}
  size="small"
/>
```

### Checkbox
```tsx
<FormControlLabel
  control={
    <Checkbox 
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  }
  label="Label"
/>
```

### Switch
```tsx
<FormControlLabel
  control={
    <Switch 
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
    />
  }
  label="Enable feature"
/>
```

### Radio Group
```tsx
<FormControl>
  <FormLabel>Options</FormLabel>
  <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
    <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
    <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
  </RadioGroup>
</FormControl>
```

### Slider
```tsx
<Slider
  value={value}
  onChange={(_, newValue) => setValue(newValue)}
  min={0}
  max={100}
  step={10}
  marks
  valueLabelDisplay="auto"
/>
```

### ToggleButtonGroup
```tsx
<ToggleButtonGroup
  value={alignment}
  exclusive
  onChange={(_, newAlignment) => setAlignment(newAlignment)}
>
  <ToggleButton value="left">Left</ToggleButton>
  <ToggleButton value="center">Center</ToggleButton>
  <ToggleButton value="right">Right</ToggleButton>
</ToggleButtonGroup>
```

### Tooltip
```tsx
<Tooltip title="Tooltip text" placement="top">
  <IconButton>
    <InfoIcon />
  </IconButton>
</Tooltip>
```

### Snackbar (Toast)
```tsx
<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Message text"
/>

// With Alert
<Snackbar open={open} onClose={handleClose}>
  <Alert severity="success" onClose={handleClose}>
    Success message!
  </Alert>
</Snackbar>
```

### Tabs
```tsx
<Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
  <Tab label="Tab 1" />
  <Tab label="Tab 2" />
  <Tab label="Tab 3" />
</Tabs>

<Box sx={{ p: 3 }}>
  {tab === 0 && <div>Tab 1 content</div>}
  {tab === 1 && <div>Tab 2 content</div>}
  {tab === 2 && <div>Tab 3 content</div>}
</Box>
```

### Collapse
```tsx
<Button onClick={() => setOpen(!open)}>Toggle</Button>
<Collapse in={open}>
  <Box sx={{ p: 2 }}>
    Hidden content
  </Box>
</Collapse>
```

### Accordion
```tsx
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Accordion Title</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>Accordion content</Typography>
  </AccordionDetails>
</Accordion>
```

### List
```tsx
<List>
  <ListItem>
    <ListItemIcon><InboxIcon /></ListItemIcon>
    <ListItemText primary="Inbox" secondary="5 new messages" />
  </ListItem>
  <Divider />
  <ListItem button onClick={handleClick}>
    <ListItemIcon><DraftsIcon /></ListItemIcon>
    <ListItemText primary="Drafts" />
  </ListItem>
</List>
```

### Menu
```tsx
<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
  <MoreVertIcon />
</IconButton>
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
>
  <MenuItem onClick={handleEdit}>Edit</MenuItem>
  <MenuItem onClick={handleDelete}>Delete</MenuItem>
</Menu>
```

### Grid Layout
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content 1</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content 2</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content 3</Card>
  </Grid>
</Grid>

// Breakpoints: xs | sm | md | lg | xl
// xs: 0px, sm: 600px, md: 900px, lg: 1200px, xl: 1536px
```

### Typography
```tsx
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="h6">Heading 6</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="body2">Secondary body</Typography>
<Typography variant="caption">Caption text</Typography>
<Typography variant="button">Button text</Typography>

// Custom styling
<Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
  Custom text
</Typography>
```

## 🎨 SX Prop Reference

### Spacing (8px base unit)
```tsx
sx={{
  p: 1,      // padding: 8px
  pt: 2,     // padding-top: 16px
  pr: 3,     // padding-right: 24px
  pb: 4,     // padding-bottom: 32px
  pl: 5,     // padding-left: 40px
  px: 2,     // padding left/right: 16px
  py: 3,     // padding top/bottom: 24px
  
  m: 1,      // margin: 8px
  mt: 2,     // margin-top: 16px
  mr: 3,     // margin-right: 24px
  mb: 4,     // margin-bottom: 32px
  ml: 5,     // margin-left: 40px
  mx: 2,     // margin left/right: 16px
  my: 3,     // margin top/bottom: 24px
  
  gap: 2,    // gap: 16px
}}
```

### Colors
```tsx
sx={{
  // Background colors
  bgcolor: 'primary.main',
  bgcolor: 'secondary.main',
  bgcolor: 'error.main',
  bgcolor: 'warning.main',
  bgcolor: 'info.main',
  bgcolor: 'success.main',
  bgcolor: 'background.default',
  bgcolor: 'background.paper',
  
  // Text colors
  color: 'text.primary',
  color: 'text.secondary',
  color: 'text.disabled',
  color: 'primary.main',
  
  // Border colors
  borderColor: 'divider',
  borderColor: 'primary.main',
}}
```

### Layout
```tsx
sx={{
  display: 'flex',
  flexDirection: 'row',        // row | column
  alignItems: 'center',        // flex-start | center | flex-end | stretch
  justifyContent: 'space-between', // flex-start | center | flex-end | space-between | space-around
  gap: 2,
  
  width: '100%',
  height: 200,
  minWidth: 300,
  maxWidth: 600,
  
  position: 'relative',        // relative | absolute | fixed | sticky
  top: 0,
  left: 0,
  zIndex: 1000,
}}
```

### Typography
```tsx
sx={{
  fontSize: '1rem',
  fontWeight: 400,             // 300 | 400 | 500 | 600 | 700
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  textAlign: 'center',         // left | center | right | justify
  textTransform: 'uppercase',  // none | uppercase | lowercase | capitalize
  textDecoration: 'underline',
}}
```

### Border & Radius
```tsx
sx={{
  border: 1,
  borderTop: 1,
  borderRight: 1,
  borderBottom: 1,
  borderLeft: 1,
  borderColor: 'divider',
  borderRadius: 1,             // 1 = 8px, 2 = 16px
  borderRadius: '50%',         // circle
}}
```

### Shadow
```tsx
sx={{
  boxShadow: 0,  // no shadow
  boxShadow: 1,  // subtle
  boxShadow: 2,  // medium
  boxShadow: 3,  // pronounced
  boxShadow: 4,  // strong
}}
```

### Hover & Active States
```tsx
sx={{
  '&:hover': {
    bgcolor: 'primary.dark',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&.Mui-selected': {
    bgcolor: 'primary.light',
  },
}}
```

### Responsive
```tsx
sx={{
  width: {
    xs: '100%',    // 0px+
    sm: '80%',     // 600px+
    md: '60%',     // 900px+
    lg: '50%',     // 1200px+
    xl: '40%',     // 1536px+
  },
  display: {
    xs: 'none',    // hidden on mobile
    md: 'flex',    // visible on desktop
  },
}}
```

## 🎭 Common Patterns

### Form with Validation
```tsx
const [values, setValues] = useState({ name: '', email: '' });
const [errors, setErrors] = useState({});

<Stack spacing={2}>
  <TextField
    label="Name"
    value={values.name}
    onChange={(e) => setValues({ ...values, name: e.target.value })}
    error={Boolean(errors.name)}
    helperText={errors.name}
    required
    fullWidth
  />
  <TextField
    label="Email"
    type="email"
    value={values.email}
    onChange={(e) => setValues({ ...values, email: e.target.value })}
    error={Boolean(errors.email)}
    helperText={errors.email}
    required
    fullWidth
  />
  <Button variant="contained" fullWidth>
    Submit
  </Button>
</Stack>
```

### Loading Button
```tsx
import { LoadingButton } from '@mui/lab';

<LoadingButton
  loading={isLoading}
  loadingPosition="start"
  startIcon={<SaveIcon />}
  variant="contained"
  onClick={handleSave}
>
  Save
</LoadingButton>
```

### Confirm Dialog
```tsx
<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this item?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm} variant="contained" color="error">
      Delete
    </Button>
  </DialogActions>
</Dialog>
```

### Loading Skeleton
```tsx
import { Skeleton } from '@mui/material';

{loading ? (
  <Stack spacing={1}>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="rounded" width={100} height={40} />
  </Stack>
) : (
  <Content />
)}
```

### Avatar with Badge
```tsx
<Badge
  overlap="circular"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  badgeContent={<CheckIcon fontSize="small" />}
  color="success"
>
  <Avatar alt="User Name" src="/avatar.jpg" />
</Badge>
```

## 🎯 Icon Reference

```tsx
// Import icons
import {
  Add, Remove, Edit, Delete, Save, Close,
  Check, Cancel, Info, Warning, Error,
  Home, Dashboard, Settings, Person,
  Menu, MoreVert, MoreHoriz,
  ArrowBack, ArrowForward, ArrowUpward, ArrowDownward,
  ExpandMore, ExpandLess, ChevronLeft, ChevronRight,
  Search, FilterList, Sort,
  Visibility, VisibilityOff,
  Favorite, FavoriteBorder,
  Star, StarBorder,
  ThumbUp, ThumbUpOutlined,
  Download, Upload, Share,
  Print, Email, Phone,
  CalendarToday, Schedule, Event,
  LocationOn, Map, Place,
} from '@mui/icons-material';
```

## 💡 Tips

1. **Always use fullWidth** on form inputs for consistency
2. **Use Stack** instead of manually creating flex containers
3. **Use theme colors** instead of hardcoded hex values
4. **Use spacing units** (multiples of 8px) for consistency
5. **Use Typography** component for all text content
6. **FormControl wraps** form elements for consistent styling
7. **Use sx prop** for one-off custom styles
8. **Use theme.palette** for colors that adapt to light/dark mode

---

🎨 **Material Design 3**: https://m3.material.io/  
📚 **MUI Docs**: https://mui.com/material-ui/  
🎭 **Icons**: https://mui.com/material-ui/material-icons/

