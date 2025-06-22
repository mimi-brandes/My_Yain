// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './CartContext';
// import { UserContext } from '../userContext';
// import { fetchServer } from '../service/server';
// import '../css/Pay.css';

// const Pay = () => {
//   const navigate = useNavigate();
//   const { clearCart, cart } = useCart();
//   const { currentUser } = useContext(UserContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal] = useState(0);

//   // מחשב את פרטי הסל (כולל כמות ומחיר) לצורך שליחה לשרת
//   useEffect(() => {
//     const ids = Object.keys(cart).map(Number);
//     if (ids.length === 0) return setCartItems([]);

//     fetchServer('/wines/by-ids', { ids }, 'POST')
//       .then(data => {
//         if (data) {
//           const merged = data.map(w => ({
//             productID: w.WineID,
//             WineName: w.WineName,
//             Price: w.Price,
//             quantity: cart[w.WineID] || 0
//           }));
//           setCartItems(merged);

//           const subtotal = merged.reduce((sum, item) => sum + item.Price * item.quantity, 0);
//           const shipping = subtotal === 0 || subtotal >= 349 ? 0 : 40;
//           setTotal(subtotal + shipping);
//         }
//       });
//   }, [cart]);

//   const handleClick = async () => {
//     if (!currentUser || cartItems.length === 0) {
//       alert('לא ניתן לבצע רכישה - חסר מידע');
//       return;
//     }

//     const saleData = {
//       customerID: currentUser.Id,
//       endPrice: total,
//       cartItems: cartItems.map(i => ({
//         productID: i.productID,
//         quantity: i.quantity
//       }))
//     };

//     const response = await fetchServer('/wines/sale', saleData, 'POST');
//     if (response && response.saleID) {
//       alert('תודה על התשלום!');
//       clearCart();
//       navigate('/client-home');
//     } else {
//       alert('אירעה שגיאה בעת ביצוע התשלום');
//     }
//   };

//   return (
//     <div className="image-button-container">
//       <img src="/images/pay.png" alt="imagePay" className="main-image" />
//       <button className="checkout-button" onClick={handleClick}>שלם</button>
//     </div>
//   );
// };

// export default Pay;
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { UserContext } from '../userContext';
import { fetchServer } from '../service/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../css/Pay.css';

const Pay = () => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { currentUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  useEffect(() => {
    const ids = Object.keys(cart).map(Number);
    if (ids.length === 0) return setCartItems([]);

    fetchServer('/wines/by-ids', { ids }, 'POST')
      .then(data => {
        if (data) {
          const merged = data.map(w => ({
            productID: w.WineID,
            WineName: w.WineName,
            Price: Number(w.Price),
            quantity: cart[w.WineID] || 0
          }));
          setCartItems(merged);

          const subtotal = merged.reduce((sum, item) => sum + item.Price * item.quantity, 0);
          const shipping = subtotal === 0 || subtotal >= 349 ? 0 : 40;
          setTotal(subtotal + shipping);
        }
      });
  }, [cart]);

  const handleClick = async () => {
    if (!currentUser || cartItems.length === 0) {
      alert('Cannot complete purchase - missing information');
      return;
    }

    const saleData = {
      customerID: currentUser.Id,
      endPrice: total,
      cartItems: cartItems.map(i => ({
        productID: i.productID,
        quantity: i.quantity
      }))
    };

    const response = await fetchServer('/wines/sale', saleData, 'POST');
    if (response && response.saleID) {
      const doc = new jsPDF();
      const orderNumber = generateOrderNumber();
    
      const logoImg = new Image();
      logoImg.src = '/images/logo.png';

      logoImg.onload = () => {
        doc.addImage(logoImg, 'PNG', 150, 10, 30, 30);

        doc.setFontSize(18);
        doc.text('Purchase Invoice', 20, 20);

        doc.setFontSize(12);
        doc.text(`Order Number: ${orderNumber}`, 20, 35);
        doc.text(`Customer Name: ${currentUser.FullName}`, 20, 43);
        doc.text(`Total Amount: ${total.toFixed(2)} $`, 20, 51);
        doc.text('Order Details:', 20, 60);

        autoTable(doc, {
          startY: 65,
          head: [['#', 'Wine Name', 'Quantity', 'Unit Price (NIS)', 'Total']],
          body: cartItems.map((item, i) => [
            i + 1,
            item.WineName,
            item.quantity,
            item.Price.toFixed(2),
            (item.Price * item.quantity).toFixed(2)
          ]),
          styles: { font: 'helvetica', fontSize: 10 },
          headStyles: { fillColor: [100, 100, 255] }
        });

        doc.save('invoice.pdf');

        alert('Thank you for your purchase!');
        clearCart();
        navigate('/client-home');
      };
    } else {
      alert('An error occurred while processing your payment');
    }
  };

  return (
    <div className="image-button-container">
      {/* Optional image: <img src="/images/pay.png" alt="Pay" className="main-image" /> */}
      <button className="checkout-button" onClick={handleClick}>Pay Now</button>
    </div>
  );
};

export default Pay;