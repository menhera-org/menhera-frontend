/* -*- indent-tabs-mode: nil; tab-width: 2; -*- */
/* vim: set ts=2 sw=2 et ai : */
/**
  Copyright (C) 2023 Menhera.org

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  @license
*/

export type ComponentCallback<Data, View> = (data: Data) => View;

export class Component<Data, View> {
  private readonly _callback: ComponentCallback<Data, View>;

  private readonly _cache = new Map<string, View>();
  private readonly _maxCacheEntries = 100;

  public constructor(callback: ComponentCallback<Data, View>) {
    this._callback = callback;
  }

  public render(data: Data): View {
    const json = JSON.stringify(data);
    if (this._cache.has(json)) {
      return this._cache.get(json)!;
    }
    const view = this._callback(data);
    this._cache.set(json, view);
    if (this._cache.size > this._maxCacheEntries) {
      this._cache.delete(this._cache.keys().next().value);
    }
    return view;
  }
}
