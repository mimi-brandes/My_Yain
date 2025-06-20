// import React, { useState, useEffect } from 'react';
// import { fetchServer } from '../service/server';
// import '../css/AddWine.css'; // עיצוב נפרד עבור הוספת יין

// function validateWineInputs({ name, price, quantity, wineTypeID, imageFile }) {
//   if (!name.trim()) return "Wine name is required.";
//   if (!price || isNaN(price) || price <= 0) return "Price must be a positive number.";
//   if (!quantity || isNaN(quantity) || quantity < 0) return "Quantity must be 0 or more.";
//   if (!wineTypeID) return "Please select a wine type.";
//   if (!imageFile) return "Please upload an image.";
//   return null;
// }

// const AddWine = () => {
//   const [wineName, setWineName] = useState('');
//   const [price, setPrice] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [wineTypeID, setWineTypeID] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [wineTypes, setWineTypes] = useState([]);
//   // סטייטים למודאל הוספת סוג יין חדש
//   const [showModal, setShowModal] = useState(false);
//   const [newWineTypeName, setNewWineTypeName] = useState('');
//   const [newWineTypeImage, setNewWineTypeImage] = useState(null);
//   const [isAddingType, setIsAddingType] = useState(false);
// //הבאת סוגי היינות
//   useEffect(() => {
//     const fetchWineTypes = async () => {
//       const types = await fetchServer('/wines/types'); // נניח שהנתיב הזה מחזיר את סוגי היין
//       setWineTypes(types || []);
//     };
//     fetchWineTypes();
    
//   }, []);
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationError = validateWineInputs({
//       name: wineName,
//       price,
//       quantity,
//       wineTypeID,
//       imageFile,
//     });

//     if (validationError) {
//       alert(validationError);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('WineName', wineName);
//     formData.append('Price', price);
//     formData.append('Quantity', quantity);
//     formData.append('WineTypeID', wineTypeID);
//     formData.append('Image', imageFile);
// //הוספת היין
//     try {
//       const response = await fetch('/api/wines/add', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Failed to add wine');
//       alert('Wine added successfully!');
//      //ניווט לעמוד אחר לאחר ההזמנה
//     } catch (error) {
//       alert('An error occurred while adding the wine.');
//     }
//     const handleAddWineType = async (e) => {
//         e.preventDefault();
    
//         if (!newWineTypeName.trim()) {
//           alert('Wine type name is required.');
//           return;
//         }
//         if (!newWineTypeImage) {
//           alert('Please upload an image for the wine type.');
//           return;
//         }
    
//         setIsAddingType(true);
    
//         const formData = new FormData();
//         formData.append('WineTypeName', newWineTypeName);
//         formData.append('Image', newWineTypeImage);
    
//         try {
//           const response = await fetch('/api/winetypes/add', {  // שים לב לנתיב הזה, צריך ליצור בשרת
//             method: 'POST',
//             body: formData,
//           });
    
//           if (!response.ok) throw new Error('Failed to add wine type');
    
//           alert('Wine type added successfully!');
//           setShowModal(false);
//           setNewWineTypeName('');
//           setNewWineTypeImage(null);
//           fetchWineTypes(); // רענון הרשימה
//         } catch (error) {
//           alert('Error adding wine type.');
//         } finally {
//           setIsAddingType(false);
//         }
//   };

//   return (
//     <div className="add-wine-container">
//       <div className="add-wine-overlay">
//         <h1 className="add-wine-title">Please complete the wine details:</h1>
//         <form className="add-wine-form" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="WineName"
//             placeholder="Wine Name"
//             value={wineName}
//             onChange={(e) => setWineName(e.target.value)}
//             required
//           />
//           <input
//             type="number"
//             name="Price"
//             placeholder="Price ($)"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             min="0.01"
//             step="0.01"
//             required
//           />
//           <input
//             type="number"
//             name="Quantity"
//             placeholder="Quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//             min="0"
//             required
//           />
//           <select
//             name="WineTypeID"
//             value={wineTypeID}
//             onChange={(e) => setWineTypeID(e.target.value)}
//             required
//           >
//             <option value="">Select Wine Type</option>
//             {wineTypes.map((type) => (
//               <option key={type.WineTypeID} value={type.WineTypeID}>
//                 {type.WineTypeName}
//               </option>
//             ))}
//           </select>
//           <p className="upload-label">Please upload the wine image:</p>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImageFile(e.target.files[0])}
//             required
//           />
//           <button type="submit">Add Wine</button>
//         </form>

//         {/* כפתור לפתיחת מודאל */}
//         <button
//           style={{
//             marginTop: '20px',
//             padding: '8px 12px',
//             fontSize: '14px',
//             cursor: 'pointer',
//             backgroundColor: '#4caf50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//           }}
//           onClick={() => setShowModal(true)}
//         >
//           Add Wine Type
//         </button>

//         {/* מודאל להוספת סוג יין */}
//         {showModal && (
//           <div className="modal-backdrop" style={{
//             position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
//             justifyContent: 'center', alignItems: 'center',
//             zIndex: 9999,
//           }}>
//             <div className="modal-content" style={{
//               backgroundColor: 'white',
//               padding: '20px',
//               borderRadius: '8px',
//               width: '320px',
//               boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
//               position: 'relative',
//             }}>
//               <h2>Add New Wine Type</h2>
//               <form onSubmit={handleAddWineType}>
//                 <input
//                   type="text"
//                   placeholder="Wine Type Name"
//                   value={newWineTypeName}
//                   onChange={(e) => setNewWineTypeName(e.target.value)}
//                   required
//                 />
//                 <p className="upload-label">Please upload the wine type image:</p>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setNewWineTypeImage(e.target.files[0])}
//                   required
//                 />
//                 <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
//                   <button type="submit" disabled={isAddingType} style={{backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px'}}>
//                     {isAddingType ? 'Adding...' : 'Add'}
//                   </button>
//                   <button type="button" onClick={() => setShowModal(false)} style={{backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px'}}>
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddWine;
import React, { useState, useEffect } from 'react';
import { fetchServer } from '../service/server';
import '../css/AddWine.css'; // עיצוב נפרד עבור הוספת יין

function validateWineInputs({ name, price, quantity, wineTypeID, imageFile }) {
  if (!name.trim()) return "Wine name is required.";
  if (!price || isNaN(price) || price <= 0) return "Price must be a positive number.";
  if (!quantity || isNaN(quantity) || quantity < 0) return "Quantity must be 0 or more.";
  if (!wineTypeID) return "Please select a wine type.";
  if (!imageFile) return "Please upload an image.";
  return null;
}

const AddWine = () => {
  const [wineName, setWineName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [wineTypeID, setWineTypeID] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [wineTypes, setWineTypes] = useState([]);

  // סטייטים למודאל הוספת סוג יין חדש
  const [showModal, setShowModal] = useState(false);
  const [newWineTypeName, setNewWineTypeName] = useState('');
  const [newWineTypeImage, setNewWineTypeImage] = useState(null);
  const [isAddingType, setIsAddingType] = useState(false);

  // הבאת סוגי היינות
  useEffect(() => {
    const fetchWineTypes = async () => {
      const types = await fetchServer('/wines/types'); // נניח שהנתיב הזה מחזיר את סוגי היין
      setWineTypes(types || []);
    };
    fetchWineTypes();
  }, []);

  // טיפול בהוספת יין רגיל
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateWineInputs({
      name: wineName,
      price,
      quantity,
      wineTypeID,
      imageFile,
    });

    if (validationError) {
      alert(validationError);
      return;
    }

    const formData = new FormData();
    formData.append('WineName', wineName);
    formData.append('Price', price);
    formData.append('Quantity', quantity);
    formData.append('WineTypeID', wineTypeID);
    formData.append('Image', imageFile);

    try {
      const response = await fetch('/api/wines/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add wine');
      alert('Wine added successfully!');
      // איפוס שדות אחרי הצלחה
      setWineName('');
      setPrice('');
      setQuantity('');
      setWineTypeID('');
      setImageFile(null);
    } catch (error) {
      alert('An error occurred while adding the wine.');
    }
  };

  // טיפול בטופס הוספת סוג יין חדש (מודאל)
  const handleAddWineType = async (e) => {
    e.preventDefault();

    if (!newWineTypeName.trim()) {
      alert('Wine type name is required.');
      return;
    }
    if (!newWineTypeImage) {
      alert('Please upload an image for the wine type.');
      return;
    }

    setIsAddingType(true);

    const formData = new FormData();
    formData.append('WineTypeName', newWineTypeName);
    formData.append('Image', newWineTypeImage);

    try {
      const response = await fetch('/api/winetypes/add', {  // שים לב לנתיב הזה, צריך ליצור בשרת
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add wine type');

      alert('Wine type added successfully!');
      setShowModal(false);
      setNewWineTypeName('');
      setNewWineTypeImage(null);
      // רענון רשימת סוגי היינות אחרי הוספה
      const types = await fetchServer('/wines/types');
      setWineTypes(types || []);
    } catch (error) {
      alert('Error adding wine type.');
    } finally {
      setIsAddingType(false);
    }
  };

  return (
    <div className="add-wine-container">
      <div className="add-wine-overlay">
        <h1 className="add-wine-title">Please complete the wine details:</h1>
        <form className="add-wine-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="WineName"
            placeholder="Wine Name"
            value={wineName}
            onChange={(e) => setWineName(e.target.value)}
            required
          />
          <input
            type="number"
            name="Price"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
          <input
            type="number"
            name="Quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            required
          />
          <select
            name="WineTypeID"
            value={wineTypeID}
            onChange={(e) => setWineTypeID(e.target.value)}
            required
          >
            <option value="">Select Wine Type</option>
            {wineTypes.map((type) => (
              <option key={type.WineTypeID} value={type.WineTypeID}>
                {type.WineTypeName}
              </option>
            ))}
          </select>
          <p className="upload-label">Please upload the wine image:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
          <button type="submit">Add Wine</button>
        </form>

        {/* כפתור לפתיחת מודאל */}
        <button
          style={{
            marginTop: '20px',
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
          onClick={() => setShowModal(true)}
        >
          Add Wine Type
        </button>

        {/* מודאל להוספת סוג יין */}
        {showModal && (
          <div
            className="modal-backdrop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '320px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                position: 'relative',
              }}
            >
              <h2>Add New Wine Type</h2>
              <form onSubmit={handleAddWineType}>
                <input
                  type="text"
                  placeholder="Wine Type Name"
                  value={newWineTypeName}
                  onChange={(e) => setNewWineTypeName(e.target.value)}
                  required
                />
                <p className="upload-label">Please upload the wine type image:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewWineTypeImage(e.target.files[0])}
                  required
                />
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    type="submit"
                    disabled={isAddingType}
                    style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                    }}
                  >
                    {isAddingType ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWine;
