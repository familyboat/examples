// remove child node from parent of child
export function removeChild(child) {
  const parent = child.parentElement;
  parent && parent.removeChild(child);
}

// whether browser has this functionality or not
export function hasIt(functionality, isAvailable) {
  return `${functionality} is ${
    isAvailable ? "available" : "not available"
  } in this browser`;
}

export function pop(list = []) {
  let c = null
  while (!c) {
    if (list.length){
      c = list.shift();
    } else {
      break;
    }
  }
  return c;
}