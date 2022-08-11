import React from 'react';
import {connect} from "react-redux";

class ProductPrice extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { 
          currentCurrency: ''
        }
    }

    render() {
            const { prices } = this.props
            const { symbol, label } = this.props.currentCurrency

            const renderPriceIndex = prices.findIndex(price => price.currency.label === label)
            const { amount } = prices[renderPriceIndex]

            return (
                <div className='price'>
                    <span className='symbol'>{symbol}</span>
                    <span className='value'>{amount}</span>
                </div>
            )
    }
}

function mapStateToProps(state) {
    return {
        currentCurrency: state.currentCurrency
    }
} 
  
  
export default connect(mapStateToProps)(ProductPrice);