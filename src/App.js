import React, { useState, useEffect, useCallback } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [chargeCustomers, setChargeCustomers] = useState(true);
  const [customAmount, setCustomAmount] = useState(99);
  const [regularAmounts, setRegularAmounts] = useState([79, 59, 39, 19]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const passwordInputType = passwordVisible ? 'text' : 'password';

  const handleLogin = async () => {
    try {
      const response = await fetch('https://stg.dhunjam.in/account/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'DJ@4',
          password: 'Dhunjam@2023',
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        setLoggedIn(true);
        setAdminId(data.data.id);
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAdminId(null);
    setAdminData(null);
  };

  const handleChargeCustomersChange = (e) => {
    setChargeCustomers(e.target.value === 'true');
  };

  const handleCustomAmountChange = (e) => {
    const amount = parseInt(e.target.value, 10);
    setCustomAmount(amount);
  };

  const handleRegularAmountChange = (index, e) => {
    const amount = parseInt(e.target.value, 10);
    const updatedAmounts = [...regularAmounts];
    updatedAmounts[index] = amount;
    setRegularAmounts(updatedAmounts);
  };
  const handleFetchAdminDetails = useCallback(async () => {
    try {
      const response = await fetch(`https://stg.dhunjam.in/account/admin/${adminId}`);
      const data = await response.json();
      if (data.status === 200) {
        setAdminData(data.data);
      } else {
        console.error('Failed to fetch admin details:', data);
      }
    } catch (error) {
      console.error('Fetch admin details error:', error);
    }
  }, [adminId]);

  const handlePriceUpdate = async () => {
    try {
      const response = await fetch(`https://stg.dhunjam.in/account/admin/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            category_6: customAmount,
          },
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        handleFetchAdminDetails();
      } else {
        console.error('Price update failed:', data);
      }
    } catch (error) {
      console.error('Price update error:', error);
    }
  };

  useEffect(() => {
    if (loggedIn && adminId) {
      handleFetchAdminDetails();
    }
  }, [loggedIn, adminId, handleFetchAdminDetails]);

  return (
    <div className="container">
      {loggedIn ? (
        <div>
          <h1>Social, Hebbal on Dhun Jam</h1>
          <div>
            <label>Do you want to charge your customers for requesting songs?</label>
              <label>
                <input
                  type="radio"
                  name="chargeCustomers"
                  value={true}
                  checked={chargeCustomers === true}
                  onChange={handleChargeCustomersChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="chargeCustomers"
                  value={false}
                  checked={chargeCustomers === false}
                  onChange={handleChargeCustomersChange}
                />
                No
              </label>

          </div>

          {chargeCustomers && (
            <div>
              <div className='gridtwo'>
                <label>Custom Song Request Amount-</label>
                <input
                  type="number"
                  className="form-control"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min={99}
                />
              </div>

              <div className="gridside">
                <label>Regular Song Request Amounts, from High to Low-</label>
                {regularAmounts.map((amount, index) => (
                  <input
                  key={index}
                  type="number"
                  className="form-control heightsmall"
                    value={amount}
                    onChange={(e) => handleRegularAmountChange(index, e)}
                    min={index === 0 ? 79 : 19}
                  />
                ))}
              </div>

              <div>
              <img src="graph.jpg" alt="Graph" className="graph-image" />
              </div>

              <button
                className="btn btn-primary"
                disabled={customAmount < 99 || regularAmounts.some((val, i) => val <= [79, 59, 39, 19][i])}
                onClick={handlePriceUpdate}
              >
                Save
              </button>
            </div>
          )}

          <button className="btn btn-info mt-3" onClick={handleFetchAdminDetails}>
            Fetch Admin Details
          </button>

          {adminData && (
            <div>
              <h2>Admin Details</h2>
              <p>Name: {adminData.name}</p>
              <p>Location: {adminData.location}</p>
            </div>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>

        </div>
      ) : (
        <div className="main__container">
          <h1>Venue Admin Login</h1>
          <form className="form__container" onSubmit={handleLogin}>
            <div className="form__input mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form__input mb-3">
              <div className={`password-input-container ${passwordVisible ? 'visible' : ''}`}>
                <input
                  type={passwordInputType}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                  onClick={handleTogglePasswordVisibility}
                />
              </div>
            </div>
            <div className="form__input">
              <button type="button" className="btn btn-success" onClick={handleLogin}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
