import React, { Component } from 'react';
import PropTypes from "prop-types";

import focusManager from '../tools/item-focus-manager';

import style from './Item.module.scss';


class Item extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.item.content
        }

        this.savedValue = props.item.content;
    }

    onChange = e => {
        this.setState({
            value: e.target.value
        });
    }

    onKeyDown = e => {

        const { listContainer, parentId, item } = this.props;

        switch (e.key) {
            case 'Backspace':

                const [allItems, index] = focusManager.getTabDisposition(item.id);


                if (e.target.value === '') {

                    listContainer.deleteListItem(parentId, item.id)
                        .then(() => {
                            focusManager.focusTo(this.props.item.id, index > 0 ? index - 1 : 0);
                        })

                    e.preventDefault();

                }  /*else if (e.target.selectionStart === 0 && index > 0) {

                    const value = this.state.value;

                    console.log(value, allItems, index)

                    // listContainer.deleteListItem(
                    //     this.props.parentId,
                    //     this.props.item.id
                    // ).then(() => {

                    //     // listContainer.updateContent()

                    //     this.focusTo(index - 1);
                    // })

                    // listContainer.updateContent()

                    // )

                    e.preventDefault();
                }*/

                break;

            case 'Tab':

                this.saveContent()

                if (e.shiftKey) {
                    this.props.deindentById(item.id)
                } else {
                    this.props.indentById(item.id)
                }

                e.preventDefault();

                break;

            default: break;
        }
    }

    onKeyUp = (e) => {

        switch (e.key) {
            case 'ArrowUp':
                focusManager.focusUp(this.props.item.id, e.target.selectionStart);
                break;

            case 'ArrowDown':
                focusManager.focusDown(this.props.item.id, e.target.selectionStart);
                break;
            default: break;
        }
    }

    onKeyPress = e => {

        if (e.key === 'Enter') {

            const { listContainer, parentId, item } = this.props;

            e.preventDefault();

            // if value changed — save it
            this.saveContent();

            const { selectionStart, value } = e.target;

            // if the caret is at the end — insert after
            if (selectionStart === value.length) {

                listContainer.insertListItem(parentId, item.id, false)
                    .then((r) => {
                        document.getElementById('item-' + r.id).focus()
                    })

            } else if (selectionStart === 0) {

                // if the caret is at the beginning — insert before
                listContainer.insertListItem(parentId, item.id, true)
                    .then((r) => {
                        document.getElementById('item-' + r.id).focus()
                    })

            } else {

                const firstPart = value.slice(0, selectionStart);
                const secondPart = value.slice(e.target.selectionEnd);

                // split current list item in two
                listContainer.insertListItem(parentId, item.id, false, secondPart)
                    .then(newItem => {
                        const node = document.getElementById('item-' + newItem.id);

                        node.focus();
                        node.setSelectionRange(0, 0);
                    })

                this.setState(state => ({
                    value: firstPart
                }))
            }
        }

    }

    saveContent = () => {

        const { state, props } = this;

        if (this.savedValue !== state.value) {
            props.listContainer.updateContent(props.item.id, state.value)

            this.savedValue = state.value;
        }
    }

    render() {
        return (
            <div className={style.item}>
                <input
                    className={'input ' + style.input}
                    id={'item-' + this.props.item.id}
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                    onKeyPress={this.onKeyPress}
                    onBlur={this.saveContent}
                />
            </div>
        );
    }
}

Item.propTypes = {
    item: PropTypes.object
};

export default Item;