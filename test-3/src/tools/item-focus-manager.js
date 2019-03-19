
const getTabDisposition = (itemId) => {
    const allItems = Array
        .from(document.getElementsByClassName('input'))
        .map(item => item.id);

    const index = allItems.findIndex(id => id === 'item-' + itemId);

    return [allItems, index];
}

export default {

    getTabDisposition: (id) => getTabDisposition(id),

    focusTo: (id, toIndex) => {

        const [allItems] = getTabDisposition(id);

        document.getElementById(allItems[toIndex]).focus()
    },
    focusUp: (id, position) => {

        const [allItems, index] = getTabDisposition(id);

        if (index > 0) {
            const node = document.getElementById(allItems[index - 1]);
            node.focus()
            node.setSelectionRange(position, position)
        }
    },
    focusDown: (id, position) => {

        const [allItems, index] = getTabDisposition(id);

        if (index < allItems.length - 1) {
            const node = document.getElementById(allItems[index + 1]);
            node.focus()
            node.setSelectionRange(position, position)
        }
    }
}