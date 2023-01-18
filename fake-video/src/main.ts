import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <form id="searchForm">
      <input type="text" name="keyword" id="keyword"/>
      <button type="submit" id="submit">搜索</button>
    </form>
  </div>
  <ul id="searchList"></ul>
`;

const fakeVideoServer = "https://fake-video.deno.dev";
const error =
  "This link can not be accessed. Please click other links if exist.";

const form = document.querySelector("#searchForm") as HTMLFormElement;
const submitBtn = document.querySelector("#submit") as HTMLButtonElement;
const searchList = document.querySelector("#searchList") as HTMLUListElement;

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const formdata = new FormData(form);
  const keyword = formdata.get("keyword");
  const resp = await fetch(fakeVideoServer + "/search", {
    method: "POST",
    body: JSON.stringify({
      keyword,
    }),
    mode: "cors",
  });
  const searchResult = await resp.text();
  searchList.innerHTML = searchResult;
  const anchorList = searchList.querySelectorAll("a");
  anchorList.forEach((anchor) => {
    anchor.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.href || "";
      if (href.endsWith(".html")) {
        const resp = await fetch(fakeVideoServer + "/videos?url=" + href);
        const respResult = await resp.text();
        searchList.innerHTML = respResult;

        const anchorList = searchList.querySelectorAll("a");
        anchorList.forEach((anchor) => {
          anchor.addEventListener("click", async (e) => {
            e.preventDefault();
            const target = e.target as HTMLAnchorElement;
            const href = target.href || "";
            if (href.endsWith(".html")) {
              const resp = await fetch(fakeVideoServer + "/video?url=" + href);
              const respResult = await resp.text();

              if (respResult === "") {
                alert(error);
                return;
              }
              window.open(respResult, "_blank");
            } else {
              alert(error);
            }
          });
        });
      } else {
        alert(error);
      }
    });
  });
});
