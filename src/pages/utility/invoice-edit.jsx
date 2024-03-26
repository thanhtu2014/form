import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Repeater from "./Repeater";
import { useForm, Controller } from "react-hook-form";

const InvoiceEditPage = ({id}) => {
  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [balance, setBalance] = useState(0);

  const { register, control, handleSubmit, setValue, getValues, reset, trigger, watch } = useForm(
    {
      defaultValues: {
        order_details: [{ product: "Product1", unit: "kg", qty: "1", price: "0", total: "0", service: "1" }],
      },
    }
  );

  const onSubmit = async (data) => {
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
  
  return (
    <div>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6">
            <Repeater
              id={id}
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

export default InvoiceEditPage;
