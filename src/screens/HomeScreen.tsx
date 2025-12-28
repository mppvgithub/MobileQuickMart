import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import ProductCarousel from '../components/ProductCarousel';
import { colors } from '../content/colors';
import { TabParamList } from '../navigation/TabNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { productService } from '../services/productService';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [categories, setCategories] = useState<string[]>([]);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Load categories and offer products in parallel
      const [categoriesResponse, productsResponse] = await Promise.all([
        productService.getCategories(),
        productService.getProducts({
          inStock: true,
          limit: 10, // Get top 10 products for carousel
        }),
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }

      if (productsResponse.success) {
        // Filter products that could be offers (you can add discount field later)
        // For now, showing in-stock products
        const products = productsResponse.data?.products || productsResponse.data || [];
        setOfferProducts(products.slice(0, 5)); // Show top 5 in carousel
      }

      if (!categoriesResponse.success && !productsResponse.success) {
        setError('Failed to load data');
      }
    } catch (err: any) {
      setError(err.error || 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfilePress = () => {
    navigation.getParent()?.navigate('Profile');
  };

  const handleSearchPress = () => {
    navigation.getParent()?.navigate('Search');
  };

  const handleCategoryPress = (category: string) => {
    navigation.getParent()?.navigate('ProductList', { category });
  };

  const handleProductPress = (product: any) => {
    // Navigate to product detail or product list filtered by category
    if (product.category) {
      navigation.getParent()?.navigate('ProductList', { category: product.category });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Home"
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleSearchPress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="search" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="account-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        }
      />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadData()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadData(true)}
                colors={[colors.primary]}
              />
            }
          >
            {/* Product Carousel */}
            {offerProducts.length > 0 && (
              <ProductCarousel
                products={offerProducts}
                onProductPress={handleProductPress}
              />
            )}

            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Text style={styles.sectionSubtitle}>
                Browse products by category
              </Text>
            </View>

            {categories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="category" size={64} color={colors.gray[400]} />
                <Text style={styles.emptyText}>No categories available</Text>
              </View>
            ) : (
              <View style={styles.categoriesGrid}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryCard}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryIconContainer}>
                      <Icon name="category" size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={2}>
                      {category}
                    </Text>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={colors.gray[400]}
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
  },
  headerSection: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: scale(4),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  categoryIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  categoryName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scale(8),
  },
  chevronIcon: {
    position: 'absolute',
    bottom: scale(16),
    right: scale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(40),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    marginTop: verticalScale(16),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  iconButton: {
    padding: scale(4),
  },
});

export default HomeScreen;

