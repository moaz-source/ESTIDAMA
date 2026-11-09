var D=SITE_DATA,WA="97433350520",LIVE=!!window.LIVE_MODE;
var M=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
function $(id){return document.getElementById(id)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function href(p,q){return LIVE?"#"+p+(q?"?"+q:""):p+".html"+(q?"?"+q:"")}
function reqUrl(s,n){return href("request","s="+s+(n?"&n="+encodeURIComponent(n):""))}
function query(){return new URLSearchParams(LIVE?(location.hash.split("?")[1]||""):location.search)}

// ===== الهيكل المشترك: الهيدر والفوتر والنافذة المنبثقة =====
// عدّل أسماء الصفحات أو ترتيبها من هنا
var PAGES=[["index","الرئيسية"],["about","من نحن"],["services","الخدمات"],["programs","البرامج القادمة"],["community","مجتمع استدامة"],["trainers","المدربون"],["news","الأخبار"],["request","قدّم طلبك"]];
function buildLayout(){
$("site-header").outerHTML="<header><div class='wrap bar'><a class='logo' href='"+href("index")+"' aria-label='استدامة للتدريب الاحترافي'><img src='assets/logo-mark.png' alt=''><span>استدامة للتدريب</span></a><nav id='nav' aria-label='القائمة الرئيسية'><ul>"+PAGES.map(function(p){return "<li><a href='"+href(p[0])+"' data-p='"+p[0]+"'>"+p[1]+"</a></li>"}).join("")+"<li class='only-m'><a href='"+href("contact")+"' data-p='contact'>اتصل بنا</a></li></ul></nav><a class='btn' href='"+href("contact")+"'>تواصل معنا</a><button class='menu' id='menu' aria-expanded='false' aria-controls='nav'>القائمة</button></div></header>";
$("site-footer").innerHTML="<footer><div class='wrap'><span><img class='flogo' src='assets/logo.png' alt='مركز استدامة للتدريب'><br>© 2026 استدامة للتدريب الاحترافي</span><span><a target='_blank' rel='noopener' href='https://www.instagram.com/estidamaqa/'>إنستغرام</a><a target='_blank' rel='noopener' href='https://twitter.com/estidamaqa'>تويتر</a><a target='_blank' rel='noopener' href='https://www.facebook.com/profile.php?id=100079335102721'>فيسبوك</a><a target='_blank' rel='noopener' href='https://www.snapchat.com/add/estidamaqa'>سناب شات</a></span></div></footer><dialog id='dlg' aria-labelledby='dlgTitle'><button class='x' id='dlgX' aria-label='إغلاق'>×</button><div id='dlgBody'></div></dialog>";
var mb=$("menu"),nv=$("nav"),dlg=$("dlg");
mb.onclick=function(){var o=nv.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
nv.onclick=function(e){if(e.target.tagName==="A"){nv.classList.remove("open");mb.setAttribute("aria-expanded","false")}};
$("dlgX").onclick=function(){dlg.close()};
dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.closest("a"))dlg.close()});
}
function setActive(p){
Array.prototype.forEach.call(document.querySelectorAll("#nav a"),function(a){if(a.dataset.p===p)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
$("nav").classList.remove("open");$("menu").setAttribute("aria-expanded","false")}
function openDlg(html){$("dlgBody").innerHTML=html;$("dlg").showModal()}

// ===== أجزاء الصفحات (كل جزء يعمل فقط لو وُجد عنصره في الصفحة) =====
function initPartners(){
$("partners").insertAdjacentHTML("beforeend",D.partners.map(function(p){return "<span>"+esc(p)+"</span>"}).join(""))}

function initTrainers(){
$("trainersList").innerHTML=D.trainers.length?D.trainers.map(function(t,i){
var img=t.photo?"<img src='"+esc(t.photo)+"' alt=''>":"<span class='av' aria-hidden='true'>"+esc(t.name.charAt(0))+"</span>";
return "<button class='tr' data-t='"+i+"'>"+img+"<h3>"+esc(t.name)+"</h3><p>"+esc(t.field)+"</p></button>"}).join(""):"<p>سيتم إضافة المدربين قريبًا.</p>";
$("trainersList").onclick=function(e){
var b=e.target.closest("[data-t]");if(!b)return;var t=D.trainers[b.dataset.t];
openDlg("<h3 id='dlgTitle'>"+esc(t.name)+"</h3><p class='sub'>"+esc(t.field)+"</p>"+(t.bio?"<p>"+esc(t.bio)+"</p>":"")+"<a class='btn' href='"+esc(reqUrl("session",t.name))+"'>اطلب جلسة مع المدرب</a>")}}

function initNews(){
$("newsList").innerHTML=D.news.map(function(n,i){
return "<button class='item' data-n='"+i+"'><small>"+esc(n.date)+"</small><h3>"+esc(n.title)+"</h3><span class='more'>اقرأ المزيد</span></button>"}).join("");
$("newsList").onclick=function(e){
var b=e.target.closest("[data-n]");if(!b)return;var n=D.news[b.dataset.n];
openDlg("<h3 id='dlgTitle'>"+esc(n.title)+"</h3><p class='sub'>"+esc(n.date)+"</p><p>"+esc(n.text||"لمعرفة تفاصيل أكثر عن هذا الخبر، تواصل معنا عبر واتساب.")+"</p><a class='btn' target='_blank' rel='noopener' href='https://wa.me/"+WA+"'>تواصل عبر واتساب</a>")}}

function initPrograms(){
var tabs=$("months"),panel=$("panel");
function show(i){
Array.prototype.forEach.call(tabs.children,function(b,j){b.setAttribute("aria-selected",j===i)});
var l=D.programs[i]||[];
panel.innerHTML="<h3>برامج شهر "+M[i]+"</h3>"+(l.length?l.map(function(x){
return "<div class='prog'><span><b>"+esc(x.t)+"</b> — "+esc(x.d)+"</span><a class='btn sm' href='"+esc(reqUrl("program",x.t+" ("+x.d+")"))+"'>سجّل</a></div>"}).join(""):"<p>لا توجد برامج منشورة لهذا الشهر بعد.</p>")+"<a class='btn' href='"+esc(reqUrl("ask","أرغب بمعرفة برامج شهر "+M[i]))+"'>استفسر عن برامج الشهر</a>";
}
M.forEach(function(m,i){var b=document.createElement("button");b.textContent=m;b.setAttribute("role","tab");b.onclick=function(){show(i)};tabs.appendChild(b)});
show(new Date().getMonth())}

// نماذج الطلبات: لكل نوع حقوله الخاصة (r = إجباري، ref = يستقبل اسم البرنامج/المدرب، p = نص إرشادي)
var NAME={id:"name",l:"الاسم",r:1,p:"الاسم الكامل"},PHONE={id:"phone",l:"رقم الجوال",t:"tel",r:1,p:"مثال: 55123456"};
var FORMS={
hall:{tab:"حجز قاعة",title:"حجز قاعة تدريبية",hint:"حدّد التاريخ والوقت وعدد الحضور، وسنؤكد لك توفر القاعة.",f:[NAME,PHONE,
{id:"date",l:"تاريخ الحجز",t:"date",r:1},
{id:"count",l:"عدد الحضور",t:"number",r:1,p:"مثال: 20"},
{id:"from",l:"من الساعة",t:"time",r:1},
{id:"to",l:"إلى الساعة",t:"time",r:1},
{id:"kind",l:"نوع النشاط",t:"select",o:["دورة تدريبية","ورشة عمل","اجتماع","جلسة فردية","أخرى"],full:1},
{id:"note",l:"ملاحظات",t:"textarea",full:1,p:"أي تجهيزات أو تفاصيل تحتاجها (اختياري)"}]},
trainer:{tab:"اعتماد مدرب",title:"طلب اعتماد مدرب",hint:"عرّفنا بخبراتك وتخصصك، وسنراجع الطلب ونتواصل معك.",f:[NAME,PHONE,
{id:"email",l:"البريد الإلكتروني",t:"email",r:1,p:"name@example.com"},
{id:"years",l:"سنوات الخبرة",t:"number",r:1,p:"مثال: 5"},
{id:"field",l:"التخصص",r:1,full:1,p:"مثال: القيادة وإدارة الفرق"},
{id:"note",l:"نبذة عن خبراتك وشهاداتك",t:"textarea",full:1,r:1,p:"اذكر مؤهلاتك ودوراتك السابقة"}]},
member:{tab:"عضوية المركز",title:"طلب عضوية المركز",hint:"اختر نوع العضوية وسنرسل لك تفاصيلها وخطوات الانضمام.",f:[NAME,PHONE,
{id:"kind",l:"نوع العضوية",t:"select",o:["فرد","مؤسسة"]},
{id:"org",l:"اسم الجهة (إن وجد)",p:"اسم الشركة أو الجهة"},
{id:"note",l:"ملاحظات",t:"textarea",full:1,p:"اختياري"}]},
program:{tab:"التسجيل في برنامج",title:"التسجيل في برنامج",hint:"اكتب اسم البرنامج الذي ترغب بالتسجيل فيه.",f:[NAME,PHONE,
{id:"prog",l:"اسم البرنامج",r:1,ref:1,full:1,p:"اسم البرنامج"},
{id:"note",l:"ملاحظات",t:"textarea",full:1,p:"اختياري"}]},
session:{tab:"جلسة مع مدرب",title:"حجز جلسة مع مدرب",hint:"اختر المدرب وموعدًا مناسبًا لك، وسنرتب الجلسة.",f:[NAME,PHONE,
{id:"trainer",l:"اسم المدرب",r:1,ref:1,p:"اسم المدرب"},
{id:"date",l:"التاريخ المفضل",t:"date"},
{id:"note",l:"ملاحظات",t:"textarea",full:1,p:"اختياري"}]},
ask:{tab:"استفسار",title:"استفسار",hint:"اكتب سؤالك وسنرد عليك في أقرب وقت.",f:[NAME,PHONE,
{id:"note",l:"استفسارك",t:"textarea",full:1,r:1,p:"اكتب استفسارك هنا"}]}
};
var ICON={
hall:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
trainer:'<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
member:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
program:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
session:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
ask:'<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"/>'
};
function fid(k){return "f_"+k}
function initRequest(){
var today=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
var cur="hall",types=$("types"),fields=$("fields"),fErr=$("fErr"),fOk=$("fOk");
function renderForm(k,fill){
if(!FORMS[k])return;
var keep={};["name","phone"].forEach(function(x){var e=$(fid(x));if(e)keep[x]=e.value});
cur=k;var F=FORMS[k];fErr.textContent="";fOk.textContent="";
$("formTitle").textContent=F.title;$("formHint").textContent=F.hint;
Array.prototype.forEach.call(types.children,function(b){b.setAttribute("aria-selected",b.dataset.k===k)});
fields.innerHTML=F.f.map(function(x){
var id=fid(x.id),ph=x.p?" placeholder='"+esc(x.p)+"'":"",inp;
if(x.t==="textarea")inp="<textarea id='"+id+"' rows='4'"+ph+"></textarea>";
else if(x.t==="select")inp="<select id='"+id+"'>"+x.o.map(function(o){return "<option>"+esc(o)+"</option>"}).join("")+"</select>";
else inp="<input id='"+id+"' type='"+(x.t||"text")+"'"+ph+(x.t==="number"?" min='1'":"")+(x.t==="date"?" min='"+today+"'":"")+(x.id==="name"?" autocomplete='name'":"")+(x.t==="tel"?" autocomplete='tel'":"")+">";
return "<label"+(x.full?" class='full'":"")+"><span>"+esc(x.l)+(x.r?" <i>*</i>":"")+"</span>"+inp+"</label>"}).join("");
if(keep.name)$(fid("name")).value=keep.name;
if(keep.phone)$(fid("phone")).value=keep.phone;
if(fill){var t=F.f.filter(function(x){return x.ref})[0]||F.f.filter(function(x){return x.id==="note"})[0];if(t)$(fid(t.id)).value=fill}
}
types.innerHTML=Object.keys(FORMS).map(function(k){return "<button type='button' role='tab' data-k='"+k+"'><svg viewBox='0 0 24 24' aria-hidden='true'>"+ICON[k]+"</svg><span>"+esc(FORMS[k].tab)+"</span></button>"}).join("");
types.onclick=function(e){var b=e.target.closest("[data-k]");if(b)renderForm(b.dataset.k)};
var q=query();
renderForm(FORMS[q.get("s")]?q.get("s"):"hall",q.get("n")||"");

$("reqForm").onsubmit=function(e){
e.preventDefault();fOk.textContent="";
Array.prototype.forEach.call(fields.querySelectorAll(".bad"),function(n){n.classList.remove("bad")});
var F=FORMS[cur],lines=[],err="",bad=null;
F.f.forEach(function(x){
if(err)return;
var el=$(fid(x.id)),v=el.value.trim();
if(x.r&&!v)err="املأ حقل: "+x.l;
else if(x.id==="name"&&v.length<3)err="اكتب اسمك الكامل.";
else if(x.id==="phone"&&!/^\+?[0-9 ]{8,15}$/.test(v))err="اكتب رقم جوال صحيح، أرقام فقط.";
else if(x.t==="email"&&!/^\S+@\S+\.\S+$/.test(v))err="اكتب بريدًا إلكترونيًا صحيحًا.";
else if(x.t==="date"&&v&&v<today)err="اختر تاريخًا لم يمضِ.";
if(err)bad=el;else if(v)lines.push(x.l+": "+v)});
if(!err&&cur==="hall"&&$(fid("to")).value<=$(fid("from")).value){err="وقت النهاية لازم يكون بعد وقت البداية.";bad=$(fid("to"))}
if(err){fErr.textContent=err;if(bad){bad.classList.add("bad");bad.focus()}return}
fErr.textContent="";
var t="طلب جديد من الموقع\nنوع الطلب: "+F.title+"\n"+lines.join("\n");
window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(t),"_blank","noopener");
fOk.textContent="تم تجهيز رسالتك في واتساب. اضغط إرسال هناك لإتمام الطلب."};
}

function initPage(){
if($("partners"))initPartners();
if($("trainersList"))initTrainers();
if($("newsList"))initNews();
if($("months"))initPrograms();
if($("reqForm"))initRequest();
Array.prototype.forEach.call(document.querySelectorAll("[data-scroll]"),function(b){b.onclick=function(){var t=$(b.dataset.scroll);if(t)t.scrollIntoView({behavior:"smooth"})}});
}

buildLayout();
setActive(document.body.dataset.page);
if(!LIVE)initPage();
