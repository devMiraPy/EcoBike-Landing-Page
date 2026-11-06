(function(){
  var root=document.documentElement;
  var $=function(id){return document.getElementById(id)};
  var brl=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}


  var themeBtn=$("theme");
  function setTheme(t){
    root.setAttribute("data-theme",t);
    themeBtn.textContent=t==="dark"?"☀️":"🌙";
    themeBtn.setAttribute("aria-label",t==="dark"?"Ativar modo claro":"Ativar modo escuro");
  }
  var saved=store("eco-theme");
  setTheme(saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
  themeBtn.addEventListener("click",function(){
    var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
    setTheme(next);store("eco-theme",next);
  });


  var nav=$("nav"),menu=$("menu");
  menu.addEventListener("click",function(){
    var open=nav.classList.toggle("open");
    menu.setAttribute("aria-expanded",open);
  });
  nav.addEventListener("click",function(e){if(e.target.tagName==="A"){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}});


  var PRICES={urbana:12,eletrica:20,cargo:25};
  function calc(){
    var h=parseFloat($("hours").value.replace(",","."));
    if(!(h>0))h=0;
    var sub=h*PRICES[$("bike").value];
    var d=h>5?sub*0.10:0;
    $("sub").textContent=brl.format(sub);
    $("disc").innerHTML=d>0?'<span class="disc">− '+brl.format(d)+'</span>':brl.format(0);
    $("total").textContent=brl.format(sub-d);
  }
  $("hours").addEventListener("input",calc);
  $("bike").addEventListener("change",calc);
  document.querySelectorAll("[data-bike]").forEach(function(a){
    a.addEventListener("click",function(){$("bike").value=a.dataset.bike;calc()});
  });
  calc();


  var targets=document.querySelectorAll(".hero h1,.hero p,.hero .cta,.lane,section h2,section .lead,.values>div,.card,.box,.steps li,.note");
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!("IntersectionObserver" in window)||calm){
    targets.forEach(function(el){el.classList.add("in")});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}
      });
    },{threshold:0.12,rootMargin:"0px 0px -6% 0px"});
    targets.forEach(function(el){
      var idx=Array.prototype.indexOf.call(el.parentNode.children,el);
      el.style.transitionDelay=Math.min(idx,4)*90+"ms";
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  
  var names=[];
  try{names=JSON.parse(store("eco-names")||"[]")}catch(e){names=[]}
  if(!Array.isArray(names))names=[];
  var list=$("list");
  function render(){
    list.innerHTML="";
    names.forEach(function(n,i){
      var li=document.createElement("li");
      var s=document.createElement("span");s.textContent=n;
      var b=document.createElement("button");b.type="button";b.textContent="Remover";
      b.setAttribute("aria-label","Remover "+n);
      b.addEventListener("click",function(){names.splice(i,1);save();render()});
      li.append(s,b);list.appendChild(li);
    });
    $("empty").style.display=names.length?"none":"block";
    $("count").textContent=names.length?names.length+(names.length===1?" pessoa na lista":" pessoas na lista"):"";
  }
  function save(){store("eco-names",JSON.stringify(names))}
  $("form").addEventListener("submit",function(e){
    e.preventDefault();
    var input=$("name"),v=input.value.trim();
    if(!v){input.focus();return}
    names.push(v);save();render();
    input.value="";input.focus();
  });
  render(); })();