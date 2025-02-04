import { useEffect, useState } from "react";
import { getDayWisePaymentDetails } from "../../services/RegistrationSVC";

const PaymentDetails = () => {
  const [value, setValue] = useState("1");

  return (
    <div className="w-full flex flex-col border rounded-md shadow-sm px-8 py-4 ">
      <div className="bg-secondary-200 flex justify-start h-14">
        <span
          onClick={() => setValue("1")}
          className={`cursor-pointer border  p-4 ${
            value === "1" ? "border-b-accent-600 border-b-2 text-text-900" : ""
          }`}
        >
          Day 1
        </span>
        <span
          onClick={() => setValue("2")}
          className={`cursor-pointer border  p-4 ${
            value === "2" ? "border-b-accent-600 border-b-2 text-text-900" : ""
          }`}
        >
          Day 2
        </span>
      </div>
      {value == "1" ? <Day1WisePaymentTable /> : <Day2WisePaymentTable />}
    </div>
  );
};

const Day1WisePaymentTable = () => {
  const [paymentDetails, setPaymentDetails] = useState<any>([]);

  useEffect(() => {
    const handleGetPaymentDetails = async () => {
      // console.log(day);
 
      const response = await getDayWisePaymentDetails("Day 1");
      if (response?.userDetails) {
        console.log(response.userDetails);

        setPaymentDetails(response.userDetails);
      } else {
        setPaymentDetails([]);
      }
    };
    handleGetPaymentDetails();
  }, []);

  if (!paymentDetails || paymentDetails.length == 0) {
    return <div>No data</div>;
  }

  return (
    <div className="h-full">
      <table className="w-full text-base rtl:text-right m-2 text-center overflow-x-scroll">
        <thead className=" text-text-900 uppercase bg-secondary-500">
          <tr>
            <th scope="col" className="px-6 py-3">
              GMID
            </th>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              College
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Total Amount Paid
            </th>
          </tr>
        </thead>

        <tbody className="w-full">
          {paymentDetails.map((item: any, idx: number) => {
            return (
              <tr className="bg-white border-b" key={idx}>
                <td
                  scope="row"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {item.user_id}
                </td>
                <td
                  scope="row"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {item.name}
                </td>
                <td
                  scope="row"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {item.college}
                </td>
                <td
                  scope="row"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {item.email}
                </td>
                <td
                  scope="row"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {item.amount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex w-full justify-end px-4 text-lg font-semibold">
        Total amount: {" "}
        {
            paymentDetails.reduce((acc: any, curr:any) => acc + curr.amount, 0)
        }
      </div>
    </div>
  );
};
const Day2WisePaymentTable = () => {
    const [paymentDetails, setPaymentDetails] = useState<any>([]);

    useEffect(() => {
      const handleGetPaymentDetails = async () => {
        // console.log(day);
   
        const response = await getDayWisePaymentDetails("Day 2");
        if (response?.userDetails) {
          console.log(response.userDetails);
  
          setPaymentDetails(response.userDetails);
        } else {
          setPaymentDetails([]);
        }
      };
      handleGetPaymentDetails();
    }, []);
  
    if (!paymentDetails || paymentDetails.length == 0) {
      return <div>No data</div>;
    }
  
    return (
      <div className="h-full">
        <table className="w-full text-base rtl:text-right m-2 text-center overflow-x-scroll">
          <thead className=" text-text-900 uppercase bg-secondary-500">
            <tr>
              <th scope="col" className="px-6 py-3">
                GMID
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                College
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Total Amount Paid
              </th>
            </tr>
          </thead>
  
          <tbody className="w-full">
            {paymentDetails.map((item: any, idx: number) => {
              return (
                <tr className="bg-white border-b" key={idx}>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {item.user_id}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {item.name}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {item.college}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {item.email}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {item.amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex w-full justify-end px-4 text-lg font-semibold">
          Total amount: {" "}
          {
              paymentDetails.reduce((acc: any, curr:any) => acc + curr.amount, 0)
          }
        </div>
      </div>
    );
};

export default PaymentDetails;
