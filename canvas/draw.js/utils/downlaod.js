export const download = (blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xx.png`;
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 30_000);
};

export const share = async (blob) => {
  const data = {
    title: "share your png",
    text: "i draw something",
    files: [
      new File([blob], "xx.png", {
        type: blob.type,
      }),
    ],
  };
  try {
    await navigator.share(data);
  } catch (error) {
    alert(`Error: ${error.name} -> ${error.message}`);
  }
};
