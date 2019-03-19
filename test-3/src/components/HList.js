import React, { Component } from 'react';
import PropTypes from "prop-types";

import Item from './Item';

import style from './HList.module.scss';


class HList extends Component {

    componentDidMount() {
        this.createInitialItem()
    }

    componentDidUpdate() {
        this.createInitialItem()
    }

    createInitialItem = () => {
        const { parentItem, listContainer } = this.props;

        if (parentItem.items.length === 0) {
            listContainer.createListItem(parentItem.id);
        }
    }

    indentById = (itemId) => {
        const liNode = document.getElementById('li-' + itemId);
        liNode.getElementsByClassName('indent')[0].click()
    }

    deindentById = (itemId) => {
        const liNode = document.getElementById('li-' + itemId);
        liNode.getElementsByClassName('deindent')[0].click()
    }

    clickDeindentItem = (items, item, parentId, itemIndex, ancestors) => {
        const restItems = items.filter((_, index) => index > itemIndex);

        this.props.listContainer.deindentListItem(
            item,
            restItems,
            parentId,
            ancestors[ancestors.length - 2].itemId,
            ancestors[ancestors.length - 1].itemIndex,
        ).then(() => {
            document.getElementById('item-' + item.id).focus()
        })
    }

    clickIndentItem = (items, item, parentId, itemIndex) => {
        this.props.listContainer.indentListItem(
            item,
            parentId,
            items[itemIndex - 1].id
        ).then(() => {
            document.getElementById('item-' + item.id).focus()
        })
    }

    renderItems = (itemIds, ancestors) => {

        const { listContainer } = this.props;

        const items = itemIds.map(id => listContainer.state.items.find(item => item.id === id));

        const parentId = ancestors[ancestors.length - 1].itemId;
        const parentIndex = ancestors[ancestors.length - 1].itemIndex;
        
        return (
            <ul className={style.hlist}>
                {items.map((item, itemIndex) => (
                    <li id={'li-' + item.id} key={item.id} className={style.li}>
                        <div className={style.controls}>
                            <button
                                className={'deindent ' + style['deindent-button']}
                                disabled={typeof parentIndex === 'undefined'}
                                onClick={() => {
                                    this.clickDeindentItem(items, item, parentId, itemIndex, ancestors)
                                }}
                                tabIndex={-1}
                            >{'◃'}</button>
                            <button
                                className={'indent ' + style['indent-button']}
                                disabled={itemIndex === 0}
                                onClick={() => {
                                    this.clickIndentItem(items, item, parentId, itemIndex);
                                }}
                                tabIndex={-1}
                            >{'▹'}</button>
                        </div>
                        <Item
                            listContainer={listContainer}
                            parentId={parentId}
                            item={item}
                            indentById={this.indentById}
                            deindentById={this.deindentById}
                        />
                        {item.items.length > 0 &&
                            this.renderItems(item.items, [...ancestors, { itemId: item.id, itemIndex }])
                        }
                    </li>
                ))}
            </ul>
        );
    }    

    render() {
        const { parentItem } = this.props;

        return this.renderItems(
            parentItem.items,
            [{ itemId: parentItem.id }]
        );
    }
}

HList.propTypes = {
    parentItem: PropTypes.object,
    listContainer: PropTypes.object
}

export default HList;