import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [autoFx, setAutoFx] = useState(1.1);
  const [manualFx, setManualFx] = useState(0);
  const [usdToEur, setUsdToEur] = useState(false);
  const [inputData, setInputData] = useState(0);
  const [pastData, setPastData] = useState([]);
  const invertedAutoFx = parseFloat((1 / autoFx).toFixed(2));
  const disableManual = !!manualFx && (manualFx < autoFx*0.8 || manualFx > autoFx * 1.2);
  const eurToUsdFx = ((!disableManual && manualFx) ? manualFx : autoFx);
  const usdToEurFx = parseFloat((1 / eurToUsdFx).toFixed(2));
  const finalFx = (!usdToEur) ? eurToUsdFx : usdToEurFx;

  useEffect(() => {
    setTimeout(() => {
      const delta = 0.95 + (Math.random() * 0.1);
      const newFx = parseFloat((autoFx * delta).toFixed(2));
      setAutoFx(newFx);
    }, 3000);
  }, [autoFx]);

  return (
    <div className='App container'>
      <div className='App-body py-md-4'>
        {(!usdToEur) ? (
          <div className='App-rate mb-2'>
            <b>EUR/USD fx:</b> ${autoFx}
          </div>
        ) : (
          <div className='App-rate mb-2'>
            <b>USD/EUR fx:</b> ${invertedAutoFx}
          </div>
        )}
        <div className='App-override mb-4'>
          <label htmlFor='manualFx' class='form-label'><b>Manual Override:</b></label>
          <div className='App-override-input'>
            <input
              type='number'
              class='form-control'
              id='manualFx' 
              placeholder='0.00'
              step='0.01'
              onChange={(e) => setManualFx(parseFloat(e.target.value))}
            />
            {disableManual && <p class='text-secondary'>Currently disabled</p>}
          </div>
        </div>
        {
          (!usdToEur) ? (
            <div className='App-convert my-2'>
              <input
                type='number'
                class='form-control'
                placeholder='0.00'
                step='0.1'
                onChange={(e) => setInputData(parseFloat(e.target.value))}
              /> <b>EUR</b>
              =
              <input
                type='number'
                class='form-control'
                placeholder='0.00'
                step='0.1'
                value={!!pastData.length && pastData[0].converted}
                readOnly
              /> <b>USD</b>
            </div>
          ) : (
            <div className='App-convert my-2'>
              <input
                type='number'
                className='form-control'
                placeholder='0.00'
                step='0.1'
                onChange={(e) => setInputData(parseFloat(e.target.value))}
              /> <b>USD</b>
              =
              <input
                type='number'
                className='form-control'
                placeholder='0.00'
                step='0.1'
                value={!!pastData.length && pastData[0].converted}
                readOnly
              /> <b>EUR</b>
            </div>
          )
        }
        <div className='App-buttons mb-4'>
          <button className='btn btn-primary' onClick={() => {
            setPastData([ {
              usdToEur: usdToEur,
              fx: finalFx,
              original: inputData,
              converted: inputData * finalFx,
            }, ...pastData.slice(0,4) ])
          }}>Submit</button>
          <button className='btn btn-outline-primary' onClick={() => {
            setUsdToEur(!usdToEur);
            setInputData(0);
          }}>Switch to {(!usdToEur) ? 'USD/EUR' : 'EUR/USD'}</button>
        </div>
        {
          ((!!pastData.length) && (
            <div className='App-data'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">Comparison</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Original</th>
                    <th scope="col">Converted</th>
                 </tr>
                </thead>
                <tbody>
                  {pastData.map(({ usdToEur, fx, original, converted }, i) => (
                    <tr key={i}>
                      <td>{(!usdToEur) ? 'EUR/USD' : 'USD/EUR'}</td>
                      <td>{fx}</td>
                      <td>{original}</td>
                      <td>{converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
