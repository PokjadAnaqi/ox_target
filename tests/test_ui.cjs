const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let JSDOM;try{({JSDOM}=require('jsdom'));}catch{({JSDOM}=require('../DTlib140/html/node_modules/jsdom'));}
const dom=new JSDOM('<body><svg id="trunk"><line/></svg><div id="trunk-dot"></div><div id="options-wrapper"></div><div id="interaction-hint" hidden><span id="interaction-label"></span></div></body>');
const posts=[];const context=vm.createContext({window:dom.window,document:dom.window.document,console,GetParentResourceName:()=> 'ox_target',fetch:async(url,data)=>{posts.push({url,data});return{json:async()=>1}},setTimeout:()=>1,requestAnimationFrame:fn=>fn()});
const resourceRoot=fs.existsSync(path.resolve(__dirname,'../fxmanifest.lua'))?path.resolve(__dirname,'..'):path.resolve(__dirname,'../ox_target_review/ox_target');
const base=path.join(resourceRoot,'web/js');const cache={};
async function load(name){const file=path.resolve(base,name);if(cache[file])return cache[file];const mod=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context,identifier:file});cache[file]=mod;await mod.link((specifier,ref)=>load(path.relative(base,path.resolve(path.dirname(ref.identifier),specifier))));return mod;}
(async()=>{
 const mod=await load('main.js');await mod.evaluate();const doc=dom.window.document;
 const send=data=>dom.window.dispatchEvent(new dom.window.MessageEvent('message',{data}));
 send({event:'setTarget',proximity:true,options:{global:[{label:'<img src=x onerror=alert(1)>',icon:'fa-key',hide:false},{label:'Other',icon:'fa-book',hide:false}]}});
 assert.equal(doc.querySelector('.option-label'),null);assert.equal(doc.getElementById('interaction-label').textContent,'<img src=x onerror=alert(1)>');assert.equal(doc.querySelector('img'),null);
 assert.equal(doc.body.style.visibility,'visible');assert.equal(doc.getElementById('interaction-hint').hidden,false);
 doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'e'}));assert.equal(posts.length,0);
 send({event:'interactionFocus'});
 assert.equal(doc.querySelectorAll('.option-container').length,2);assert.equal(doc.getElementById('interaction-hint').hidden,true);
 assert.equal(doc.querySelector('.option-label').textContent,'<img src=x onerror=alert(1)>');assert.equal(doc.querySelector('img'),null);
 doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowDown'}));
 assert.equal(doc.querySelectorAll('.option-container')[1].classList.contains('keyboard-selected'),true);
 // Avoid wall-clock waiting: selecting the highlighted option uses the same click handler as E.
 doc.querySelectorAll('.option-container')[1].click();
 assert.equal(JSON.parse(posts[0].data.body)[1],2);
 doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert(posts[1].url.endsWith('/interactionClose'));
 assert.equal(doc.querySelectorAll('.option-container').length,0);assert.equal(doc.getElementById('interaction-hint').hidden,false);
 send({event:'leftTarget'});assert.equal(doc.body.style.visibility,'hidden');assert.equal(doc.querySelectorAll('.option-container').length,0);
 send({event:'setTarget',proximity:false,options:{global:[{label:'Classic',hide:false}]}});
 assert.equal(doc.getElementById('interaction-hint').hidden,true);assert.equal(doc.querySelectorAll('.option-container').length,1);
 console.log('Prompt-first UI, explicit expansion, safe labels, arrow selection, Escape, target-loss and debug UI PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
