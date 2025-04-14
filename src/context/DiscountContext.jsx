import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponesAPI } from '../services/api/coupones.api';
import Swal from 'sweetalert2';

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const STORAGE_KEY = 'discounts';
  const FETCH_TIME_KEY = 'lastFetchedTime';
  const CACHE_DURATION = 60 * 60 * 1000;


  const [discounts, setDiscounts] = useState([]);
  const [isGetCouponsLoading, setIsGetCouponsLoading] = useState(false);


  const fetchDiscounts = async () => {
    try {

      setIsGetCouponsLoading(true);
      const response = await couponesAPI.getAllCoupones();
      console.log('🔄 Discounts fetched:', response);

      if (response.data) {
        const formattedData = response.data.coupons.map(discount => ({
          id: discount._id,
          code: discount.code,
          amount: discount.amount,
          fromDate: discount.fromDate,
          toDate: discount.toDate,
          maxUsage: discount.maxUsage || discount.usagePerUser[0].maxUsage,
          usageCount: discount.usageCount,
          status: discount.status || 'Active',
          usagePerUser: discount.usagePerUser,
        }));
        setDiscounts(formattedData);

      }
      setIsGetCouponsLoading(false);


    } catch (error) {
      console.error('❌ Error fetching discounts:', error);
      setIsGetCouponsLoading(false);
    }
  }





  const addDiscount = async (newDiscount) => {
    try {
      const response = await couponesAPI.createCoupone(newDiscount);
      if (response?.data) {
        Swal.fire({
          icon: 'success',
          title: 'Discount added successfully',
          showConfirmButton: false,
          timer: 1500
        })
        const newDiscountWithId = {
          ...newDiscount,
          id: response.data.id || response.data._id || Date.now().toString()
        };

        const updatedDiscounts = [...discounts, newDiscountWithId];
        setDiscounts(updatedDiscounts);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error adding discount:', error);
      return false;
    }
  };


  const updateDiscount = async (updatedDiscount) => {
    try {
      const dataToSend = {
        code: updatedDiscount.code,
        amount: updatedDiscount.amount,
        fromDate: updatedDiscount.fromDate,
        toDate: updatedDiscount.toDate,
        maxUsage: updatedDiscount.maxUsage,
        usageCount: updatedDiscount.usageCount,
      };
      const response = await couponesAPI.updateCoupone(updatedDiscount.id, dataToSend);
      if (response?.data) {
        setDiscounts(discounts.map(discount =>
          discount.id === updatedDiscount.id ? { ...discount, ...updatedDiscount } : discount
        ));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Discount updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
        fetchDiscounts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating discount:', error);
      return false;
    }
  };


  const deleteDiscount = async (id) => {
    try {
      const response = await couponesAPI.deleteCoupone(id);
      if (response) {
        setDiscounts(discounts.filter(discount => discount.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Discount deleted successfully!',
          showConfirmButton: false,
          timer: 1500
        })
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting discount:', error);
      return false;
    }
  };

  return (
    <DiscountContext.Provider value={{ discounts, addDiscount, updateDiscount, deleteDiscount, fetchDiscounts, isGetCouponsLoading }}>
      {children}
    </DiscountContext.Provider>
  );
}

export const useDiscountContext = () => useContext(DiscountContext);
