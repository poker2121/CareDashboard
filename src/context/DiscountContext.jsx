import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponesAPI } from '../services/api/coupones.api'; 

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const response = await couponesAPI.getAllCoupones();
        
       
       
        
      
        let discountData = [];
        
        if (response && response.data) {
          // If response.data is an array, use it directly
          if (Array.isArray(response.data)) {
            discountData = response.data;
          } 
          // If response.data has a nested data array (common in some APIs)
          else if (response.data.data && Array.isArray(response.data.data)) {
            discountData = response.data.data;
          }
          // If response.data is an object with discount items
          else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
            // Try to convert object to array if possible
            discountData = Object.values(response.data);
          }
        }
        
        // Now map the data
        const formattedData = discountData.map(discount => ({
          id: discount.id,
          code: discount.code,
          amount: discount.amount, 
          fromDate: discount.fromDate, 
          toDate: discount.toDate, 
          maxUsage: discount.maxUsage, 
          usageCount: discount.usageCount,
          status: discount.status || "Active" 
        }));
        
        setDiscounts(formattedData);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    }

    fetchDiscounts();
  }, []);

  const addDiscount = async (newDiscount) => {
    try {
      const discountPayload = { ...newDiscount };
      const response = await couponesAPI.createCoupone(discountPayload);
      if (response && response.data) {
        const newDiscountWithId = {
          ...newDiscount,
          id: response.data.id || response.data._id || Date.now().toString(),
        };
        // تحديث الـ state مباشرة من غير fetch
        setDiscounts([...discounts, newDiscountWithId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding discount:', error);
      return false;
    }
  };

  const updateDiscount = async (updatedDiscount) => {
    try {
      console.log("Updating discount:", updatedDiscount);
      const response = await couponesAPI.updateCoupone(updatedDiscount.id, {
        code: updatedDiscount.code,
        amount: updatedDiscount.amount,
        fromDate: updatedDiscount.fromDate,
        toDate: updatedDiscount.toDate,
        maxUsage: updatedDiscount.maxUsage,
        usageCount: updatedDiscount.usageCount
      });
      
      console.log("Update discount response:", response);

      if (response && response.data) {
        setDiscounts(discounts.map(discount =>
          discount.id === updatedDiscount.id ? { ...discount, ...updatedDiscount } : discount
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating discount:', error);
      return false;
    }
  };

  const deleteDiscount = async (id) => {
    try {
      console.log("Deleting discount with ID:", id);
      const response = await couponesAPI.deleteCoupone(id);
      console.log("Delete discount response:", response);
      
      setDiscounts(discounts.filter(discount => discount.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting discount:', error);
      return false;
    }
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