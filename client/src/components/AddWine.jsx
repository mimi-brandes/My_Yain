import React, { useState, useEffect } from 'react';
import { fetchServer } from '../service/server';
import { useNavigate } from 'react-router-dom';
import '../css/AddWine.css';

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

  const [showModal, setShowModal] = useState(false);
  const [newWineTypeName, setNewWineTypeName] = useState('');
  const [newWineTypeImage, setNewWineTypeImage] = useState(null);
  const [isAddingType, setIsAddingType] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWineTypes = async () => {
      const types = await fetchServer('/wines/types');
      setWineTypes(types || []);
    };
    fetchWineTypes();
  }, []);

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

    const formData = {
      wineName,
      price,
      quantity,
      wineTypeID,
      imageFile: imageFile.name,
    };

    try {
      const response = await fetchServer('/wines/add', formData, 'POST');
      if (!response.ok) throw new Error('Failed to add wine');
      alert('Wine added successfully!');
      navigate('/manager-dashboard/wines', { state: { type: 'wines' } });
    } catch (error) {
      alert('An error occurred while adding the wine.');
    }
  };

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

    const formData = {
      WineTypeName: newWineTypeName,
      ImageURL: newWineTypeImage.name,
    };

    try {
      console.log(formData);
      const response = await fetchServer('/wines/addType', formData, 'POST');

      if (!response.ok) throw new Error('Failed to add wine type');

      alert('Wine type added successfully!');
      setShowModal(false);
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
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/manager-dashboard/wines')}>
            חזרה
          </button>
        </div>
        <img src="/images/logo.png" alt="logo" className="logo" />
        <h1 className="add-wine-title">Please complete the wine details:</h1>
        <form className="add-wine-form" onSubmit={handleSubmit}>
          <input type="text" name="WineName" placeholder="Wine Name" value={wineName} onChange={(e) => setWineName(e.target.value)} required />
          <input type="number" name="Price" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} min="0.01" step="0.01" required />
          <input type="number" name="Quantity" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" required />
          <select name="WineTypeID" value={wineTypeID} onChange={(e) => setWineTypeID(e.target.value)} required>
            <option value="">Select Wine Type</option>
            {wineTypes.map((type) => (
              <option key={type.WineTypeID} value={type.WineTypeID}>{type.WineTypeName}</option>
            ))}
          </select>
          <p className="upload-label">Please upload the wine image:</p>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
          <button type="submit">Add Wine</button>
        </form>

        <button className="open-modal-button" onClick={() => setShowModal(true)}>
          Add Wine Type
        </button>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h2>Add New Wine Type</h2>
              <form onSubmit={handleAddWineType}>
                <input type="text" placeholder="Wine Type Name" value={newWineTypeName} onChange={(e) => setNewWineTypeName(e.target.value)} required />
                <p className="upload-label">Please upload the wine type image:</p>
                <input type="file" accept="image/*" onChange={(e) => setNewWineTypeImage(e.target.files[0])} required />
                <div className="modal-actions">
                  <button type="submit" disabled={isAddingType} className="confirm-button">
                    {isAddingType ? 'Adding...' : 'Add'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
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

