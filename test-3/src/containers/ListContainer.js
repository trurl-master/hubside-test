import { Container } from 'unstated';


class ListContainer extends Container {

    constructor(props) {
        super(props);

        const savedData = this.loadFromLocalStorage();

        if (savedData) {
            this.state = JSON.parse(savedData)
        } else {
            this.state = {
                items: [
                    { id: 0, content: "First Master List", items: [1,2,4,5], master: true },
                    { id: 1, content: "You can add list items", items: [], master: true },
                    { id: 2, content: "Delete them", items: [3], master: true },
                    { id: 3, content: "Indent them", items: [], master: true },
                    { id: 4, content: "Deindent them", items: [], master: true },
                    { id: 5, content: "Split them in the middle", items: [], master: true }
                ],
                latestId: 6
            }
        }
    }

    loadFromLocalStorage = () => {
        return localStorage.getItem('listContainer');
    }

    saveToLocalStorage = () => {
        localStorage.setItem('listContainer', JSON.stringify(this.state));
    }

    getItemsById = (ids, items) => {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        if (typeof items === 'undefined') {
            items = this.state.items;
        }

        return ids.map(id => items.find(item => item.id === id));
    }

    getItemById = (id, items) => {
        return this.getItemsById(id, items)[0];
    }

    getMasterLists = () => {
        return this.state.items.filter(item => (item.master))
    }

    clearList = (parentId) => {
        this.setState(state => {

            const newItems = [...state.items];

            const recursiveDelete = (delItem) => {

                const items = this.getItemsById(delItem.items, newItems);

                items.forEach(recursiveDelete)

                newItems.splice(
                    newItems.findIndex(item => item.id === delItem.id),
                    1
                );
            }

            const parent = this.getItemById(parentId, newItems)

            this.getItemsById(parent.items, newItems).forEach(recursiveDelete);

            parent.items = [];

            return {
                items: newItems
            };
        }).then(() => {
            this.saveToLocalStorage()
        })
    }

    createListItem = async (parentId, index, content) => {

        let newItem;

        await this.setState(state => {
            
            newItem = {
                id: state.latestId++,
                content: typeof content !== 'undefined' ? content : '',
                items: [],
                master: typeof parentId !== 'undefined' ? false : true
            };

            const newItems = [...state.items, newItem];

            if (typeof parentId !== 'undefined') {
                const parent = this.getItemById(parentId, newItems)

                if (typeof index === 'undefined' || index === false) {
                    parent.items.push(newItem.id)    
                } else {
                    parent.items.splice(index, 0, newItem.id);
                }
            }

            return {
                items: newItems
            };
        })

        this.saveToLocalStorage();

        return newItem;
    }

    deleteListItemsFromParent = (parentId, itemIds) => {

        if (!Array.isArray(itemIds)) {
            itemIds = [itemIds];
        }

        return this.setState(state => {

            const newItems = [...state.items];

            const parent = this.getItemById(parentId, newItems);

            itemIds.forEach(itemId => {
                const index = parent.items.findIndex(id => itemId === id);

                parent.items.splice(index, 1)
            })

            return {
                items: newItems
            };
        }).then(() => {
            this.saveToLocalStorage()
        })

    }

    insertListItemsToParent = (parentId, itemIds, index) => {

        if (!Array.isArray(itemIds)) {
            itemIds = [itemIds];
        }

        return this.setState(state => {
            const newItems = [...state.items];

            const parent = this.getItemById(parentId, newItems);

            parent.items.splice(index, 0, ...itemIds)

            return {
                items: newItems
            };
        }).then(() => {
            this.saveToLocalStorage()
        })

    }

    appendListItemsToParent = (parentId, itemIds) => {

        if (!Array.isArray(itemIds)) {
            itemIds = [itemIds];
        }

        return this.setState(state => {

            const newItems = [...state.items];

            const parent = this.getItemById(parentId, newItems);

            parent.items = parent.items.concat(itemIds);

            return {
                items: newItems
            };
        }).then(() => {
            this.saveToLocalStorage()
        })

    }

    deleteListItem = (parentId, itemId) => {
        this.deleteListItemsFromParent(parentId, itemId);

        return this.setState(state => {

            const newItems = [...state.items];

            const recursiveDelete = (delItem) => {

                const items = this.getItemsById(delItem.items, newItems);

                items.forEach(recursiveDelete)
                
                newItems.splice(
                    newItems.findIndex(item => item.id === delItem.id),
                    1
                );
            }

            recursiveDelete(this.getItemById(itemId, newItems));

            return {
                items: newItems
            };
        }).then(() => {
            this.saveToLocalStorage()
        })
    }

    insertListItem = (parentId, itemId, before, content) => {

        const parent = this.getItemById(parentId);

        const index = parent.items.findIndex(id => itemId === id);

        return this.createListItem(parentId, index + (before ? 0 : 1), content);
    }

    indentListItem = async (item, oldParentId, newParentId) => {
        this.deleteListItemsFromParent(oldParentId, item.id);
        this.appendListItemsToParent(newParentId, item.id);
    }

    deindentListItem = async (item, restItems, oldParentId, newParentId, newIndex) => {
        if (restItems.length > 0) {
            const restIds = restItems.map(item => item.id);

            this.deleteListItemsFromParent(oldParentId, restIds.concat(item.id));
            this.insertListItemsToParent(newParentId, item.id, newIndex + 1);
            this.appendListItemsToParent(item.id, restIds);
        } else {
            this.deleteListItemsFromParent(oldParentId, item.id);
            this.insertListItemsToParent(newParentId, item.id, newIndex + 1);
        }
    }

    updateContent = (id, content) => {

        return this.setState(state => {

            const newItems = [...state.items];

            const item = this.getItemById(id, newItems);

            item.content = content;

            return {
                items: newItems
            }

        }).then(() => {
            this.saveToLocalStorage()
        })

    }
}

export default ListContainer;