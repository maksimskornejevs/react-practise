import React from 'react';
import {connect} from "react-redux";
import { updateProductQty } from "../../actions/cart";
import CartProductAttributes from '../cart/attributes';
import ProductPrice from "../product/price"
import CartTotals from "../cart/totals"
import {Link} from "react-router-dom";

class MiniCart extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
          items: []
        }

        this.miniCartContainerRef = React.createRef();
        this.miniCartMaskrRef = React.createRef();
    
        this.toggleMinicart = this.toggleMinicart.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.miniCartContainerRef.current && 
            !this.miniCartContainerRef.current.contains(event.target) &&
            this.miniCartContainerRef.current .classList.contains('open')

        ) {
            this.toggleMinicart()
        }
      };
    
    toggleMinicart() {
        this.miniCartContainerRef.current.classList.toggle('open');
    }

    renderCartItems () {
        const {items} = this.props

        return items.map( (item, index) => {
            const {selectedAttributes, qty} = item
            const {brand, name, prices, attributes, gallery} = item.product

            return (
                <div className='cart-list-item' key={index}>
                    <div className='details'>
                        <p className='brand'>{brand}</p>
                        <p className='name'>{name}</p>
                        {this.renderCartItemPrice(prices)}
                        {this.renderCartItemAttributes(attributes, selectedAttributes)}
                    </div>
                    <div className='qty-selector-container'>
                        {this.renderQtySelector(item, qty)}
                    </div>
                    <div className='image-container'>
                        {this.renderCartItemGallery(gallery, name)}
                    </div>
                </div>
            )
        })
    }

    renderCartItemPrice = prices => {
        return <ProductPrice prices={prices} />
    }

    renderCartItemAttributes = (attributes, selectedAttributes) => {
        return <CartProductAttributes attributes={attributes} selectedAttributes={selectedAttributes} />
    }

    renderCartItemGallery = (gallery, name) => {
        if(gallery.length) {
            return <img className='product-image' src={gallery[0]} alt={name}/>
        }

        return <div className='image-placeholder'></div>
    }

    renderQtySelector = (item, currentQty) => {
        return (
            <div className='qty-selector'>
                <button className='btn qty-increase-action' onClick={ () => this.props.updateProductQty(item, true) }>+</button>
                <span className='qty-in-cart'>{currentQty}</span>
                <button className='btn qty-down-action' onClick={ () => this.props.updateProductQty(item, false) } >-</button>
            </div>
        )
    }

    renderCartTotals = () => {
        const {items} = this.props
        return <CartTotals cartItems={items} minimal={true} />
    }

    getCartItemsTotalQty = () => {
        const {items} = this.props
        let totalQty = 0

        items.forEach(item => {
            totalQty += item.qty
        })

        return totalQty
    }

    render() {
        const cartTotalQty = this.getCartItemsTotalQty()

        return (
            <div className='minicart-container' ref={this.miniCartContainerRef}>
                <div className='dropdown-trigger-container' >
                    <div className="minicart-trigger" onClick={this.toggleMinicart}> 
                        <i className="cart-icon"></i>
                        <span className='cart-items-qty'>{cartTotalQty}</span>
                    </div>
                </div>
                <div className='dropdown-mask' onClick={this.toggleMinicart}></div>
                <div className='dropdown-container' >
                { cartTotalQty > 0 ? (
                    <div className='dropdown-content'>
                       
                            <div className='title'>
                                My bag,
                                <span>{cartTotalQty} items</span>
                            </div>
                            <div className='cart-items-list-container'>
                                <div className='cart-items-list'>
                                    {this.renderCartItems()}
                                </div>
                            </div>
                            <div className='totals-container'>
                                <div className='totals'>
                                    {this.renderCartTotals()}
                                </div>
                            </div>
                            <div className='minicart-actions'>
                                <Link to={`/cart`} onClick={this.toggleMinicart}>
                                    <div className='action to-cart'>
                                        <button className='btn'>Cart</button>
                                    </div>
                                </Link>
                                <div className='action checkout'>
                                    <button onClick={this.toggleMinicart} className='btn'>Checkout</button>
                                </div>
                            </div>
                    </div>
                     ) : 
                     (
                        <div className='dropdown-content'>
                         <div className='title'>
                             Empty bag 
                         </div>
                        </div>
                     )}
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        items: state.cart.items
    }
} 
  
  
export default connect(mapStateToProps, {
    updateProductQty: updateProductQty
})(MiniCart);
