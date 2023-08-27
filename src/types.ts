// Created by vndg-rdmt, 2023

/**
 * Removes event listener for window unloading
 * events, for example when user reload page.
 * 
 * Syntactic sugar for `VoidFunction`.
 */
export type RemoveListener = () => void;


/**
 * Minimized {@link Storage} interface to configure,
 * where serializer stores saved values, so it's
 * valid not only to use session or local storages,
 * but also make them custom, so coordinates can
 * be fetched from backend, calculated and etc.
 * 
 * Retrived values for each key must stay the same,
 * as they were set. Linkage for key/value must stay
 * the same across all operations, if value were set
 * with a provided key - this key must always direct
 * to it until value was removed.
 */
export interface SerializerStorage {
    /**
     * Must store {@link value} within itself by specified {@link key}.
     * 
     * @param key unique identifier for element, under the hood
     * in serializer calculated from multiple values - static package
     * string, specified serializer object id value, 'left' / 'right'
     * string, which represents x / y, and item unique id within
     * serializer id scope. Must always direct to the same value
     * as it was set untill being removed.
     * 
     * @param value x / y coordinate value itself, on retrivement
     * must stay the same as passed by an argument.
     */
    setItem(key: string, value: string): void;
    /**
     * Must retrive value from itself by specified {@link key}.
     * 
     * @param key unique identifier for element, under the hood
     * in serializer calculated from multiple values - static package
     * string, specified serializer object id value, 'left' / 'right'
     * string, which represents x / y, and item unique id within
     * serializer id scope. Must always direct to the same value
     * as it was set untill being removed.
     * 
     * @returns `string`, if value exists, `null` - otherwise.
     * Return `null`, not void types, is important due to comparation performance
     * and realisation of browser client storages.
     */
    getItem(key: string): string | null;

    /**
     * Removes the key/value pair with the given key,
     * if a key/value pair exists.
     * 
     * @param key unique identifier for element, under the hood
     * in serializer calculated from multiple values - static package
     * string, specified serializer object id value, 'left' / 'right'
     * string, which represents x / y, and item unique id within
     * serializer id scope. Must always direct to the same value
     * as it was set untill being removed.
     */
    removeItem(key: string): void;
}

