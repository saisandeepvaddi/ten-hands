/* Taken from https://github.com/Pocket/extension-save-to-pocket/blob/master/src/common/utilities.js */
export function isValidUrl(passedString: string) {
  const validUrlTestPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return validUrlTestPattern.test(passedString);
}

export function isValidAddress(passedString: string) {
  const validAddressPattern = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return validAddressPattern.test(passedString);
}

export function createValidUrl(passedString: string) {
  const hasProtocol = /^(?:(?:https?|ftp):\/\/)/g;
  return hasProtocol.test(passedString)
    ? passedString
    : "https://" + passedString;
}

export function domainForUrl(url: string) {
  const match = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im
  );
  return match?.[1];
}

export function baseDomainUrl(url: string) {
  const pathArray = url.split("/");
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + "//" + host;
}

export function isFunction(x: any) {
  return Object.prototype.toString.call(x) === "[object Function]";
}

export function arrayHasValues(checkArray: any[]) {
  return checkArray.filter(
    (value: any) => value && typeof value !== "undefined"
  );
}

export function shallowQueryParams(source: {
  [x: string]: string | number | boolean;
}) {
  const array = [];
  for (const key in source) {
    if (source[key]) {
      const type = Object.prototype.toString
        .call(source[key])
        .match(/\[object (\w+)\]/)[1];
      if (type === "String" || type === "Number") {
        array.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(source[key])
        );
      }
    }
  }
  return array.join("&");
}

export function randomEntry(array: string | any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function throttle(
  this: any,
  callback: { apply: (arg0: any, arg1: any) => void },
  wait: number,
  context = this
) {
  let timeout: NodeJS.Timeout | number | null = null;
  let callbackArgs: any[] | null = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return function (...args: any) {
    if (!timeout) {
      callbackArgs = args;
      timeout = setTimeout(later, wait);
    }
  };
}
