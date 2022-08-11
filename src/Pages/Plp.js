import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ProductPrice from "../components/product/price"
import { Query, Field } from '@tilework/opus';
import eCommerceApi from "../api/eCommerce";
import {connect} from "react-redux";
import withParams from '../components/utils/withParams';

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
        const productFields = ['id', 'name', 'gallery', 'inStock'];
        const priceFields = ['amount'];
        const currencyFields = ['label'];

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
            )

          
            

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

  renderProductGrid = (categoryName, products) => {
    return (
      <div className='product-grid'>
          {products.map( ({id, inStock, name, gallery, prices}) => {
              return (
                <div key={id} className="product-grid-item">
                  <Link to={`/${categoryName}/${id}`}>
                    <div className='image-container'>
                      
                        <img src={gallery[0]} alt={name}/>
                    </div>
                    <div className='product-details'>
                      
                      <p className='product-name'>
                        {name}
                      </p>
                      <div className='product-prices'>
                        <ProductPrice prices={prices} />
                      </div>
                    </div>
                    <div className={`out-of-stock-mask ${inStock ? '' : 'visible'}`}>
                      <label className='message'>OUT OF STOCK</label>
                    </div>
                  </Link>
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


export default connect(mapStateToProps)(withParams(ProductListingPage));