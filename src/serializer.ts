// Created by vndg-rdmt, 2023

import { RemoveListener, SerializerStorage } from "./types";

/**
 * Serilizer class, which can save, store and restore
 * html elements x and y coordinate across when document.
 * 
 * Serializer requires each element to be marked with
 * a unique id, so serialization meant to be safe,
 * due to the fact that this keys can have
 * semantic meaning and so be unique along
 * any moment of application lifetime.
 */
export class ElementsPositionSerializer {

    /**
     * @deprecated
     * 
     * - "Stays in code as a reminder to everyone,
     * who wants to use approuch with counter-marking
     * serialized elements"
     * 
     * Serialized elements counter. Used to get
     * element unique id for storage.
     * 
     * POC: Counter increments each time serializer is
     * used on element. When script is launched, all elements
     * is added to serializer and so they get their own ids, based
     * on order. So, every element get's its own unique id, just
     * from incrementing counter.
     * 
     * But! Order MUST always stay the same, this means that this
     * approuch is acceptable only for static UIs, where elements
     * count stays the same, and all elements which needed is passed
     * so serializer at the same time, which basically means harc-SPAs
     * without routing. But in this case gained performance becomes
     * useless, due to small amount of elements, needed to be serilised.
     */
    private elementsCounter: number = 0;
    
    /**
     * @param {string} id - serializer identifier to make it possible
     * ing elements id's semantics by just using different
     * serializer objects. Do not neglect of using empty strings,
     * especially when creating multiple instances of serializer,
     * it's possible and a valid way of usage, but can cause problems.
     * 
     * @param {SerializerStorage} storage - serializer storage, where it saves element
     * coordinates. Must implement {@link SerializerStorage}, to make
     * it possible use different sources like fetched data, json, calculated
     * values, and not only session or local storages. Read {@link SerializerStorage|js-docs} 
     * to learn about expected behavior and how to implement it itself properly.
     */
    public constructor(
        private readonly id: string,
        private readonly storage: SerializerStorage,
        ) { 
            this.serialize    = this.serialize.bind(this);
            this.deserialize  = this.deserialize.bind(this);
            this.saveOnReload = this.saveOnReload.bind(this);
        }

    /**
     * Used to make serializer standardizes its logic
     * by running same code in loop.
     */
    private readonly attrsMapping: ['left', 'top'] = ['left','top'];

    /**
     * Standardizes approach to retrive coordinate attribute key
     * 
     * @param i index in attrsMapping for coordinate id
     * @returns key for specified coordinate
     */
    private readonly coordinateKey = (i: number): string =>
        'elemserializer' + this.id + this.attrsMapping[i];

    /**
     * Saves element coordinates to storage.
     */
    public serialize(target: HTMLElement, key: string): void {
        for (let i = 0; i < this.attrsMapping.length; i++) {
            this.storage.setItem(
                this.coordinateKey(i) + key,
                target.style[this.attrsMapping[i]],
            );
        };
    }

    /**
     * Restores element coordinates from storage, returns
     * true, if two values were retrived and applied, false otherwise.
     */
    public deserialize(target: HTMLElement, key: string): boolean {
        for (let i = 0; i < this.attrsMapping.length; i++) {
            const coordinate = this.storage.getItem(this.coordinateKey(i) + key);
            if (coordinate !== null) {
                this.storage.removeItem(this.coordinateKey(i) + key);
                target.style[this.attrsMapping[i]] = coordinate;
            } else return false;
        };
        return true;
    }

    /**
     * Clears stored coordinated from storage for specified key.
     */
    public clearKey(key: string): void {
        for (let i = 0; i < this.attrsMapping.length; i++) {
            this.storage.removeItem(this.coordinateKey(i) + key);
        };
    }

    /**
     * Automatically serializes element before page unloads
     */
    public saveOnReload(target: HTMLElement, key: string): RemoveListener {
        const callback = () => this.serialize(target, key);
        window.addEventListener('beforeunload', callback);
        return () => {window.removeEventListener('beforeunload', callback)};
    }
}
