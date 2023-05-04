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

export class ObjectComparer {
  public static readonly PRIMITIVE_TYPES: readonly string[] = [
    'bigint',
    'boolean',
    'number',
    'string',
    'symbol',
    'undefined',
  ];

  public static compare(a: unknown, b: unknown): boolean {
    if (typeof a != typeof b) return false;
    if (ObjectComparer.PRIMITIVE_TYPES.includes(typeof a)) return Object.is(a, b);
    if (a === null) return b === null;
    if (typeof a == 'function') {
      throw new TypeError('Cannot compare functions');
    }
    if (typeof a != 'object' || a === null || typeof b != 'object' || b === null) {
      throw new TypeError('This should not happen');
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return false;
      if (a.length != b.length) return false;
      for (let i = 0; i < a.length; ++i) {
        if (!ObjectComparer.compare(a[i], b[i])) return false;
      }
      return true;
    }
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    const aRecord = a as Record<string, unknown>;
    const bRecord = b as Record<string, unknown>;
    if (aKeys.length != bKeys.length) return false;
    for (const key of aKeys) {
      if (!bKeys.includes(key)) return false;
      if (!ObjectComparer.compare(aRecord[key] as unknown, bRecord[key] as unknown)) return false;
    }
    return true;
  }
}
