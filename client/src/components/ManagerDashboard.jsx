import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchServer } from '../service/server';
import '../css/ManagerDashboard.css';

const tableLabels = {
  managers: 'מנהלים',
  guides: 'מדריכים',
  customers: 'לקוחות',
  wines: 'יינות',
  tours: 'סיורים',
  sales: 'הזמנות'
};

const ManagerDashboard = () => {
  const location = useLocation();
  const initialType = location.state?.type || '';
  const [selectedType, setSelectedType] = useState(initialType);
  const [data, setData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});

  useEffect(() => {
    if (!selectedType) return;
    const getData = async () => {
      const response = await fetchServer(`/manager/${selectedType}`);
      setData(response || []);
    };
    getData();
  }, [selectedType]);

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
      const response = await fetchServer(`/manager/${selectedType}/update`, editRowData, 'POST');
      if (response?.success) {
        const updatedData = data.map(item =>
          (item.Id === editRowData.Id || item.CustomerID === editRowData.CustomerID) ? editRowData : item
        );
        setData(updatedData);
        setEditRowId(null);
        setEditRowData({});
        alert('הנתונים עודכנו בהצלחה!');
      } else {
        alert('אירעה שגיאה בעדכון');
      }
    } catch {
      alert('שגיאה בתקשורת עם השרת');
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  const handleDelete = async (row, idColumn) => {
    const confirmDelete = window.confirm('האם את בטוחה שברצונך למחוק את הרשומה?');
    if (!confirmDelete) return;

    try {
      const response = await fetchServer(`/manager/${selectedType}/delete`, { id: row[idColumn] }, 'POST');
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

  const renderTable = () => {
    if (data.length === 0) return <p>לא נמצאו נתונים להצגה.</p>;

    const allColumns = Object.keys(data[0]);
    const idColumn = allColumns.find(col => col.toLowerCase().endsWith('id')) || 'Id';
    const columns = allColumns.filter(col => col !== idColumn);

    return (
      <div className='manager-dashboard-container'>
      <img src="/images/logo.png" alt="logo" className="logo" />
      <table className="dynamic-table">
        
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const rowId = row[idColumn];
            const isEditing = rowId === editRowId;

            return (
              <tr key={rowId || idx}>
                {columns.map((col, j) => (
                  <td key={j}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editRowData[col] || ''}
                        onChange={(e) => handleInputChange(col, e.target.value)}
                      />
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}
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
      <h2>טבלת ניהול: {tableLabels[selectedType] || 'לא נבחרה קטגוריה'}</h2>
      {renderTable()}
    </div>
  );
};

export default ManagerDashboard;
