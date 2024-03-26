import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useFieldArray, useWatch } from "react-hook-form";
import Select from 'react-select';
import axios from 'axios';

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    zIndex: 1000
  }),
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
  }),
};

function totalCal(results) {
  let totalValue = 0;

  results.forEach(item => {
    const service = parseFloat(item.service);
    if (!isNaN(service)) {
      if (item.price && typeof item.price === "number") {
        totalValue += item.price * item.qty + service;
      } else if (item.price && typeof item.price === "string") {
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
          totalValue += price * item.qty + service;
        }
      }
    }
  });

  return totalValue.toFixed(2);
}

const columns = [
  {
    label: "Product",
    field: "product",
  },
  {
    label: "Unit",
    field: "unit",
  },
  {
    label: "Price",
    field: "price",
  },
  {
    label: "Quantity",
    field: "quantity",
  },
  {
    label: "Service fee",
    field: "service",
  },
  {
    label: "Total",
    field: "total",
  }
];

const Repeater = ({
  id,
  register,
  control,
  setValue,
  trigger,
  discount,
  setDiscount,
  deposit,
  setDeposit,
  balance,
  setBalance
}) => {
  const [products, setProducts] = useState([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "order_details",
  });

  const total = useWatch({
    control,
    name: "order_details",
    defaultValue: fields
  });

  const output = totalCal(total);

  useEffect(() => {
    const calculatedBalance = parseFloat(output) - discount + deposit;
    setBalance(calculatedBalance);
  }, [output, discount, deposit]);

  const handleDiscountChange = (event) => {
    const percentage = parseFloat(event.target.value);
    if (percentage >= 0 && percentage <= 100) {
      const discountValue = parseFloat(output) * (percentage / 100);
      setDiscount(discountValue);
    } else {
      setDiscount(0);
    }
  };

  const handleDepositChange = (event) => {
    setDeposit(parseFloat(event.target.value) || 0);
  };

  const handleSelectChange = (selectedOption, index) => {
    setValue(`order_details.${index}.product`, selectedOption);
    setValue(`order_details.${index}.price`, selectedOption?.price || '0');
    setValue(`order_details.${index}.unit`, selectedOption?.unit || '');
    setValue(`order_details.${index}.total`, selectedOption?.total || '');
    setValue(`order_details.${index}.service`, selectedOption?.service || '1');
    trigger(`order_details.${index}.product`);
  };

  const handleNonNegativeInput = (event, index, field) => {
    const value = parseFloat(event.target.value);
    if (value >= 0) {
      setValue(`order_details.${index}.${field}`, value.toString());
    } else {
      setValue(`order_details.${index}.${field}`, '0');
    }
    trigger(`order_details.${index}.${field}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://mhl.myzens.net/api/v1/products/latest?limit=100&offset=1');
        if (res) {
          setProducts(res.data.products);
        }
      } catch (e) {
        console.log('error crash page ', e);
      }
    };

    fetchProducts();
  }, []);

  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name,
    ...product,
  }));
  const [preview, setPreview] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const payload = {
          order_id: id,
        };
        const res = await axios.post('https://mhl.myzens.net/api/v1/order/preview', payload);
        if (res.status === 200) {
          setPreview(res.data);
        }
      } catch (e) {
        console.log('error crash page ', e);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="bg-slate-50 dark:bg-slate-800 -mx-6 px-6 py-6">
        <div className="mb-6 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase">
          Items info
        </div>

        <div>
          <form>
              <div className="">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-visible ">
                    <table className="min-w-full border border-slate-100 z-0 table-fixed dark:border-slate-700 border-collapse">
                      <thead className="">
                        <tr className="bg-white">
                          {columns.map((column, i) => (
                            <th
                              key={i}
                              scope="col"
                              className=" table-th border border-slate-100 dark:bg-slate-800 dark:border-slate-700 "
                            >
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white ">
                        {fields.map((field, index) => {
                          const service = parseFloat(total[index]?.service);
                          const totalAmount =
                            total[index]?.qty * total[index]?.price + service;
                          field.total = parseFloat(totalAmount.toFixed(2));
                          return <tr key={field.id}>
                            <td className="table-td  max-w-[19rem] min-w-80 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                              <Select
                                autoFocus
                                className="react-select border-none max-w-[510px]"
                                classNamePrefix="select"
                                defaultValue={productOptions.find(o => o.value === field.product) || preview?.preview?.name}
                                styles={styles}
                                name={`order_details[${index}].product`}
                                options={productOptions}
                                getOptionLabel={e => (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="min-w-[30px] h-[30px]">
                                      <img className="w-[30px] h-[30px]" src={`https://mhl.myzens.net/public/storage/product/${e.image}`} alt="image" />
                                    </div>
                                    <span style={{ marginLeft: 10 }}>{e.label}</span>
                                  </div>
                                )}
                                onChange={(option) => handleSelectChange(option, index)}
                                isClearable
                                id={`product-select-${index}`}
                              />
                            </td>
                            <td className="table-td border w-48 border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                              <Textinput
                                type="text"
                                disabled
                                className="border-none"
                                id={`unit${index}`}
                                placeholder="Unit..."
                                register={register}
                                name={`order_details[${index}].unit`}
                                defaultValue={field.unit}
                                {...register(`order_details[${index}].unit`)}
                              />
                            </td>
                            <td className="table-td border border-slate-100 w-96 dark:bg-slate-800 dark:border-slate-700 ">
                              <Textinput
                                type="text"
                                disabled
                                className="border-none"
                                id={`unit${index}`}
                                placeholder="Price..."
                                register={register}
                                name={`order_details[${index}].price`}
                                defaultValue={field.price}
                                {...register(`order_details[${index}].price`)}
                              />
                            </td>
                            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                              <Textinput
                                type="text"
                                className="border-none"
                                id={`qty${index}`}
                                placeholder="Quantity..."
                                register={register}
                                onChange={(event) => handleNonNegativeInput(event, index, 'qty')}
                                name={`order_details[${index}].qty`}
                                {...register(`order_details[${index}].qty`)}
                                defaultValue={1}
                              />
                            </td>
                            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                              <Textinput
                                type="text"
                                className="border-none"
                                id={`service${index}`}
                                placeholder="Service fees..."
                                register={register}
                                onChange={(event) => handleNonNegativeInput(event, index, 'service')}
                                name={`order_details[${index}].service`}
                                {...register(`order_details[${index}].service`)}
                                defaultValue={field.service}
                              />
                            </td>
                            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
                              <div className="flex justify-between items-center space-x-5">
                                <div className="flex justify-between items-center w-3/5">

                                  <span className="text-slate-900 dark:text-slate-300">${totalAmount || 0}</span>
                                </div>
                                {index > 0 && (
                                  <div className="flex-none relative">
                                    <button
                                      onClick={() => remove(index)}
                                      type="button"
                                      className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                                    >
                                      <Icon icon="heroicons-outline:trash" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          </form>
          <div className="mt-4">
            <Button
              text="Add new"
              icon="heroicons-outline:plus"
              className="text-slate-600 p-0 dark:text-slate-300"
              onClick={() => append()}
            />
          </div>
          <div className="flex flex-col min-w-[260px] w-1/12 space-y-3 ml-[auto] mr-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase mr-4">
                Total:
              </span>
              <span className="text-slate-900 dark:text-slate-300">${output}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase mr-4">
                Discount(%):
              </span>
              <Textinput
                type="text"
                value={((discount / parseFloat(output)) * 100).toString()}
                onChange={handleDiscountChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase mr-[47px]">
                Deposit:
              </span>
              <Textinput
                type="text"
                value={deposit}
                onChange={handleDepositChange}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase mr-4">
                Balance:
              </span>
              <span className="text-slate-900 dark:text-slate-300 font-bold">
                ${balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repeater;
