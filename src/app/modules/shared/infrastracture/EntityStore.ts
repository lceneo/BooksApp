import {computed, signal, WritableSignal} from "@angular/core";
import {IEntityState} from "./IEntityState";

export abstract class EntityStore<T extends {ID: number}> {
  protected constructor(
    private initialData: T[],
    private localStorageKey?: string) {
    this.initData();
    window.addEventListener('beforeunload', ev => {
      if (this.localStorageKey) { localStorage.setItem(this.localStorageKey, JSON.stringify(this.getEntities()))}
    });
  }

  protected entityState: WritableSignal<IEntityState<T>> = signal({
    entities: [],
    loaded: false
  });

  addEntity(newEntity: Omit<T, 'ID'>) {
    const lastID = Math.max(...this.entityState().entities
      .map(entity => entity.ID));
    const newID = isFinite(lastID) ? lastID + 1 : 1;
    const newItem = {ID: newID, ...newEntity} as T;

    this.entityState.update(state =>
      (
        {...state,
          entities: [...this.entityState().entities, newItem]}))
  }

  updateEntity(entityID: number, updatedState: Partial<T>) {
    const entityCurrentState = this.getEntityByID(entityID);
    if (!entityCurrentState) { return; }
    const newEntityState = Object.assign(entityCurrentState, updatedState);
    this.entityState.update(state => ({
      ...state,
      entities: [...state.entities]
    }));
    return newEntityState;
  }
  getEntityByID(entityID: number) {
    return this.entityState().entities
      .find(entity => entity.ID === entityID);
  }

  getEntities() {
    return this.entityState().entities;
  }

  getEntitiesAsync() {
    return computed(() => this.entityState().entities);
  }

  clearStore() {
    this.entityState.update(state => ({...state, entities: []}));
  }

  private requestData() {
    const savedData = this.localStorageKey ? localStorage.getItem(this.localStorageKey) : '[]';
    if (savedData) {
      const savedDataArr = JSON.parse(savedData);
      this.initialData = savedDataArr.length ? [...savedDataArr] : [...this.initialData, ...savedDataArr];
    }
    return this.initialData;
  }
  private initData() {
    const data = this.requestData();
    this.entityState.set({
      entities: data,
      loaded: true
    });
  }
}
