export const JSON_ALL_TYPES = {
  string: '你好，世界！',
  number_int: 2024,
  number_float: 3.1415926,
  boolean_true: true,
  boolean_false: false,
  null_value: null,
  array_simple: [1, 2, 3, 4, 5],
  array_mixed: ['apple', 42, true, null, { nested: 'object' }],
  object: {
    name: 'Alice',
    age: 30,
    skills: ['Go', 'Python', 'React'],
    address: {
      city: 'Shanghai',
      zipcode: 200000,
      geo: [31.2304, 121.4737],
    },
  },
  empty_object: {},
  empty_array: [],
};

export const JSON_KEYS = {
  AA_BB_CC_0: 9.1,
  AA_BB_CC_1: 9.2,
};

export const JSON_TREE = {
  data: {
    '1234': {
      clientId: '12',
      hidden: true,
    },
    '1235': {
      clientId: '35',
      hidden: false,
    },
  },
};
