import React, { useState } from 'react';

const ProductDropdown = ({
  products,
  categoryName,
  categoryUrl,
  fullCollectionUrl,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md p-2 space-y-2">
      {/* Search Results Toggle */}
      <button
        className="w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-md font-semibold hover:bg-gray-50 transition"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span>Search Results</span>
        <span className="ml-2 text-xs text-gray-500">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="mt-2 border border-gray-200 rounded shadow p-2 max-h-64 overflow-y-auto bg-white">
          {products.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-4">
              No products found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {products.map((product, idx) => (
                <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-bold">{product.title}</span>
                    <span className="ml-2 text-gray-900 font-semibold">
                      ${(product.salePrice || product.price || 0).toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.salePrice || product.price) && (
                      <span className="ml-2 text-gray-400 line-through text-sm">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {product.colors && product.colors.length > 0
                        ? product.colors.join(', ')
                        : 'No colors'}
                    </div>
                  </div>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-0 sm:ml-4 inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Browse All Category */}
      <a
        href={categoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md text-center font-semibold hover:bg-blue-700 transition"
      >
        Browse All {categoryName}
      </a>

      {/* Browse Full Collection */}
      <a
        href={fullCollectionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md text-center font-semibold hover:bg-gray-900 transition"
      >
        Browse Full Collection
      </a>
    </div>
  );
};

export default ProductDropdown; 