// import React, { useState, useEffect } from 'react';

// const RestaurantForm = ({ onSubmit, initialData, onCancel, categories }) => {
//   const [formData, setFormData] = useState(initialData || {});

//   useEffect(() => {
//     setFormData(initialData || {});
//   }, [initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* ... other form fields */}
//       <div>
//         <label htmlFor="category">Category</label>
//         <select
//           name="category"
//           value={formData.category || ''}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select a category</option>
//           {categories.map((category) => (
//             <option key={category._id} value={category._id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label htmlFor="rating">Rating</label>
//         <input
//           type="number"
//           name="rating"
//           value={formData.rating || ''}
//           onChange={handleChange}
//           min="0"
//           max="5"
//           step="0.1"
//           required
//         />
//       </div>
//       <button type="submit">Save</button>
//       <button type="button" onClick={onCancel}>Cancel</button>
//     </form>
//   );
// };

// export default RestaurantForm;
