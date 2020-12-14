export interface IData {
  expire: number;
  data: Buffer;
}

let store: { [key: string]: IData | undefined } = {};

export const cacheGet = (key: string): [Buffer | undefined, boolean] => {
  const _data = store[key];
  if (_data !== undefined) {
    const timestamp = Date.now();
    if (_data.expire < timestamp) {
      const buf = store[key].data;
      return [buf, true];
    }

    return [_data.data, false];
  } else {
    return [undefined, true];
  }
};

export const cacheSet = (key: string, value: Buffer, expire: number) => {
  store[key] = {
    data: value,
    expire,
  };
};

export const cacheClean = () => {
  const nextStore: { [key: string]: IData | undefined } = {};
  const timestamp = Date.now();

  Object.entries(store).forEach(([key, value]) => {
    const { expire } = value;
    if (timestamp <= expire) {
      nextStore[key] = value;
    }
  });
  store = nextStore;
};

let interval: null | NodeJS.Timeout = null;
if (interval === null) {
  interval = setInterval(() => {
    cacheClean();
  }, 60 * 60 * 1000);
}
