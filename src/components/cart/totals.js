import React from 'react';
import {connect} from "react-redux";


class CartTotals extends React.Component {

    constructor(props) {
      super(props);

      this.state = { 
        currentCurrency: ''
      }
    }

    renderMinimalTotal = (cartItems, currency, currencySymbol) => {
      let total = 0;

      for (const item of cartItems) {
        const { prices } = item.product
        const priceIndex = prices.findIndex(price => price.currency.label === currency)

        if(priceIndex >= 0) {
          const { amount } = prices[priceIndex]
          total += amount * item.qty
        }
      }
      

      return (
          <div className='total'>
            <span className='label'>Total:</span>
            <span className='value'>{`${total.toFixed(2)} ${currencySymbol}`}</span>
          </div>
      )
    }

    renderTotals = (cartItems, currency, currencySymbol) => {
      let totalQty = 0
      let total = 0

      for (const item of cartItems) {
        const { prices } = item.product
        const { qty } = item
        const priceIndex = prices.findIndex(price => price.currency.label === currency)

        if(priceIndex >= 0) {
          const { amount } = prices[priceIndex]
          
          total += amount * qty
        }

        totalQty += qty
      }
      

      return (
        <>
          <div className='total'>
            <span className='label'>Tax 21%:</span>
            <span className='value'>{`${(total * 0.21).toFixed(2)} ${currencySymbol}`}</span>
          </div>
          <div className='total'>
            <span className='label'>Qantity:</span>
            <span className='value'>{totalQty}</span>
          </div>
          <div className='total'>
            <span className='label'>Total:</span>
            <span className='value'>{`${total.toFixed(2)} ${currencySymbol}`}</span>
          </div>
        </> 
      )
    }

    render() { 
        const { minimal, cartItems } = this.props
        const { symbol, label } = this.props.currentCurrency

        return  (
          <div className='cart-totals'>
            { minimal ? 
                this.renderMinimalTotal(cartItems, label, symbol) :
                this.renderTotals(cartItems, label, symbol)
            }
          </div> 
        )
        
    }
}

function mapStateToProps(state) {
  return {
      currentCurrency: state.currentCurrency
  }
} 

export default connect(mapStateToProps)(CartTotals)