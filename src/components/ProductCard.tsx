import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../content/colors';

interface ProductCardProps {
  product: any;
  cardWidth: number;
  onPress?: (product: any) => void;
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cardWidth, onPress, style }) => {
  const [imageError, setImageError] = useState(false);

  const discount = product.discount || product.discountPercentage || 0;
  
  // Get prices - use actualPrice/offerPrice if available, otherwise use price
  const offerPrice = product.offerPrice || product.price;
  const actualPrice = product.actualPrice || product.originalPrice;
  
  // Calculate display prices
  // Show strikethrough actual price if it's 10%+ higher than offer price
  let displayActualPrice: number;
  let shouldShowActualPrice: boolean;
  
  if (actualPrice && offerPrice) {
    // Both prices provided - show strikethrough if actual is 10%+ higher
    shouldShowActualPrice = actualPrice >= offerPrice * 1.10;
    displayActualPrice = actualPrice;
  } else if (offerPrice) {
    // Only price provided - calculate actual as 10% higher to show discount effect
    displayActualPrice = offerPrice * 1.10;
    shouldShowActualPrice = true;
  } else {
    // No price available
    displayActualPrice = 0;
    shouldShowActualPrice = false;
  }
  
  const imageUrl = product.image || product.images?.[0] || null;
  const rating = product.rating || product.ratingAverage || 2.0;

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        {
          width: cardWidth,
          marginBottom: verticalScale(16),
        },
        style,
      ]}
      activeOpacity={0.7}
      onPress={() => onPress?.(product)}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.defaultImageContainer}>
            <Icon name="image" size={moderateScale(40)} color={colors.gray[400]} />
          </View>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={moderateScale(12)} color={colors.accent} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>

        {/* Stock Badge */}
        {product.stock !== undefined && product.stock <= 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name || 'Product'}
        </Text>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.offerPrice}>
            ₹{offerPrice?.toFixed(2) || '0.00'}
          </Text>
          {shouldShowActualPrice && (
            <Text style={styles.actualPrice}>
              ₹{displayActualPrice?.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Unit/Weight if available */}
        {product.unit && (
          <Text style={styles.productUnit}>{product.unit}</Text>
        )}

        {/* Stock indicator */}
        {product.stock !== undefined && product.stock > 0 && (
          <View style={styles.stockIndicator}>
            <Icon
              name="check-circle"
              size={moderateScale(12)}
              color={colors.success}
            />
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: moderateScale(160),
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  discountBadge: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    backgroundColor: colors.error,
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(3),
    zIndex: 1,
  },
  discountText: {
    color: colors.white,
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(3),
    zIndex: 1,
  },
  ratingText: {
    color: colors.text,
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginLeft: scale(2),
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outOfStockText: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  productInfo: {
    padding: scale(12),
  },
  productName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scale(6),
    minHeight: moderateScale(36),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  offerPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.primary,
  },
  actualPrice: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: scale(6),
  },
  productUnit: {
    fontSize: moderateScale(11),
    color: colors.textSecondary,
    marginBottom: scale(4),
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(4),
  },
  stockText: {
    fontSize: moderateScale(11),
    color: colors.success,
    fontWeight: '500',
    marginLeft: scale(4),
  },
});

export default ProductCard;

