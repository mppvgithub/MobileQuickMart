# Vector Icons Setup Guide

## ✅ Installed

- `react-native-vector-icons` - Vector icon library with multiple icon sets

## 📱 Configuration

### Android ✅
- Added font configuration in `android/app/build.gradle`
- Fonts are automatically linked via `fonts.gradle`

### iOS ✅
- Fonts are automatically linked via autolinking
- No additional configuration needed

## 🎨 Available Icon Libraries

The app includes these icon libraries:

1. **MaterialIcons** (default) - Google Material Design icons
2. **MaterialCommunityIcons** - Extended Material Design icons
3. **FontAwesome** - Font Awesome icons
4. **FontAwesome5** - Font Awesome 5 icons
5. **Ionicons** - Ionicons
6. **Feather** - Feather icons
7. **Entypo** - Entypo icons

## 📖 Usage Examples

### Using AppIcon Component (Recommended)

```tsx
import { AppIcon } from '../components/Icons';

// Basic usage (MaterialIcons by default)
<AppIcon name="home" size={24} color="#007AFF" />

// Using different icon library
<AppIcon 
  name="heart" 
  size={24} 
  color="#FF0000" 
  library="FontAwesome" 
/>
```

### Direct Import (For specific icon sets)

```tsx
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// MaterialIcons
<Icon name="home" size={24} color="#007AFF" />

// MaterialCommunityIcons
<MaterialCommunityIcons name="store" size={24} color="#007AFF" />

// FontAwesome
<FontAwesome name="shopping-cart" size={24} color="#007AFF" />

// Ionicons
<Ionicons name="home-outline" size={24} color="#007AFF" />
```

### In Tab Navigator (Already Configured ✅)

Icons are already added to bottom tabs:
- **Home**: `home` (MaterialIcons)
- **Categories**: `category` (MaterialIcons)
- **Cart**: `shopping-cart` (MaterialIcons)
- **Orders**: `receipt` (MaterialIcons)
- **Profile**: `person` (MaterialIcons)

## 🔍 Finding Icons

### MaterialIcons
Browse: https://fonts.google.com/icons
```tsx
<Icon name="shopping-cart" />
<Icon name="favorite" />
<Icon name="search" />
```

### MaterialCommunityIcons
Browse: https://pictogrammers.com/library/mdi/
```tsx
<MaterialCommunityIcons name="store" />
<MaterialCommunityIcons name="food" />
```

### FontAwesome
Browse: https://fontawesome.com/icons
```tsx
<FontAwesome name="shopping-cart" />
<FontAwesome name="user" />
```

### Ionicons
Browse: https://ionic.io/ionicons
```tsx
<Ionicons name="home-outline" />
<Ionicons name="cart-outline" />
```

## 💡 Common Icon Names

### Shopping/E-commerce
- `shopping-cart` (MaterialIcons)
- `store` (MaterialCommunityIcons)
- `basket` (Ionicons)
- `bag` (FontAwesome)

### Navigation
- `home` (MaterialIcons)
- `category` (MaterialIcons)
- `menu` (MaterialIcons)
- `arrow-back` (MaterialIcons)

### User/Profile
- `person` (MaterialIcons)
- `account` (MaterialCommunityIcons)
- `user` (FontAwesome)
- `person-outline` (Ionicons)

### Actions
- `search` (MaterialIcons)
- `favorite` (MaterialIcons)
- `add` (MaterialIcons)
- `delete` (MaterialIcons)

## 🎨 Styling Tips

```tsx
// With custom styling
<AppIcon 
  name="home" 
  size={28} 
  color={isActive ? '#007AFF' : '#8E8E93'} 
/>

// In a button
<TouchableOpacity>
  <AppIcon name="shopping-cart" size={24} color="#FFF" />
</TouchableOpacity>

// With badge
<View>
  <AppIcon name="notifications" size={24} color="#000" />
  <Badge count={5} />
</View>
```

## 🚀 Next Steps

1. **Customize Tab Icons**: Edit `src/navigation/TabNavigator.tsx` to change icons
2. **Add Icons to Screens**: Use `AppIcon` component in your screens
3. **Create Icon Buttons**: Combine icons with TouchableOpacity for buttons

## 📝 Notes

- Icons are vector-based and scale perfectly at any size
- All icon libraries are included - choose based on your design needs
- MaterialIcons is the default and most commonly used
- For iOS, fonts are automatically linked
- For Android, fonts are linked via `fonts.gradle`

## 🔗 Resources

- [react-native-vector-icons GitHub](https://github.com/oblador/react-native-vector-icons)
- [Material Icons](https://fonts.google.com/icons)
- [Material Community Icons](https://pictogrammers.com/library/mdi/)
- [Font Awesome](https://fontawesome.com/icons)
- [Ionicons](https://ionic.io/ionicons)

