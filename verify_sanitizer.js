
// Mock logic from firebase.ts
const sanitizeForFirestore = (obj) => {
  if (obj instanceof Date) {
      return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeForFirestore(v)).filter(v => v !== undefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = sanitizeForFirestore(obj[key]);
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return obj;
};

const date = new Date();
const input = {
    name: "Test",
    dateField: date,
    arr: [1, undefined, 2],
    nested: {
        undef: undefined,
        valid: "yes"
    }
};

const output = sanitizeForFirestore(input);

console.log("Output:", output);

if (output.dateField !== date) {
    console.error("FAIL: Date object was not preserved");
    process.exit(1);
}

if (output.arr.length !== 2 || output.arr.includes(undefined)) {
    console.error("FAIL: Array undefined filter failed");
    process.exit(1);
}

if ('undef' in output.nested) {
    console.error("FAIL: Nested undefined not removed");
    process.exit(1);
}

console.log("SUCCESS: Sanitizer logic is correct.");
