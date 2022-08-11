import React from 'react';
import {connect} from "react-redux";
import { Query } from '@tilework/opus';
import eCommerceApi from "../../api/eCommerce";
import { selectCurrentCurrency } from "../../actions/currency";


class CurrencySwitcher extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
          currencies: [],
          currentCurrency: {}
        }

        this.currencySwitcherRef = React.createRef();
    }


    componentDidMount() {
        this.fetchCurrencies()
        document.addEventListener("mousedown", this.handleClickOutside);

    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.currencySwitcherRef.current && 
            !this.currencySwitcherRef.current.contains(event.target) &&
            this.currencySwitcherRef.current.classList.contains('open')

        ) {
            this.toggleDropdown()
        }
      };


    fetchCurrencies = async () => {
        try {
          const currencyFields = ['label', 'symbol'];
    
          const currenciesQuery = new Query('currencies')
              .addFieldList(currencyFields)
    
          const response = await eCommerceApi.post(currenciesQuery);
          
          this.setState({
            currencies: response.currencies
          });
        } catch (e) {
          console.log(e)
        }
    }

    selectCurrency = (e, data) => {
        this.toggleDropdown()
        this.props.selectCurrentCurrency(data);
    }

    toggleDropdown = () => {
        this.currencySwitcherRef.current.classList.toggle('open');
    }

    renderCurrencyItems = () => {
        const { currentCurrency } = this.props

        return this.state.currencies.map( currency => {
            const { label, symbol } = currency
            if(currentCurrency !== label) {
                return (
                    <li className='currency' key={label} onClick={((e) => this.selectCurrency(e, { label, symbol }))}>
                        <span className='symbol'>{symbol}</span>
                        <span className='symbol'>{label}</span>
                    </li>
                )
            }
        })
    }

  render() {
    return (
        <div className='currency-switcher dropdown' ref={this.currencySwitcherRef}>
            <div className='dropdown-trigger-container' >
                <div className="trigger" onClick={this.toggleDropdown}> 
                    <span className='current-currency'>{this.props.currentCurrency.symbol}</span>
                </div>
            </div>
            <div className='dropdown-container' >
                <ul className='currencies-list'>
                    {this.renderCurrencyItems()}
                </ul>
            </div>
        </div>
    )
  }

}


function mapStateToProps(state) {
    return {
        currentCurrency: state.currentCurrency
    }
} 
  
  
export default connect(mapStateToProps, {
    selectCurrentCurrency: selectCurrentCurrency
})(CurrencySwitcher);