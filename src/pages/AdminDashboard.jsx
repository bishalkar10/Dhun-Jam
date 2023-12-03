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
    amount: {
      category_6: userInfo.customSongAmount,
      category_7: userInfo.category1,
      category_8: userInfo.category2,
      category_9: userInfo.category3,
      category_10: userInfo.category4,
    }
  })

  async function fetchData() {
    try {
      console.log("API call happened");
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

      const response = await fetch(`https://stg.dhunjam.in/account/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(prices),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data)
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
      amount: {
        ...prevPrices.amount,
        [name]: newValue
      }
    }));
  };

  // whenever the prices state variable changes, the useEffect hook will run and check the validity of the inputs
  useEffect(() => {
    // Check the validity of the inputs 
    const isCustomSongAmountValid = prices.amount.category_6 >= 99;
    const isCategory1Valid = prices.amount.category_7 >= 79;
    const isCategory2Valid = prices.amount.category_8 >= 59;
    const isCategory3Valid = prices.amount.category_9 >= 39;
    const isCategory4Valid = prices.amount.category_10 >= 19;

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
      amount: {
        category_6: userInfo.customSongAmount,
        category_7: userInfo.category1,
        category_8: userInfo.category2,
        category_9: userInfo.category3,
        category_10: userInfo.category4,
      }
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
                checked={userInfo.chargeCustomers}
                onChange={handleChargeChange}
              />
              Yes
            </label>
            <label className="radio-input-lable">
              <input
                type="radio"
                value="No"
                checked={!userInfo.chargeCustomers}
                onChange={handleChargeChange}
              />
              No
            </label>
          </div>

          {userInfo.chargeCustomers && (
            <>
              <label className="questions">Custom song request amount-</label>
              <input
                className="custom-song-input"
                type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
                name="category_6"
                value={prices.amount.category_6}
                onChange={handleInputChange}
                required
              />

              <label className="questions">Regular song request amounts, from high to low-</label>
              <div className="text-input-div">
                <input
                  className="regular-song-inputs"
                  type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
                  name="category_7"
                  value={prices.amount.category_7}
                  onChange={handleInputChange}
                  required />
                <input
                  className="regular-song-inputs"
                  type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
                  name="category_8"
                  value={prices.amount.category_8}
                  onChange={handleInputChange}
                  required />
                <input
                  className="regular-song-inputs"
                  type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
                  name="category_9"
                  value={prices.amount.category_9}
                  onChange={handleInputChange}
                  required />
                <input
                  className="regular-song-inputs"
                  type="text" // ! This field is meant to accept numbers only but we don't get the expected results with type="number" 
                  name="category_10"
                  value={prices.amount.category_10}
                  onChange={handleInputChange}
                  required />
              </div>
            </>
          )}

        </form>
        {userInfo.chargeCustomers &&
          <>
            <BarChart
              data={[
                { name: "Custom", value: prices.amount.category_6 },
                { name: "Category1", value: prices.amount.category_7 },
                { name: "Category2", value: prices.amount.category_8 },
                { name: "Category3", value: prices.amount.category_9 },
                { name: "Category4", value: prices.amount.category_10 },
              ]}
            />
            <button
              className="save-button"
              type="submit"
              disabled={!isValidInput} // if isValidInput is false the button will remain disabled
              onClick={handleSubmit}>
              Save
            </button>
          </>
        }


      </>)

  )
}



