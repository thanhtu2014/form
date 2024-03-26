import React, { useEffect, useState } from "react";
import axios from 'axios';
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TotalTable from "./TotalTable";
import userDarkMode from "@/hooks/useDarkMode";
import { useParams } from 'react-router-dom';

// import images
import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";

const InvoicePreviewPage = () => {
  const printPage = () => {
    window.print();
  };
  const { id } = useParams();
  const [isDark] = userDarkMode();
  const [preview, setPreview] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const payload = {
          order_id: id,
        }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="lg:flex justify-between flex-wrap items-center mb-6">
        <h4>title</h4>
        <div className="flex lg:justify-end items-center flex-wrap space-xy-5">
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg">
              <Icon icon="heroicons:pencil-square" />
            </span>
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={printPage}
            className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:printer" />
            </span>
            <span>Print</span>
          </button>
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg">
              <Icon icon="heroicons:arrow-down-tray" />
            </span>
            <span>Download</span>
          </button>
          <button className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse">
            <span className="text-lg transform -rotate-45">
              <Icon icon="heroicons:paper-airplane" />
            </span>
            <span>Send invoice</span>
          </button>
        </div>
      </div>
      <Card bodyClass="p-0" className="max-w-4xl">
        <div className="flex justify-between flex-wrap space-y-4 px-6 pt-6 bg-slate-50 dark:bg-slate-800 pb-6 rounded-t-md">
          <div>
            <img src={isDark ? LogoWhite : MainLogo} alt="" />

            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
              ZenUI <br />
              No 59, Cityland, Go Vap, HCM,VN <br />
              <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:phone" />
                <span>(+84) 000-000-000</span>
              </div>
              <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:mail" />
                <span>sales@zen-s.com</span>
              </div>
            </div>
          </div>
          <div>
            <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
              Bill to:
            </span>

            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
              ZenUI <br />
              {preview?.delivery_address} <br />
              <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:phone" />
                <span>{preview?.phone}</span>
              </div>
              <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                <Icon icon="heroicons-outline:mail" />
                <span>{preview?.email}</span>
              </div>
            </div>
          </div>
          <div className="space-y-[2px]">
            <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
              Invoice:
            </span>
            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              Invoice number:
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              #{preview?.id}
            </div>
            <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
              date
            </h4>
            <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
              {formatDate(preview?.delivery_date)}
            </div>
          </div>
        </div>
        <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
          <TotalTable preview={preview}/>
        </div>
        <div className="py-10 text-center md:text-2xl text-xl font-normal text-slate-600 dark:text-slate-300">
          Thank you for your purchase!
        </div>
      </Card>
    </div>
  );
};

export default InvoicePreviewPage;
