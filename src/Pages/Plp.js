import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ProductPrice from "../components/product/price"
import { Query, Field } from '@tilework/opus';
import eCommerceApi from "../api/eCommerce";
import {connect} from "react-redux";
import withParams from '../components/utils/withParams';
import { addProductToCart } from "../actions/cart";

class ProductListingPage extends Component {

  constructor(props) {
    super(props);

    this.state = { category: {}}
  }

  componentDidMount = () => {
    const { categoryName } = this.props.params

    if(categoryName) {
      this.fetchCategoryProducts(categoryName)
    }
  }

  componentDidUpdate = () => {
    const { categoryName } = this.props.params
    const currentCategory = this.state.category


    if(categoryName && currentCategory.name && currentCategory.name !== categoryName) {
      this.fetchCategoryProducts(categoryName)
    }

  }

  fetchCategoryProducts = async category => {

      try {
        const categoryFields = ['name'];
        const productFields = ['id', 'name', 'brand', 'gallery', 'inStock'];
        const priceFields = ['amount'];
        const currencyFields = ['label'];
        const attributesFields = ['id', 'name', 'type']
        const attributesItemFields = ['displayValue', 'id', 'value']

        const categoryQuery = new Query('category', true)
            .addArgument('input', 'CategoryInput', { title: category})
            .addFieldList(categoryFields)
            .addField(new Field('products', true)
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
              ))

          
            

        const response = await eCommerceApi.post(categoryQuery);

        this.setState({
          category: 'category' in response ? response.category : false
        });
                
    } catch (e) {
        console.log(e)
    }
  }

  renderPlpPage = (categoryData) => {
    const {name, products} = categoryData

    return (
      <div className='plp'>
        <div className='category-name'>
          <h2>{name}</h2>
        </div>

        <div className='product-grid-container'>
          {this.renderProductGrid(name, products)}
        </div>

      </div>
    );
  }

  renderAddtoCartButton = (inStock, product) => {
    if (inStock) {
      return (
        <div className='action'>
          <button className='btn to-cart' onClick={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); this.addToCartAction(product) }} type="button"><span className='icon'></span></button>
        </div>
      )
    }
  }

  addToCartAction(product) {
    const { attributes } = product
    let selectedAttributes = []

    for (const attribute of attributes) {
      if(attribute.items.length) {
        selectedAttributes = [...selectedAttributes, { id: attribute.name, value: attribute.items[0].value}]
      }
    }

    this.props.addProductToCart({
      product,
      selectedAttributes
    })
  }

  renderProductGrid = (categoryName, products) => {
    return (
      <div className='product-grid'>
          {products.map( product => {
              const {id, inStock, name, brand, gallery, prices} = product
              return (
                <div key={id} className="product-grid-item">
                  <Link to={`/${categoryName}/${id}`}>
                    <div className='image-container'>
                      
                        <img src={gallery[0]} alt={name}/>
                    </div>
                    <div className='product-details'>  
                      <p className='product-name'>
                        {`${brand} ${name}`}
                      </p>
                      <div className='product-prices'>
                        <ProductPrice prices={prices} />
                      </div>
                    </div>
                    <div className={`out-of-stock-mask ${inStock ? '' : 'visible'}`}>
                      <label className='message'>OUT OF STOCK</label>
                    </div>
                  </Link>
                  {this.renderAddtoCartButton(inStock, product)}
                </div>
              )
          })}
      </div>
    )
  }

  normalizeProductPath = (path) => {
    return path.replace(/\s/g, '-').toLowerCase();
  }

  render() {
    const { categoryName } = this.props.params
    const { category } = this.state

    if( categoryName && category && 'products' in category) {
        return this.renderPlpPage(category)
    }
    
    return <div>404 PAGE NOT FOUND...</div>
  }  
}
  
function mapStateToProps(state) {
    return {}
}


export default connect(mapStateToProps, {
  addProductToCart: addProductToCart
})(withParams(ProductListingPage));