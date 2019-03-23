const items = [
  { id: 1, item: "My first item" },
  { id: 2, item: "My second item" },
  { id: 1, item: "My third item" }
];
export function fetchItem(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = items.filter(item => item.id === id);
      resolve(item);
    }, 2000);
  });
}
