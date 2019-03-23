const items = [
  { id: 1, title: "My first item" },
  { id: 2, title: "My second item" },
  { id: 3, title: "My third item" }
];
export function fetchItem(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = items.filter(item => item.id === +id);
      resolve(item[0]);
    }, 2000);
  });
}
