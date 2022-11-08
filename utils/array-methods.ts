class ArrayMethods {
    // Ref: https://stackoverflow.com/questions/4011629/swapping-two-items-in-a-javascript-array
    swapArrayValues(array: Array<any>, indexA: number, indexB: number) {
        array[indexA] = array.splice(indexB, 1, array[indexA])[0];
        return array;
    }

    getRandomIndex(array: Array<any>) {
        return Math.floor(Math.random() * array.length);
    }

    // Ref: https://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index-javascript
    insertItem(array: Array<any>, index: number, item: any) {
        array.splice(index, 0, item);
        return array;
    }

    // Ref: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
    getUnique(array: Array<any>, key: string) {
        return [...new Map(array.map((item) => [item[key], item])).values()];
    }
}

export default new ArrayMethods();
