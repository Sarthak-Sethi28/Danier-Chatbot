import React from 'react';

const ProductResultsDropdown = ({ products, total, searchQuery, onClose }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const formatPrice = (product) => {
    const price = product.salePrice || product.price || 0;
    const originalPrice = product.originalPrice || product.comparePrice;
    
    if (originalPrice && originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1">
            <span className="text-red-600 font-bold text-sm">${price}</span>
            <span className="text-gray-500 line-through text-xs">${originalPrice}</span>
          </div>
          <span className="text-green-600 text-xs font-medium">{discount}% OFF</span>
        </div>
      );
    }
    return <span className="font-bold text-sm text-gray-900">${price}</span>;
  };

  const formatColors = (colors) => {
    if (!colors || colors.length === 0) return '';
    return colors.slice(0, 2).join(', ') + (colors.length > 2 ? '...' : '');
  };

  const handleProductClick = (product) => {
    // Check if URL is available and seems valid
    if (product.url && product.url.includes('danier.com')) {
      window.open(product.url, '_blank');
    } else if (product.handle) {
      // Try to construct a URL from the handle
      const constructedUrl = `https://danier.com/products/${product.handle}`;
      window.open(constructedUrl, '_blank');
    } else {
      // Fallback: search for the product on Danier website
      const searchQuery = encodeURIComponent(product.title || product.name || '');
      window.open(`https://danier.com/search?q=${searchQuery}`, '_blank');
    }
  };

  const getProductImage = (product) => {
    // Check multiple possible image fields from the backend API
    console.log('🖼️ Product image fields:', {
      image_url: product.image_url,
      imageUrl: product.imageUrl,
      imageSrc: product.imageSrc,
      image: product.image,
      name: product.name || product.title
    });
    
    if (product.image_url && product.image_url.trim() !== '') {
      console.log('✅ Using image_url:', product.image_url);
      return product.image_url;
    }
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      console.log('✅ Using imageUrl:', product.imageUrl);
      return product.imageUrl;
    }
    if (product.imageSrc && product.imageSrc.trim() !== '') {
      console.log('✅ Using imageSrc:', product.imageSrc);
      return product.imageSrc;
    }
    if (product.image && product.image.trim() !== '') {
      // If it's just a filename, construct the full URL
      if (!product.image.startsWith('http')) {
        const constructedUrl = `https://cdn.shopify.com/s/files/1/0003/9587/0273/files/${product.image}`;
        console.log('✅ Using constructed URL from image filename:', constructedUrl);
        return constructedUrl;
      }
      console.log('✅ Using image URL:', product.image);
      return product.image;
    }
    // Return a placeholder if no image
    const placeholder = `https://via.placeholder.com/200x200/f3f4f6/6b7280?text=${encodeURIComponent(product.title || product.name || 'Product')}`;
    console.log('⚠️ No image found, using placeholder:', placeholder);
    return placeholder;
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 max-w-full w-full max-h-[400px] overflow-hidden mt-2">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {total ? `${total} Products Found` : `${products.length} Products Found`}
          </h3>
          {searchQuery && (
            <p className="text-gray-600 text-sm mt-1">Search results for "{searchQuery}"</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Product Grid */}
      <div className="overflow-y-auto max-h-[320px] bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
          {products.map((product, index) => (
            <div
              key={product.id || index}
              onClick={() => handleProductClick(product)}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 group"
            >
              {/* Product Image */}
              <div className="relative h-32 bg-gray-100 overflow-hidden">
                <img
                  src={getProductImage(product)}
                  alt={product.title || product.name || 'Product'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x200/f3f4f6/6b7280?text=${encodeURIComponent(product.title || product.name || 'Product')}`;
                  }}
                />
                {product.isOnSale && (
                  <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                    SALE
                  </div>
                )}
                {product.gender && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                    {product.gender}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title || product.name}
                </div>
                
                {product.colors && product.colors.length > 0 && (
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Colors:</span> {formatColors(product.colors)}
                  </div>
                )}

                {/* Price */}
                <div className="mb-2">
                  {formatPrice(product)}
                </div>

                {/* View Product Button */}
                <div className="flex items-center justify-between">
                  <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1 group-hover:bg-blue-700">
                    <span>View Product</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  
                  {product.type && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                      {product.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="text-center py-3 text-gray-600 bg-white border-t">
          <p className="text-xs">
            Click on any product card to view details on the Danier website
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductResultsDropdown; 