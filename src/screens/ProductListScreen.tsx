import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { colors } from '../content/colors';
import { productService } from '../services/productService';
import { RootStackParamList } from '../navigation/RootNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = scale(16); // Equal padding on all sides
const CARD_GAP = scale(12); // Gap between cards
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - CARD_GAP) / 2;

type ProductListScreenRouteProp = RouteProp<RootStackParamList, 'ProductList'>;
type ProductListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductList'>;

const ProductListScreen = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const route = useRoute<ProductListScreenRouteProp>();
  const { category } = route.params;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await productService.getProducts({
        category,
        limit: 50,
      });

      if (response.success) {
        setProducts(response.data?.products || response.data || []);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (err: any) {
      setError(err.error || 'Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  const handleBackPress = () => {
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={category || 'Products'} showBack onBackPress={handleBackPress} />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadProducts()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="inventory-2" size={64} color={colors.gray[400]} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new products in this category
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadProducts(true)}
                colors={[colors.primary]}
              />
            }
          >
            <View style={styles.productsGrid}>
              {products.map((product, index) => {
                const isEven = index % 2 === 0;
                return (
                  <ProductCard
                    key={product._id || index}
                    product={product}
                    cardWidth={CARD_WIDTH}
                    style={[
                      isEven && styles.cardLeft,
                      !isEven && styles.cardRight,
                    ]}
                  />
                );
              })}
            </View>
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
    padding: GRID_PADDING,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardLeft: {
    marginRight: CARD_GAP / 2,
  },
  cardRight: {
    marginLeft: CARD_GAP / 2,
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
    padding: scale(20),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.text,
    marginTop: verticalScale(16),
    marginBottom: scale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProductListScreen;

