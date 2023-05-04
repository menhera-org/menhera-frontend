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

import { ObjectComparer } from "./ObjectComparer";

export interface Data<T, Name extends string> {
  readonly constructorName: Name;
  readonly value: T;
}

export interface DataConstructor<T, Name extends string> {
  readonly NAME: Name;
  new(value: T): Data<T, Name>;
}

export function DataConstructor<T, Name extends string>(constructorName: Name) {
  return class {
    public static get NAME(): Name {
      return constructorName;
    }

    public static [Symbol.hasInstance](instance: unknown): boolean {
      return typeof instance == 'object' && instance !== null && (instance as Data<T, Name>).constructorName == constructorName;
    }

    public constructor(value: T) {
      return {
        constructorName,
        value,
      } as Data<T, Name>;
    }
  } as DataConstructor<T, Name>;
}

export namespace DataConstructor {
  export function compare<T>(a: Data<T, string>, b: Data<T, string>): boolean {
    return a.constructorName == b.constructorName && ObjectComparer.compare(a.value, b.value);
  }
}
