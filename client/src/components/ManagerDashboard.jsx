import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import '../css/ManagerDashboard.css';

const tableLabels = {
  managers: 'מנהלים',
  guides: 'מדריכים',
  customers: 'לקוחות',
  wines: 'יינות',
  tours: 'סיורים',
  sales: 'הזמנות',
  productsSold: 'יינות שהוזמנו',
  wineTypes: 'סוגי יין',
  tourTypes: 'סוגי סיור'
};

const ManagerDashboard = () => {
  const { initialType } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [showTourTypeModal, setShowTourTypeModal] = useState(false);
  const [newTourTypeName, setNewTourTypeName] = useState('');
  const [newTourTypeDesc, setNewTourTypeDesc] = useState('');
  const [newTourTypePrice, setNewTourTypePrice] = useState('');
  const [newTourTypeImage, setNewTourTypeImage] = useState(null);
  const [isAddingTourType, setIsAddingTourType] = useState(false);


  const addButtonsMap = {
    wines: { label: ' הוספת יין / סוג יין', path: '/add-wine' },
    guides: { label: 'הוספת מדריך', path: '/signup-manager-or-guide' },
    tours: { label: 'הוספת סיור', path: '/tours' },
    customers: { label: 'הוספת לקוח', path: '/users/signup', fromManager: true },
    managers: { label: 'הוספת מנהל', path: '/signup-manager-or-guide' }
  };


  const renderAddButton = () => {
    const addInfo = addButtonsMap[initialType];
    if (!addInfo) return null;

    return (
      <div className="button-container">
        {addInfo.label === 'הוספת מדריך' && (
          <button className="add-new-button" onClick={() => navigate(addInfo.path, { state: { TypeMnager: '' } })}>
            {addInfo.label}
          </button>
        )}
        {addInfo.label != 'הוספת מדריך' && addInfo.label !== 'הוספת סיור' && (
          <button className="add-new-button" onClick={() => navigate(addInfo.path, { state: { TypeMnager: 'yes' } })}>
            {addInfo.label}
          </button>)}



        {initialType === 'tours' && (
          <button className="add-new-button" onClick={() => setShowTourTypeModal(true)}>
            הוספת סוג סיור
          </button>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (!initialType) return;
    if (!initialType) {
      alert('/');
      return;
    }
    const getData = async () => {
      const response = await fetchServer(`/managers/${initialType}`);
      setData(response || []);
    };
    getData();
  }, [initialType]);

  const handleEditClick = (row) => {
    const idColumn = Object.keys(row).find(key => key.toLowerCase().endsWith('id')) || 'Id';
    setEditRowId(row[idColumn]);
    setEditRowData({ ...row });
  };

  const handleInputChange = (key, value) => {
    setEditRowData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {

    try {
      const response = await fetchServer(`/managers/${initialType}/update`, editRowData, 'POST');
      if (response?.success) {
        const allColumns = Object.keys(data[0]);

        const idColumn = allColumns.find(col => col.toLowerCase().endsWith('id')) || 'Id';

        const updatedData = data.map(item =>
          item[idColumn] === editRowData[idColumn] ? editRowData : item
        );

        setData(updatedData);
        setEditRowId(null);
        setEditRowData({});
        alert('הנתונים עודכנו בהצלחה!');
      } else {
        alert('אירעה שגיאה בעדכון');
      }
    }
    catch {
      alert('שגיאה בתקשורת עם השרת');
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  const handleDelete = async (row, idColumn) => {
    console.log(idColumn);
    console.log(row[idColumn]);
    const confirmDelete = window.confirm('האם את בטוחה שברצונך למחוק את הרשומה?');
    if (!confirmDelete) return;

    try {
      const idFieldMap = {
        wines: 'wineID',
        customers: 'Id',
        guides: 'Id',
        managers: 'Id',
        tours: 'TourID',
        wineTypes: 'WineTypeID',
        tourTypes: 'TourTypeID',
      };
      const idFieldName = idFieldMap[initialType] || 'Id';
      const response = await fetchServer(`/managers/${initialType}/delete`, { [idFieldName]: row[idColumn] }, 'POST');
      if (response?.success) {
        setData(data.filter(item => item[idColumn] !== row[idColumn]));
        alert('נמחק בהצלחה');
      } else {
        alert('אירעה שגיאה במחיקה');
      }
    } catch {
      alert('שגיאה בתקשורת עם השרת');
    }
  };
  const handleAddTourType = async (e) => {
    e.preventDefault();

    if (!newTourTypeName.trim() || !newTourTypeDesc.trim() || !newTourTypePrice || !newTourTypeImage) {
      alert('נא למלא את כל השדות ולהעלות תמונה');
      return;
    }

    setIsAddingTourType(true);

    const formData = {
      TourTypeName: newTourTypeName,
      DescriptionT: newTourTypeDesc,
      PricePerPerson: newTourTypePrice,
      ImageURL: newTourTypeImage.name // רק שם הקובץ - התמונה כבר הועלתה או תועלה ידנית
    };

    try {
      const response = await fetchServer('/tours/addTourType', formData, 'POST');
      if (!response?.ok && !response?.success) throw new Error('הוספת סוג סיור נכשלה');

      alert('סוג הסיור נוסף בהצלחה!');
      setShowTourTypeModal(false);
      setNewTourTypeName('');
      setNewTourTypeDesc('');
      setNewTourTypePrice('');
      setNewTourTypeImage(null);
    } catch (error) {
      alert('שגיאה בהוספת סוג סיור');
    } finally {
      setIsAddingTourType(false);
    }
  };

  const renderTable = () => {
    if (data.length === 0) return <p>לא נמצאו נתונים להצגה.</p>;
    if (!data) return null;
    const allColumns = Object.keys(data[0]);
    const isReadOnly = initialType === 'productsSold' || initialType === 'sales';
    const idColumn = allColumns.find(col => col.toLowerCase().endsWith('id')) || 'Id';
    const columns = allColumns.filter(col => !/id$/i.test(col));

    return (
      <div className='manager-dashboard-container'>
        <img src="/images/logo.png" alt="logo" className="logo" />
        <table className="dynamic-table">

          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
              {!isReadOnly && <th>פעולות</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const rowId = row[idColumn];
              const isEditing = rowId === editRowId;

              return (
                <tr key={`${rowId}-${idx}`}>
                  {columns.map((col, j) => (
                    <td key={j}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRowData[col] || ''}
                          onChange={(e) => handleInputChange(col, e.target.value)}
                        />
                      ) : (
                        typeof row[col] === 'string' && (row[col].endsWith('.webp') || row[col].endsWith('.jfif') || row[col].endsWith('.jpg') || row[col].endsWith('.png') || row[col].endsWith('.jpeg')) ? (
                          <img
                            src={`${baseURL}/${row[col]}`}
                            alt="תמונה"
                            className="table-image"
                          />
                          // ) : isDateString(row[col]) ? (
                          //   formatDate(row[col])
                        ) : (
                          row[col]
                        )

                      )}
                    </td>
                  ))}
                  {!isReadOnly && (
                    <td className="action-cell">
                      {isEditing ? (
                        <>
                          <button className="edit-btn" onClick={handleSave}>✔</button>
                          <button className="delete-btn" onClick={handleCancel}>✖</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEditClick(row)}>✏️</button>
                          <button className="delete-btn" onClick={() => handleDelete(row, idColumn)}>❌</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="manager-table-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/managers-home')}>
          חזרה
        </button>
      </div>
      <div className="manager-nav-tabs">
        {Object.entries(tableLabels).map(([key, label]) => (
          <button
            key={key}
            className={`nav-tab-button ${initialType === key ? 'active-tab' : ''}`}
            onClick={() => navigate(`/manager-dashboard/${key}`)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="top-bar">
        {renderAddButton()}
      </div>
      <h2>טבלת ניהול: {tableLabels[initialType] || 'לא נבחרה קטגוריה'}</h2>
      {renderTable()}
      {showTourTypeModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>הוספת סוג סיור</h2>
            <form onSubmit={handleAddTourType}>
              <input
                type="text"
                placeholder="שם סוג סיור"
                value={newTourTypeName}
                onChange={(e) => setNewTourTypeName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="תיאור"
                value={newTourTypeDesc}
                onChange={(e) => setNewTourTypeDesc(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="מחיר לאדם"
                value={newTourTypePrice}
                onChange={(e) => setNewTourTypePrice(e.target.value)}
                required
                min="0"
              />
              <p className="upload-label">בחר תמונה לסוג הסיור:</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewTourTypeImage(e.target.files[0])}
                required
              />
              <div className="modal-actions">
                <button type="submit" disabled={isAddingTourType} className="confirm-button">
                  {isAddingTourType ? 'מוסיף...' : 'הוסף'}
                </button>
                <button type="button" onClick={() => setShowTourTypeModal(false)} className="cancel-button">
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerDashboard;
