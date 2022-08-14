import React from 'react';
import {connect} from "react-redux";
import { Query, Field } from '@tilework/opus';
import eCommerceApi from "../api/eCommerce";
import { addProductToCart } from "../actions/cart";
import ImageGallery from 'react-image-gallery';
import ProductPrice from "../components/product/price"
import "react-image-gallery/styles/css/image-gallery.css";
import DOMPurify from "dompurify";
import withParams from '../components/utils/withParams';

class ProductDetailsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      product: {},
      productToBefetched: '',
      selectedAttributes: []
    }

    this.addToCartAction = this.addToCartAction.bind(this);
  }

  fetchProductData = async (productId) => {
    try {
      const productFields = ['id', 'name', 'gallery', 'inStock', 'description', 'brand'];
      const priceFields = ['amount'];
      const currencyFields = ['label'];
      const attributesFields = ['id', 'name', 'type']
      const attributesItemFields = ['displayValue', 'id', 'value']

      const productQuery = new Query('product')
          .addArgument('id', 'String!', productId)
          .addFieldList(productFields)
          .addField(new Field('prices', true)
                        .addFieldList(priceFields)
                        .addField(new Field('currency', true)
                            .addFieldList(currencyFields)
                        )
                    )
          .addField(new Field('attributes', true)
                    .addFieldList(attributesFields)
                    .addField(new Field('items', true)
                        .addFieldList(attributesItemFields)
                    )
                )

      const response = await eCommerceApi.post(productQuery);
      
      this.setState({
        product: 'product' in response ? response.product : false,
        productToBefetched: ''
      });


    } catch (e) {
      console.log(e)

      this.setState({
        product: false
      });
    }
  }

  componentDidUpdate = () => {    
    this.triggerProductFetch()
  }

  componentDidMount = () => {
    this.triggerProductFetch()
  }

  triggerProductFetch = () => {
    const { productToBefetched, product } = this.state
    const { productId } = this.props.params

    if(!productToBefetched && !('id' in product)) {
      this.setState({
        productToBefetched: productId
      });
      this.fetchProductData(productId)
    }
  }

  normalizeImageGallery = images => {
    return images.map(image => {
      return {
        original: image,
        thumbnail: image
      }
    })
  }

  renderProductAttributes = attributes => {
    return attributes.map( attribute => {
      const {id, name, type, items} = attribute
      return (
        <div key={id} className="attribute">
          <p className='title'>{name}</p>
          <div className='product-attribute-options'>
            <ul className='options-list'>
              {this.renderProductAttributeItems(items, id, type)}
            </ul>
          </div>
        </div>
      )
    })
  }

  renderProductAttributeItems = (items, attributeId, type) => {
    return items.map( item => {
      const {displayValue, value, id} = item
      return (
        <li key={id} className="option">
          <input onChange={this.onRequiredAttributeChange} required type='radio' value={value} name={attributeId} id={`${attributeId}-${value}`}/>
          {type === 'swatch' ? (
            <label className='swatch-label' htmlFor={`${attributeId}-${value}`}>
              <span className='color-swatch' style={{backgroundColor: value}}></span>
            </label>
          ) : (
            <label className='text-label' htmlFor={`${attributeId}-${value}`}>{displayValue}</label>
          )}
        </li>
      )
    })
  }

  onRequiredAttributeChange = e => {
    const { target } = e
    let { selectedAttributes } = this.state

    const changedAttributeIndex = selectedAttributes.findIndex(attribute => attribute.id === target.name);
    if (changedAttributeIndex > -1) selectedAttributes[changedAttributeIndex] = {...selectedAttributes[changedAttributeIndex], value: target.value}
    else selectedAttributes = [...selectedAttributes, { id: target.name, value: target.value}]


    this.setState({
      selectedAttributes
    })
  }

  validateRequiredAttributes = () => {
    const {product, selectedAttributes} = this.state
    const productAttributes = 'attributes' in product ? product.attributes : false

    if(productAttributes) {
      const attributesStatuses =  productAttributes.map(attribute => {
        const isSelected = selectedAttributes.find(selectedAttribute => {
          return selectedAttribute.id === attribute.id
        })
        
        return { id: attribute.id, selected: isSelected === undefined ? false : true }
      })



      return attributesStatuses.filter(attribute => {
        return attribute.selected === false
      })
    }

    return []
  }

  renderProductPrice = prices => {
    return <ProductPrice prices={prices} />
  }

  renderProduct = product => {
    const {name, gallery, inStock, description, brand, prices, attributes} = product
    const cleanDescription = DOMPurify.sanitize(description, {
      USE_PROFILES: { html: true },
    });

    return (
      <div className='pdp'>
        <div className='image-gallery'>
          <ImageGallery items={this.normalizeImageGallery(gallery)} showNav={false} showFullscreenButton={false} showPlayButton={false} thumbnailPosition="left" disableThumbnailScroll="true" />
        </div>
        <div className='product-details'>
          <h3 className='brand'>{brand}</h3>
          <h3 className='name'>{name}</h3>
          <div className='product-attributes'>
            {this.renderProductAttributes(attributes)}
          </div>
          <div className='price-container'>
            {this.renderProductPrice(prices)}
          </div>
          <div className='product-actions'>
            {this.renderAddtoCart(inStock)}
          </div>
          <div className='description' dangerouslySetInnerHTML={{ __html: cleanDescription }}></div>
        </div>
      </div>
    )
  }

  renderAddtoCart = stockStatus => {
    return (
      <div className='action to-cart'>
        <button className='btn' disabled={!stockStatus} onClick={this.addToCartAction} type="button"><span>{stockStatus ? 'Add to cart' : 'OUT OF STOCK'}</span></button>
      </div>
    )
  }

  addToCartAction() {
    const missingAttributes = this.validateRequiredAttributes()
    const { product } = this.state
    const { selectedAttributes } = this.state

    if(missingAttributes.length) {
      alert(`Please select options: ${missingAttributes.map(attribute => attribute.id).join(' , ')}`)
    } else {
      this.props.addProductToCart({
        product,
        selectedAttributes
      })
    }
  }

  render() { 
    const { product } = this.state

    if(product === false || product === null) {
      return <div>404 PAGE NOT FOUND...</div>
    } else if(product.id) {
      return this.renderProduct(product)
    } else {
      return <div>LOADING...</div>
    }
  }
}


function mapStateToProps(state) {
  return {}
} 


export default connect(mapStateToProps, {
  addProductToCart: addProductToCart
})(withParams(ProductDetailsPage));