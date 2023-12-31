/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @oncall react_native
 */

export interface Options {
  endpoint: string;
  family?: 4 | 6;
  timeout?: number;
  key?: string | ReadonlyArray<string> | Buffer | ReadonlyArray<Buffer>;
  cert?: string | ReadonlyArray<string> | Buffer | ReadonlyArray<Buffer>;
  ca?: string | ReadonlyArray<string> | Buffer | ReadonlyArray<Buffer>;
}

export default class HttpStore<T> {
  constructor(options: Options);
  get(key: Buffer): Promise<T | null>;
  set(key: Buffer, value: T): Promise<void>;
  clear(): void;
}
