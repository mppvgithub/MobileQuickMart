// Icon component wrapper for react-native-vector-icons
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

export type IconLibrary = 
  | 'MaterialIcons' 
  | 'MaterialCommunityIcons' 
  | 'FontAwesome' 
  | 'FontAwesome5' 
  | 'Ionicons' 
  | 'Feather' 
  | 'Entypo';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  library?: IconLibrary;
}

export const AppIcon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000',
  library = 'MaterialIcons' 
}) => {
  const iconProps = { name, size, color };

  switch (library) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'FontAwesome':
      return <FontAwesome {...iconProps} />;
    case 'FontAwesome5':
      return <FontAwesome5 {...iconProps} />;
    case 'Ionicons':
      return <Ionicons {...iconProps} />;
    case 'Feather':
      return <Feather {...iconProps} />;
    case 'Entypo':
      return <Entypo {...iconProps} />;
    default:
      return <Icon {...iconProps} />;
  }
};

// Export individual icon libraries for direct use
export {
  Icon as MaterialIcon,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  Feather,
  Entypo,
};

