import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../content/colors';
import { productService } from '../services/productService';
import { RootStackParamList } from '../navigation/RootNavigator';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Focus search input on mount
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    Keyboard.dismiss();

    try {
      const response = await productService.getProducts({
        search: query.trim(),
        limit: 100, // Get more results for search
      });

      if (response.success) {
        setProducts(response.data?.products || response.data || []);
      } else {
        setError(response.error || 'Failed to search products');
        setProducts([]);
      }
    } catch (err: any) {
      setError(err.error || 'Failed to search products. Please try again.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setProducts([]);
    setHasSearched(false);
    setError(null);
    searchInputRef.current?.focus();
  };

  const renderProduct = (product: any, index: number) => (
    <TouchableOpacity
      key={product._id || index}
      style={styles.productCard}
      activeOpacity={0.7}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name || 'Product'}</Text>
        {product.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        {product.category && (
          <View style={styles.categoryBadge}>
            <Icon name="category" size={14} color={colors.primary} />
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>
            ₹{product.price?.toFixed(2) || '0.00'}
          </Text>
          {product.stock !== undefined && (
            <Text
              style={[
                styles.productStock,
                product.stock > 0 ? styles.inStock : styles.outOfStock,
              ]}
            >
              {product.stock > 0 ? `In Stock` : 'Out of Stock'}
            </Text>
          )}
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.gray[500]}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              // Clear previous timeout
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              // Debounce search - search after user stops typing
              if (text.trim()) {
                searchTimeoutRef.current = setTimeout(() => {
                  handleSearch(text);
                }, 500);
              } else {
                setProducts([]);
                setHasSearched(false);
                setError(null);
              }
            }}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleSearch(searchQuery)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !hasSearched ? (
          <View style={styles.emptyContainer}>
            <Icon name="search" size={64} color={colors.gray[400]} />
            <Text style={styles.emptyText}>Search for products</Text>
            <Text style={styles.emptySubtext}>
              Search by product name, category, or description
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="inventory-2" size={64} color={colors.gray[400]} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search term
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {products.length} {products.length === 1 ? 'result' : 'results'} found
              </Text>
            </View>
            {products.map((product, index) => renderProduct(product, index))}
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  productStock: {
    fontSize: 12,
    fontWeight: '500',
  },
  inStock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;

