import { useState, useEffect } from 'react'
import axios from 'axios'

const useProducts = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/getProduct')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const createProduct = async (productData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/products/createProduct', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product creation response:', response.data);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Error creating product:', error.response ? error.response.data : error.message);
      throw error; // Re-throw the error so it can be handled in the component
    }
  }

  const updateProduct = async (productData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/products/updateProduct/${productData.get('_id')}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setProducts(products.map(product => product._id === response.data._id ? response.data : product))
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/deleteProduct/${productId}`)
      setProducts(products.filter(product => product._id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return { products, createProduct, updateProduct, deleteProduct }
}

export default useProducts
