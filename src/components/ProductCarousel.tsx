import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../content/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.85;

interface ProductCarouselProps {
  products: any[];
  onProductPress?: (product: any) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onProductPress,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!products || products.length === 0) {
    return null;
  }

  const renderCarouselItem = ({ item, index }: { item: any; index: number }) => {
    const discount = item.discount || item.discountPercentage || 0;
    const originalPrice = item.originalPrice || item.price;
    const discountedPrice = discount > 0 
      ? originalPrice * (1 - discount / 100) 
      : item.price;

    return (
      <TouchableOpacity
        style={styles.carouselItem}
        activeOpacity={0.9}
        onPress={() => onProductPress?.(item)}
      >
        <View style={styles.carouselContent}>
          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}

          {/* Product Image Placeholder */}
          <View style={styles.imageContainer}>
            <Icon name="image" size={moderateScale(60)} color={colors.gray[400]} />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name || 'Product'}
            </Text>
            {item.description && (
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            {/* Price Section */}
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPrice}>
                ₹{discountedPrice?.toFixed(2) || '0.00'}
              </Text>
              {discount > 0 && (
                <Text style={styles.originalPrice}>
                  ₹{originalPrice?.toFixed(2)}
                </Text>
              )}
            </View>

            {/* Stock Badge */}
            {item.stock !== undefined && (
              <View style={styles.stockBadge}>
                <Icon
                  name={item.stock > 0 ? 'check-circle' : 'cancel'}
                  size={moderateScale(14)}
                  color={item.stock > 0 ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.stockText,
                    item.stock > 0 ? styles.inStock : styles.outOfStock,
                  ]}
                >
                  {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Special Offers</Text>
        <View style={styles.indicatorContainer}>
          {products.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      </View>
      <Carousel
        width={CAROUSEL_WIDTH}
        height={moderateScale(280)}
        data={products}
        renderItem={renderCarouselItem}
        autoPlay={true}
        autoPlayInterval={3000}
        loop={products.length > 1}
        pagingEnabled={true}
        snapEnabled={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onSnapToItem={(index) => setCurrentIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.text,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: scale(6),
  },
  indicator: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.gray[300],
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: scale(20),
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    marginHorizontal: scale(8),
  },
  carouselContent: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountBadge: {
    position: 'absolute',
    top: scale(12),
    left: scale(12),
    backgroundColor: colors.error,
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    zIndex: 1,
  },
  discountText: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: moderateScale(140),
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: scale(16),
  },
  productName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scale(4),
  },
  productDescription: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
    marginBottom: scale(12),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(8),
  },
  discountedPrice: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  inStock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
  },
});

export default ProductCarousel;

