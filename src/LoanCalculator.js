import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './LoanCalculator.css'; // Import CSS file for styling

const LoanCalculator = () => {
  const [homeValue, setHomeValue] = useState(5000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(homeValue); // Initialize loan amount to home value
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    calculateLoan();
  }, [homeValue, downPayment, loanAmount, interestRate, loanTerm]);

  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const principal = loanAmount;
    const interest = parseFloat(totalInterest);
    const chartData = {
      labels: ['Principal', 'Interest'],
      datasets: [{
        label: 'Loan Breakdown',
        data: [principal, interest],
        backgroundColor: ['#36a2eb', '#ff6384']
      }]
    };

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'pie',
        data: chartData
      });
    } else {
      chartRef.current.data = chartData;
      chartRef.current.update();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [loanAmount, totalInterest]);

  const calculateLoan = () => {
    const totalLoanAmount = homeValue - downPayment;
    setLoanAmount(totalLoanAmount);
    const totalLoanMonths = loanTerm * 12;
    const interestPerMonth = interestRate / 100 / 12;
    const monthlyPayment = (totalLoanAmount * interestPerMonth * (1 + interestPerMonth) ** totalLoanMonths) / ((1 + interestPerMonth) ** totalLoanMonths - 1);
    const totalInterestGenerated = monthlyPayment * totalLoanMonths - totalLoanAmount;

    setMonthlyPayment(monthlyPayment.toFixed(2));
    setTotalInterest(totalInterestGenerated.toFixed(2));
  };

  const handleHomeValueChange = (value) => {
    setHomeValue(value);
    const newLoanAmount = value - downPayment;
    setLoanAmount(newLoanAmount);
  };

  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    const newLoanAmount = homeValue - value;
    setLoanAmount(newLoanAmount);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value);
  };

  const handleLoanTermChange = (value) => {
    setLoanTerm(value);
  };

  return (
    <div className="loan-calculator-container">
      <div className="input-group">
        <div className="input">
          <label>Home Value: </label>
          <input type="range" min={1000} max={10000} step={100} value={homeValue} onChange={(e) => handleHomeValueChange(parseInt(e.target.value))} />
          <span>${homeValue}</span>
        </div>
        <div className="input">
          <label>Down Payment: </label>
          <input type="range" min={0} max={homeValue} step={100} value={downPayment} onChange={(e) => handleDownPaymentChange(parseInt(e.target.value))} />
          <span>${downPayment}</span>
        </div>
        <div className="input">
          <label>Loan Amount: </label>
          <input type="range" min={0} max={homeValue} step={100} value={loanAmount} onChange={(e) => setLoanAmount(parseInt(e.target.value))} />
          <span>${loanAmount}</span>
        </div>
        <div className="input">
          <label>Interest Rate (%): </label>
          <input type="range" min={2} max={18} step={0.1} value={interestRate} onChange={(e) => handleInterestRateChange(parseFloat(e.target.value))} />
          <span>{interestRate}%</span>
        </div>
        <div className="input">
          <label>Loan Term (years): </label>
          <input type="range" min={5} max={25} step={5} value={loanTerm} onChange={(e) => handleLoanTermChange(parseInt(e.target.value))} />
          <span>{loanTerm} years</span>
        </div>
      </div>
      <div className="results">
        <h3>Results:</h3>
        <p>Monthly Payment: ${monthlyPayment}</p>
        <p>Total Interest: ${totalInterest}</p>
      </div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default LoanCalculator;
