import React from 'react';
import {connect} from "react-redux";
import { updateProductQty } from "../actions/cart";
import CartProductAttributes from '../components/cart/attributes';
import ProductPrice from "../components/product/price"
import CartTotals from "../components/cart/totals"
import ImageGallery from 'react-image-gallery';


class Cart extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
          items: []
        }
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

    renderCartItemGallery = (gallery) => {
        if(gallery.length) {
            return (
              <div className='image-gallery'>
                <ImageGallery items={gallery.map(image => { return {original: image, thumbnail: image}})}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  disableThumbnailScroll="true" />
              </div>
            )
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
        return <CartTotals cartItems={items} minimal={false} />
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
            <div className='cart' ref={this.miniCartContainerRef}>
                { cartTotalQty > 0 ? (
                      <div className='page-content'>
                          <div className='page-title'>
                              Cart
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
                              <div className='action checkout'>
                                  <button className='btn'>ORDER</button>
                              </div>
                          </div>
                      </div>
                     ) : 
                     (
                        <div className='page-content'>
                            <div className='page-title'>
                                Empty bag 
                            </div>
                        </div>
                     )}
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
})(Cart);
