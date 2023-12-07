import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { BarChart } from "../component/BarChart";

export default function AdminDashboard() {
  const { id } = useParams();
  const [isValidInput, setIsValidInput] = useState(false); // New state variable
  const [initialLoading, setInitialLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: "",
    location: "",
    chargeCustomers: false,
    customSongAmount: null,
    category1: null,
    category2: null,
    category3: null,
    category4: null,
  });
  const [prices, setPrices] = useState({
    category_6: userInfo.customSongAmount,
    category_7: userInfo.category1,
    category_8: userInfo.category2,
    category_9: userInfo.category3,
    category_10: userInfo.category4,
  })
  async function fetchData() {
    try {
      const response = await fetch(`https://stg.dhunjam.in/account/admin/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();

        // Update the userInfo state with the received data
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          id: data.data.id,
          name: data.data.name,
          location: data.data.location,
          customSongAmount: data.data.amount.category_6,
          category1: data.data.amount.category_7,
          category2: data.data.amount.category_8,
          category3: data.data.amount.category_9,
          category4: data.data.amount.category_10,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Set InitialLoading to false regardless of success or error
      setInitialLoading(false);
    }
  }

  // make a put request on save-btn click
  const handleSubmit = async () => {
    try {
      // create an object with the changed prices 
      // compare the prices state variable with the userInfo state variable and only add the changed prices to the object
      const changedPrices = {
        amount: {}
      }
      if (prices.category_6 !== userInfo.customSongAmount) {
        changedPrices.amount.category_6 = prices.category_6
      }
      if (prices.category_7 !== userInfo.category1) {
        changedPrices.amount.category_7 = prices.category_7
      }
      if (prices.category_8 !== userInfo.category2) {
        changedPrices.amount.category_8 = prices.category_8
      }
      if (prices.category_9 !== userInfo.category3) {
        changedPrices.amount.category_9 = prices.category_9
      }
      if (prices.category_10 !== userInfo.category4) {
        changedPrices.amount.category_10 = prices.category_10
      }

      const response = await fetch(`https://stg.dhunjam.in/account/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(changedPrices),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data)
        // if put request is successful, fetch the data again and update the userInfo state
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChargeChange = (event) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      chargeCustomers: event.target.value === "Yes"
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const regex = /^\d*$/;

    // Check if the value is not a valid number and not an empty string
    if (!regex.test(value)) {
      event.preventDefault();
      return;
    }

    const newValue = value === "" ? "" : Number(value);

    setPrices((prevPrices) => ({
      ...prevPrices,
      [name]: newValue
    }));
  };

  // whenever the prices state variable changes, the useEffect hook will run and check the validity of the inputs
  useEffect(() => {
    // Check the validity of the inputs 
    const isCustomSongAmountValid = prices.category_6 >= 99;
    const isCategory1Valid = prices.category_7 >= 79;
    const isCategory2Valid = prices.category_8 >= 59;
    const isCategory3Valid = prices.category_9 >= 39;
    const isCategory4Valid = prices.category_10 >= 19;

    // Update the isValidInput state based on the conditions
    setIsValidInput(
      isCustomSongAmountValid &&
      isCategory1Valid &&
      isCategory2Valid &&
      isCategory3Valid &&
      isCategory4Valid
    );
  }, [prices]);

  // use userInfo in the useEffect hook's dependency array and update the prices state variable whenever the userInfo state variable changes
  useEffect(() => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      category_6: userInfo.customSongAmount,
      category_7: userInfo.category1,
      category_8: userInfo.category2,
      category_9: userInfo.category3,
      category_10: userInfo.category4,
    }));
  }, [userInfo]);
  useEffect(() => {

    // Set the document title
    document.title = "Admin Dashboard";
    fetchData();
    // Clean up the effect
    return () => {
      // Reset the document title when the component unmounts
      document.title = "Dhun Jam";
    };
  }, []);

  return (
    initialLoading ? (
      <h1>Loading</h1 >
    ) : (
      <>
        <h1>{userInfo.name}, {userInfo.location} on Dhun Jam</h1>
        <form className="dashboard-form">

          <label className="questions">Do you want to charge your customers for requesting songs?</label>
          <div className="radio-input-div">
            <label className="radio-input-lable">
              <input
                type="radio"
                value="Yes"
                checked={userInfo?.chargeCustomers}
                onChange={handleChargeChange}
              />
              Yes
            </label>
            <label className="radio-input-lable">
              <input
                type="radio"
                value="No"
                checked={!userInfo?.chargeCustomers}
                onChange={handleChargeChange}
              />
              No
            </label>
          </div>


          <label className="questions">Custom song request amount-</label>
          <input
            className="custom-song-input"
            style={{ borderColor: userInfo.chargeCustomers ? "#ffffff" : "#C2C2C2" }}
            type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
            name="category_6"
            value={prices?.category_6 || ""}
            onChange={handleInputChange}
            readOnly={!userInfo?.chargeCustomers} // if userInfo.chargeCustomers is false the input will be read only
            required
          />

          <label className="questions">Regular song request amounts, from high to low-</label>
          <div className="text-input-div">
            <input
              className="regular-song-inputs"
              style={{ borderColor: userInfo?.chargeCustomers ? "#ffffff" : "#C2C2C2" }}
              type="text"
              name="category_7"
              value={prices?.category_7 || ""}
              onChange={handleInputChange}
              readOnly={!userInfo?.chargeCustomers} // if userInfo.chargeCustomers is false the input will be read only
              required
            />
            <input
              className="regular-song-inputs"
              style={{ borderColor: userInfo.chargeCustomers ? "#ffffff" : "#C2C2C2" }}
              type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
              name="category_8"
              value={prices?.category_8 || ""}
              onChange={handleInputChange}
              readOnly={!userInfo?.chargeCustomers} // if userInfo.chargeCustomers is false the input will be read only
              required />
            <input
              className="regular-song-inputs"
              style={{ borderColor: userInfo?.chargeCustomers ? "#ffffff" : "#C2C2C2" }}
              type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
              name="category_9"
              value={prices?.category_9 || ""}
              onChange={handleInputChange}
              readOnly={!userInfo?.chargeCustomers} // if userInfo.chargeCustomers is false the input will be read only
              required />
            <input
              className="regular-song-inputs"
              style={{ borderColor: userInfo.chargeCustomers ? "#ffffff" : "#C2C2C2" }}
              type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
              name="category_10"
              value={prices.category_10 || ""}
              onChange={handleInputChange}
              readOnly={!userInfo.chargeCustomers} // if userInfo.chargeCustomers is false the input will be read only
              required />
          </div>


        </form>
        {userInfo.chargeCustomers &&

          <BarChart
            data={[
              { name: "Custom", value: prices.category_6 },
              { name: "Category1", value: prices.category_7 },
              { name: "Category2", value: prices.category_8 },
              { name: "Category3", value: prices.category_9 },
              { name: "Category4", value: prices.category_10 },
            ]}
          />}
        <button
          style={{ backgroundColor: isValidInput ? "#6741d9" : "#C2C2C2" }}  // if isValidInput is true the button will be purple, otherwise it will be gray
          className="save-button"
          type="submit"
          disabled={!isValidInput} // if isValidInput is false the button will remain disabled
          onClick={handleSubmit}>
          Save
        </button>
      </>)

  )
}



