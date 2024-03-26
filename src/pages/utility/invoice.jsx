import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import axios from 'axios';
import Modal from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import InvoiceAddPage from "./invoice-add";
import InvoiceEditPage from "./invoice-edit";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const InvoicePage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'guest-id': "1",
          },
        };
        const response = await axios.get('https://mhl.myzens.net/api/v1/order/list', config);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const data = response.data;
        setOrders(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchOrders();
  }, []);

  const activateInlineEditing = (id) => {
    console.log('Edit', id);
    setEditing(id);
    setOpenModal(true);
  };

  const activateRunAndStopItem = (id) => {
    console.log('Stop/Run', id);
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const handleRestart = (id) => {
    console.log('Restart', id);
  };

  const handleSubmit = () => {
    const updatedData = orders.map((row) =>
      row.id === editing.id ? editing : row
    );
    setOrders(updatedData);
    setEditing(null);
  };
  
  const actions = [
    {
      name: "run/stop",
      icon: "carbon:stop-outline",
      doit: (id) => {
        activateRunAndStopItem(id);
      },
    },
    {
      name: "restart",
      icon: "solar:restart-square-line-duotone",
      doit: (id) => {
        handleRestart(id);
      },
    },
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => {
        activateInlineEditing(id);
      },
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      doit: (id) => {
        handleDelete(id);
      },
    },
  ];
  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Order",
      accessor: "order",
      Cell: (row) => {
        return <span>#{row?.cell?.value}</span>;
      },
    },
    {
      Header: "customer",
      accessor: "customer",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                 { row?.cell?.value.name}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "date",
      accessor: "date",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "quantity",
      accessor: "quantity",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "amount",
      accessor: "amount",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === "accepted"
                  ? "text-success-500 bg-success-500"
                  : ""
                } 
            ${row?.cell?.value === "pending"
                  ? "text-warning-500 bg-warning-500"
                  : ""
                }
            ${row?.cell?.value === "cancled"
                  ? "text-danger-500 bg-danger-500"
                  : ""
                }
            
             `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "payment",
      accessor: "payment_status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 
              ${row?.cell?.value === "paid"
                  ? "text-success-500 bg-success-500"
                  : ""
                } 
            ${row?.cell?.value === "unpaid"
                  ? "text-warning-500 bg-warning-500"
                  : ""
                }
            ${row?.cell?.value === "cancled"
                  ? "text-danger-500 bg-danger-500"
                  : ""
                }
            
             `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div>
            <Dropdown
              classMenuItems="right-0 w-[140px] top-[110%] "
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const id = row.cell.row.values.order;
                      item.doit(id);
                    }}
                    className={`
                
                  ${item.name === "delete"
                        ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                      }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                  >
                    <span className="text-base">
                      <Icon icon={item.icon} />
                    </span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </Dropdown>
            {openModal && editing === row.cell.row.values.order && (
              <Modal
                activeModal={openModal}
                onClose={() => { setOpenModal(false); setEditing(null); }}
                title="Edit Row"
              >
                <InvoiceEditPage id={editing} />
              </Modal>
            )}
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, [openModal, editing]);
  const data = useMemo(() => orders.map((order, index) => ({
    id: index + 1,
    order: order.id,
    customer: {
      name: order?.name,
      image: order?.customer?.image,
    },
    date: formatDate(order?.delivery_date),
    quantity: order?.total_quantity,
    amount: `$${order?.order_amount}`,
    status: order?.order_status,
    payment_status: order?.payment_status,
    action: null,
  })), [orders]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Form List</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <Modal
              title="Form Modal"
              label="Add Record"
              labelClass="btn-outline-dark"
              uncontrol
            >
              <InvoiceAddPage />
            </Modal>
          </div>
        </div>
        <div className=" -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className=" border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
              <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                Go
              </span>
              <span>
                <input
                  type="number"
                  className=" form-control py-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                    }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default InvoicePage;
