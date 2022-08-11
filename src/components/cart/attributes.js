import React from 'react';

class CartProductAttributes extends React.Component {

    renderProductAttributes = () => {
      const { attributes } = this.props

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
              {type === 'swatch' ? (
                <label className={`swatch-label ${this.getAttributeItemStatus(attributeId, value)}`}>
                  <span className={"color-swatch"} style={{backgroundColor: value}}></span>
                </label>
              ) : (
                <label className={`text-label ${this.getAttributeItemStatus(attributeId, value)}`} htmlFor={`${attributeId}-${value}`}>{displayValue}</label>
              )}
            </li>
          )
        })
      }

      getAttributeItemStatus = (attributeId, value) => {
        const { selectedAttributes } = this.props
        let isSelected = false

        selectedAttributes.some(selectedAttribute => {
          if(selectedAttribute.id === attributeId && selectedAttribute.value === value) {
            isSelected = true
            return false
          }
        })

        return isSelected ? 'selected' : ''
      }

    render() { 
        return (
            <div className='product-attributes'>
                {this.renderProductAttributes()}
            </div>
        )
    }
}

export default CartProductAttributes