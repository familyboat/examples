(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
  <div>
    <form id="searchForm">
      <input type="text" name="keyword" id="keyword"/>
      <button type="submit" id="submit">搜索</button>
    </form>
  </div>
  <ul id="searchList"></ul>
`;const i="https://fake-video.deno.dev",a="This link can not be accessed. Please click other links if exist.",L=document.querySelector("#searchForm"),g=document.querySelector("#submit"),n=document.querySelector("#searchList");g.addEventListener("click",async l=>{l.preventDefault();const s=new FormData(L).get("keyword"),e=await(await fetch(i+"/search",{method:"POST",body:JSON.stringify({keyword:s}),mode:"cors"})).text();n.innerHTML=e,n.querySelectorAll("a").forEach(r=>{r.addEventListener("click",async d=>{d.preventDefault();const u=d.target.href||"";if(u.endsWith(".html")){const p=await(await fetch(i+"/videos?url="+u)).text();n.innerHTML=p,n.querySelectorAll("a").forEach(y=>{y.addEventListener("click",async f=>{f.preventDefault();const h=f.target.href||"";if(h.endsWith(".html")){const m=await(await fetch(i+"/video?url="+h)).text();if(m===""){alert(a);return}window.open(m,"_blank")}else alert(a)})})}else alert(a)})})});
