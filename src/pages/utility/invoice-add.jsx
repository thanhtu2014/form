import React, { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Repeater from "./Repeater";
import Flatpickr from "react-flatpickr";
import MainLogo from "@/assets/images/svg/logo.svg";
import { useForm, Controller } from "react-hook-form";

const InvoiceAddPage = () => {
  const [picker, setPicker] = useState(new Date());

  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const { register, control, handleSubmit, setValue, getValues, reset, trigger, watch } = useForm(
    {
      defaultValues: {
        order_details: [{ product: "Product1", unit: "kg", qty: "1", price: "0", total: "0", service: "1" }],
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      const payload = {
        cart: data.order_details.map(item => ({
          product_id: item.product.value.toString(),
          price: item.price.toString(),
          // variation: item?.product?.variations || null,
          discount_amount: 0,
          quantity: parseInt(item.qty, 10),
          tax_amount: 0,
          add_on_ids: [],
          add_on_qtys: [],
        })),
        coupon_discount_amount: parseFloat(discount),
        coupon_discount_title: "",
        name: data.name,
        phone: data.phone,
        email: data.email,
        order_amount: parseFloat(balance),
        order_type: "delivery",
        delivery_address_id: 11,
        delivery_address: data.delivery_address,
        payment_method: "cash_on_delivery",
        order_note: data.orderNote,
        coupon_code: "",
        delivery_time: "now",
        delivery_date: new Date().toISOString().split('T')[0],
        branch_id: 1,
        distance: -1,
        is_partial: "0",
        guest_id: "1",
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'guest-id': "1",
          "branch_id": "1"
        },
      };

      const response = await axios.post('https://mhl.myzens.net/api/v1/order/place', payload, config);
      if (response.status === 200) {
        toast.success("successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Invalid", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axios.get('https://mhl.myzens.net/api/v1/products/latest?limit=100&offset=1');
  //       if (res) {
  //         setProducts(res.data.products);
  //       }
  //     } catch (e) {
  //       console.log('error crash page ', e);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const productOptions = products.map(product => ({
  //   value: product.id,
  //   label: product.name,
  //   ...product,
  // }));

  return (
    <div>
      <Card>
        <h4 className="text-slate-900 dark:text-white text-xl mb-4">
          <span className="text-slate-900 dark:text-white text-2xl text-center">Form No.</span> #89572935Kh
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6">
            <Repeater
              register={register}
              control={control}
              setValue={setValue}
              getValues={getValues}
              reset={reset}
              trigger={trigger}
              watch={watch}
              discount={discount}
              setDiscount={setDiscount}
              deposit={deposit}
              setDeposit={setDeposit}
              balance={balance}
              setBalance={setBalance}
            />
          </div>
          <Textarea
            label="Additional note"
            type="text"
            rows="2"
            register={register}
            placeholder="Note"
            className="lg:w-1/2"
            name="order_note"
            {...register("order_note")}
          />
          <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
            <Button type='submit' text="Save" className="btn-dark" />
          </div>
        </form>

      </Card>
    </div>
  );
};

export default InvoiceAddPage;
