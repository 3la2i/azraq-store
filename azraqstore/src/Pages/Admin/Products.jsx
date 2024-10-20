import React, { useState } from 'react'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import useProducts from './hooks/useProducts'

const Products = () => {
  const [editingProduct, setEditingProduct] = useState(null)
  const { products, createProduct, updateProduct, deleteProduct } = useProducts()

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <ProductForm
        onSubmit={editingProduct ? updateProduct : createProduct}
        initialData={editingProduct}
        onCancel={handleCancelEdit}
      />
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />
    </div>
  )
}

export default Products
