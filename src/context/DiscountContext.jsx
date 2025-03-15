import React, { createContext, useContext, useState } from 'react';

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: 'SUMMER2024',
      value: '25%',
      expiryDate: '2024-08-31',
      status: 'Active',
      usageLimit: 100,
      usageCount: 45,
      description: 'Summer sale discount',
      minPurchase: 100,
    },
    {
      id: 2,
      code: 'WELCOME50',
      value: '50%',
      expiryDate: '2024-12-31',
      status: 'Active',
      usageLimit: 200,
      usageCount: 98,
      description: 'New customer discount',
      minPurchase: 150,
    },
  ]);

  const addDiscount = (newDiscount) => {
    setDiscounts([...discounts, { ...newDiscount, id: Date.now() }]);
  };

  const updateDiscount = (updatedDiscount) => {
    setDiscounts(discounts.map(discount => 
      discount.id === updatedDiscount.id ? updatedDiscount : discount
    ));
  };

  const deleteDiscount = (id) => {
    setDiscounts(discounts.filter(discount => discount.id !== id));
  };

  return (
    <DiscountContext.Provider value={{ 
      discounts, 
      addDiscount, 
      updateDiscount, 
      deleteDiscount 
    }}>
      {children}
    </DiscountContext.Provider>
  );
}

export const useDiscountContext = () => useContext(DiscountContext);