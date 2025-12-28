import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../content/colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightComponent,
  leftComponent,
}) => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBack && onBackPress ? (
              <TouchableOpacity
                onPress={onBackPress}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="arrow-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            ) : leftComponent ? (
              leftComponent
            ) : null}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent || <View style={styles.placeholder} />}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: colors.white,
    overflow: 'hidden',
    height: Platform.OS === 'ios' ? 44 : 56,
  },
  header: {
    
    backgroundColor: colors.white,
    height: Platform.OS === 'ios' ? 44 : 56,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: -20,
        paddingTop: 20,
      },
      android: {
        elevation: 2,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 12,
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: colors.text,
    textAlign: 'left',
  },
  placeholder: {
    width: 0,
  },
});

export default Header;

