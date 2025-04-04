import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponesAPI } from '../services/api/coupones.api';

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const STORAGE_KEY = 'discounts';
  const FETCH_TIME_KEY = 'lastFetchedTime';
  const CACHE_DURATION = 60 * 60 * 1000; // ساعة واحدة

  // ✅ تحميل البيانات من localStorage عند بدء التشغيل
  const [discounts, setDiscounts] = useState(() => {
    const savedDiscounts = localStorage.getItem(STORAGE_KEY);
    return savedDiscounts ? JSON.parse(savedDiscounts) : [];
  });

  // ✅ حفظ البيانات تلقائيًا في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discounts));
  }, [discounts]);

  // ✅ استرجاع البيانات من API فقط إذا كانت قديمة
  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const lastFetched = localStorage.getItem(FETCH_TIME_KEY);
        const now = new Date().getTime();

        if (lastFetched && now - new Date(lastFetched).getTime() < CACHE_DURATION) {
          console.log('✅ Using cached discounts');
          return; // استخدام البيانات المخزنة بدون إعادة الجلب
        }

        console.log('🔄 Fetching discounts from API...');
        const response = await couponesAPI.getAllCoupones();

        let discountData = [];
        if (response?.data) {
          if (Array.isArray(response.data)) {
            discountData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            discountData = response.data.data;
          } else if (typeof response.data === 'object') {
            discountData = Object.values(response.data);
          }
        }

        const formattedData = discountData.map(discount => ({
          id: discount.id,
          code: discount.code,
          amount: discount.amount,
          fromDate: discount.fromDate,
          toDate: discount.toDate,
          maxUsage: discount.maxUsage,
          usageCount: discount.usageCount,
          status: discount.status || 'Active'
        }));

        setDiscounts(formattedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedData));
        localStorage.setItem(FETCH_TIME_KEY, new Date().toISOString());
      } catch (error) {
        console.error('❌ Error fetching discounts:', error);
      }
    }

    fetchDiscounts();
  }, []);

  // ✅ إضافة خصم جديد
  const addDiscount = async (newDiscount) => {
    try {
      const response = await couponesAPI.createCoupone(newDiscount);
      if (response?.data) {
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

  // ✅ تحديث الخصم
  const updateDiscount = async (updatedDiscount) => {
    try {
      const response = await couponesAPI.updateCoupone(updatedDiscount.id, updatedDiscount);
      if (response?.data) {
        setDiscounts(discounts.map(discount => 
          discount.id === updatedDiscount.id ? { ...discount, ...updatedDiscount } : discount
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating discount:', error);
      return false;
    }
  };

  // ✅ حذف الخصم
  const deleteDiscount = async (id) => {
    try {
      const response = await couponesAPI.deleteCoupone(id);
      if (response) {
        setDiscounts(discounts.filter(discount => discount.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting discount:', error);
      return false;
    }
  };

  return (
    <DiscountContext.Provider value={{ discounts, addDiscount, updateDiscount, deleteDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
}

export const useDiscountContext = () => useContext(DiscountContext);
