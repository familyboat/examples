export const expect = (fnReturnValue, actualValue) => {
  if (fnReturnValue !== actualValue) {
    throw Error(`test failed: ${fnReturnValue} !== ${actualValue}`);
  }
  console.log(`test passes: ${fnReturnValue} === ${actualValue}`);
};
