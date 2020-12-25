// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    VEAD: (_page_name: string, _right: string) => {
      return page_right(_page_name, _right, currentUser?.access);
    },
  };
}

const page_right = (_page_name: string, _right: string, _access: {}) => {
  const all_right = {
    view: 0b0001,
    edit: 0b0010,
    add: 0b0100,
    del: 0b1000,
  };
  let _page_right: number = 0;
  for (let i in _access) {
    if (i == _page_name) {
      _page_right = _access[i];
    }
  }
  for (let j in all_right) {
    if (j == _right) {
      return (_page_right & all_right[j]) === all_right[j];
    }
  }
};
