import React, {Component, Suspense} from 'react';
import {Routes, Route, Link} from "react-router-dom";
import {connect} from "react-redux";
import ProductListingPage from "./Pages/Plp";
import ProductDetailsPage from "./Pages/Pdp";
import CartPage from "./Pages/Cart";
import './App.css';
import { fetchCategories } from "./actions/catalog";
import CurrencySwitcher from './components/global/currencySwitcher';
import MiniCart from './components/global/minicart';
import withNavigation from './components/utils/withNavigation';


class App extends Component {

    state = {
        categories: []
    };

    constructor(props) {
      super(props);  

      this.state = { categories: []}
    }

    componentDidMount() {
        this.props.fetchCategories()
    }

    componentDidUpdate() {
        const { categories, navigate } = this.props
        const { pathname } = window.location

        if(pathname === '/') {
            navigate(`/${categories[0].name}`);
        }
    }


    renderNavigationItems = () => {
        const { categories } = this.props
        const { pathname } = window.location        

        return (
            <nav>
                {categories.map( ({name}) => {
                    let isActive = pathname.includes('/' + name + '/') || pathname === '/' + name ? 'active' : ''
                    return (
                        <div key={name} className={`nav-item ${isActive}`}>
                            <Link to={`/${this.normalizeCategoryPath(name)}`}>{name}</Link>
                        </div>
                    )
                })}
            </nav>
        )
    }

    normalizeCategoryPath = (path) => {
        return path.replace(/\s/g, '-').toLowerCase();
    }
    

    render() {
      return (
        <Suspense fallback="loading">
            <div className="app-container">
                        <header>
                            <div className="main-nav">
                                {this.renderNavigationItems()}
                                <MiniCart/>
                                <CurrencySwitcher/>
                            </div>
                        </header>
                        <main className="main-container">
                            <Routes>
                                <Route path="/">
                                    <Route path=":categoryName" element={<ProductListingPage/>}/>
                                </Route>
                                <Route path=":categoryName">
                                    <Route path=":productId" index element={<ProductDetailsPage/>}/>
                                </Route>
                                <Route path="cart" index element={<CartPage/>}/>
                            </Routes>
                        </main>
                        <footer>
                            <div className="copyright">
                                <p>Copyright © 2022 Maksims Kornejevs. All Rights Reserved</p>
                            </div>
                        </footer>
            </div>
        </Suspense>
      )
    }
  }


function mapStateToProps(state) {
    return {
        categories: state.catalog.categories
    }
}

export default connect(mapStateToProps, {
    fetchCategories: fetchCategories,
})(withNavigation(App));

