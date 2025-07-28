import React from 'react';
import { formatPriceWithSale } from '../data/danierProducts';

const PriceDisplay = ({ product, className = "" }) => {
  const priceInfo = formatPriceWithSale(product);
  
  if (priceInfo.onSale) {
    const savings = product.originalPrice - product.price;
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <span className="text-red-600 font-semibold text-lg">
          {priceInfo.displayPrice}
        </span>
        <span className="text-gray-500 line-through text-sm">
          {priceInfo.originalPrice}
        </span>
        <span className="text-xs text-red-600 font-medium">
          Save ${savings.toFixed(2)}
        </span>
      </div>
    );
  } else {
    return (
      <span className={`font-semibold text-lg ${className}`}>
        {priceInfo.displayPrice}
      </span>
    );
  }
};

export default PriceDisplay; 