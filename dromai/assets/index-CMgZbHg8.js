(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(l){if(l.ep)return;l.ep=!0;const o=t(l);fetch(l.href,o)}})();function tf(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ya={exports:{}},Kl={},Ga={exports:{}},V={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Or=Symbol.for("react.element"),rf=Symbol.for("react.portal"),lf=Symbol.for("react.fragment"),of=Symbol.for("react.strict_mode"),sf=Symbol.for("react.profiler"),af=Symbol.for("react.provider"),uf=Symbol.for("react.context"),cf=Symbol.for("react.forward_ref"),df=Symbol.for("react.suspense"),ff=Symbol.for("react.memo"),pf=Symbol.for("react.lazy"),Os=Symbol.iterator;function mf(e){return e===null||typeof e!="object"?null:(e=Os&&e[Os]||e["@@iterator"],typeof e=="function"?e:null)}var Ja={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Za=Object.assign,ba={};function Vt(e,n,t){this.props=e,this.context=n,this.refs=ba,this.updater=t||Ja}Vt.prototype.isReactComponent={};Vt.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};Vt.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function qa(){}qa.prototype=Vt.prototype;function Ii(e,n,t){this.props=e,this.context=n,this.refs=ba,this.updater=t||Ja}var Mi=Ii.prototype=new qa;Mi.constructor=Ii;Za(Mi,Vt.prototype);Mi.isPureReactComponent=!0;var Rs=Array.isArray,eu=Object.prototype.hasOwnProperty,$i={current:null},nu={key:!0,ref:!0,__self:!0,__source:!0};function tu(e,n,t){var r,l={},o=null,i=null;if(n!=null)for(r in n.ref!==void 0&&(i=n.ref),n.key!==void 0&&(o=""+n.key),n)eu.call(n,r)&&!nu.hasOwnProperty(r)&&(l[r]=n[r]);var s=arguments.length-2;if(s===1)l.children=t;else if(1<s){for(var a=Array(s),f=0;f<s;f++)a[f]=arguments[f+2];l.children=a}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)l[r]===void 0&&(l[r]=s[r]);return{$$typeof:Or,type:e,key:o,ref:i,props:l,_owner:$i.current}}function hf(e,n){return{$$typeof:Or,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function Ai(e){return typeof e=="object"&&e!==null&&e.$$typeof===Or}function gf(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var Fs=/\/+/g;function po(e,n){return typeof e=="object"&&e!==null&&e.key!=null?gf(""+e.key):n.toString(36)}function ul(e,n,t,r,l){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Or:case rf:i=!0}}if(i)return i=e,l=l(i),e=r===""?"."+po(i,0):r,Rs(l)?(t="",e!=null&&(t=e.replace(Fs,"$&/")+"/"),ul(l,n,t,"",function(f){return f})):l!=null&&(Ai(l)&&(l=hf(l,t+(!l.key||i&&i.key===l.key?"":(""+l.key).replace(Fs,"$&/")+"/")+e)),n.push(l)),1;if(i=0,r=r===""?".":r+":",Rs(e))for(var s=0;s<e.length;s++){o=e[s];var a=r+po(o,s);i+=ul(o,n,t,a,l)}else if(a=mf(e),typeof a=="function")for(e=a.call(e),s=0;!(o=e.next()).done;)o=o.value,a=r+po(o,s++),i+=ul(o,n,t,a,l);else if(o==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return i}function Qr(e,n,t){if(e==null)return e;var r=[],l=0;return ul(e,r,"","",function(o){return n.call(t,o,l++)}),r}function vf(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Pe={current:null},cl={transition:null},yf={ReactCurrentDispatcher:Pe,ReactCurrentBatchConfig:cl,ReactCurrentOwner:$i};function ru(){throw Error("act(...) is not supported in production builds of React.")}V.Children={map:Qr,forEach:function(e,n,t){Qr(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return Qr(e,function(){n++}),n},toArray:function(e){return Qr(e,function(n){return n})||[]},only:function(e){if(!Ai(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};V.Component=Vt;V.Fragment=lf;V.Profiler=sf;V.PureComponent=Ii;V.StrictMode=of;V.Suspense=df;V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yf;V.act=ru;V.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Za({},e.props),l=e.key,o=e.ref,i=e._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,i=$i.current),n.key!==void 0&&(l=""+n.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(a in n)eu.call(n,a)&&!nu.hasOwnProperty(a)&&(r[a]=n[a]===void 0&&s!==void 0?s[a]:n[a])}var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){s=Array(a);for(var f=0;f<a;f++)s[f]=arguments[f+2];r.children=s}return{$$typeof:Or,type:e.type,key:l,ref:o,props:r,_owner:i}};V.createContext=function(e){return e={$$typeof:uf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:af,_context:e},e.Consumer=e};V.createElement=tu;V.createFactory=function(e){var n=tu.bind(null,e);return n.type=e,n};V.createRef=function(){return{current:null}};V.forwardRef=function(e){return{$$typeof:cf,render:e}};V.isValidElement=Ai;V.lazy=function(e){return{$$typeof:pf,_payload:{_status:-1,_result:e},_init:vf}};V.memo=function(e,n){return{$$typeof:ff,type:e,compare:n===void 0?null:n}};V.startTransition=function(e){var n=cl.transition;cl.transition={};try{e()}finally{cl.transition=n}};V.unstable_act=ru;V.useCallback=function(e,n){return Pe.current.useCallback(e,n)};V.useContext=function(e){return Pe.current.useContext(e)};V.useDebugValue=function(){};V.useDeferredValue=function(e){return Pe.current.useDeferredValue(e)};V.useEffect=function(e,n){return Pe.current.useEffect(e,n)};V.useId=function(){return Pe.current.useId()};V.useImperativeHandle=function(e,n,t){return Pe.current.useImperativeHandle(e,n,t)};V.useInsertionEffect=function(e,n){return Pe.current.useInsertionEffect(e,n)};V.useLayoutEffect=function(e,n){return Pe.current.useLayoutEffect(e,n)};V.useMemo=function(e,n){return Pe.current.useMemo(e,n)};V.useReducer=function(e,n,t){return Pe.current.useReducer(e,n,t)};V.useRef=function(e){return Pe.current.useRef(e)};V.useState=function(e){return Pe.current.useState(e)};V.useSyncExternalStore=function(e,n,t){return Pe.current.useSyncExternalStore(e,n,t)};V.useTransition=function(){return Pe.current.useTransition()};V.version="18.3.1";Ga.exports=V;var M=Ga.exports;const lu=tf(M);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xf=M,kf=Symbol.for("react.element"),wf=Symbol.for("react.fragment"),Sf=Object.prototype.hasOwnProperty,jf=xf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Cf={key:!0,ref:!0,__self:!0,__source:!0};function ou(e,n,t){var r,l={},o=null,i=null;t!==void 0&&(o=""+t),n.key!==void 0&&(o=""+n.key),n.ref!==void 0&&(i=n.ref);for(r in n)Sf.call(n,r)&&!Cf.hasOwnProperty(r)&&(l[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)l[r]===void 0&&(l[r]=n[r]);return{$$typeof:kf,type:e,key:o,ref:i,props:l,_owner:jf.current}}Kl.Fragment=wf;Kl.jsx=ou;Kl.jsxs=ou;Ya.exports=Kl;var c=Ya.exports,Bo={},iu={exports:{}},Ve={},su={exports:{}},au={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(E,A){var W=E.length;E.push(A);e:for(;0<W;){var ne=W-1>>>1,ue=E[ne];if(0<l(ue,A))E[ne]=A,E[W]=ue,W=ne;else break e}}function t(E){return E.length===0?null:E[0]}function r(E){if(E.length===0)return null;var A=E[0],W=E.pop();if(W!==A){E[0]=W;e:for(var ne=0,ue=E.length,bn=ue>>>1;ne<bn;){var Ln=2*(ne+1)-1,Pn=E[Ln],Te=Ln+1,ze=E[Te];if(0>l(Pn,W))Te<ue&&0>l(ze,Pn)?(E[ne]=ze,E[Te]=W,ne=Te):(E[ne]=Pn,E[Ln]=W,ne=Ln);else if(Te<ue&&0>l(ze,W))E[ne]=ze,E[Te]=W,ne=Te;else break e}}return A}function l(E,A){var W=E.sortIndex-A.sortIndex;return W!==0?W:E.id-A.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var i=Date,s=i.now();e.unstable_now=function(){return i.now()-s}}var a=[],f=[],y=1,x=null,v=3,N=!1,w=!1,C=!1,R=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,d=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function m(E){for(var A=t(f);A!==null;){if(A.callback===null)r(f);else if(A.startTime<=E)r(f),A.sortIndex=A.expirationTime,n(a,A);else break;A=t(f)}}function S(E){if(C=!1,m(E),!w)if(t(a)!==null)w=!0,Zn(_);else{var A=t(f);A!==null&&O(S,A.startTime-E)}}function _(E,A){w=!1,C&&(C=!1,p(I),I=-1),N=!0;var W=v;try{for(m(A),x=t(a);x!==null&&(!(x.expirationTime>A)||E&&!fe());){var ne=x.callback;if(typeof ne=="function"){x.callback=null,v=x.priorityLevel;var ue=ne(x.expirationTime<=A);A=e.unstable_now(),typeof ue=="function"?x.callback=ue:x===t(a)&&r(a),m(A)}else r(a);x=t(a)}if(x!==null)var bn=!0;else{var Ln=t(f);Ln!==null&&O(S,Ln.startTime-A),bn=!1}return bn}finally{x=null,v=W,N=!1}}var D=!1,T=null,I=-1,Q=5,F=-1;function fe(){return!(e.unstable_now()-F<Q)}function ve(){if(T!==null){var E=e.unstable_now();F=E;var A=!0;try{A=T(!0,E)}finally{A?sn():(D=!1,T=null)}}else D=!1}var sn;if(typeof d=="function")sn=function(){d(ve)};else if(typeof MessageChannel<"u"){var vn=new MessageChannel,pt=vn.port2;vn.port1.onmessage=ve,sn=function(){pt.postMessage(null)}}else sn=function(){R(ve,0)};function Zn(E){T=E,D||(D=!0,sn())}function O(E,A){I=R(function(){E(e.unstable_now())},A)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(E){E.callback=null},e.unstable_continueExecution=function(){w||N||(w=!0,Zn(_))},e.unstable_forceFrameRate=function(E){0>E||125<E?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Q=0<E?Math.floor(1e3/E):5},e.unstable_getCurrentPriorityLevel=function(){return v},e.unstable_getFirstCallbackNode=function(){return t(a)},e.unstable_next=function(E){switch(v){case 1:case 2:case 3:var A=3;break;default:A=v}var W=v;v=A;try{return E()}finally{v=W}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(E,A){switch(E){case 1:case 2:case 3:case 4:case 5:break;default:E=3}var W=v;v=E;try{return A()}finally{v=W}},e.unstable_scheduleCallback=function(E,A,W){var ne=e.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?ne+W:ne):W=ne,E){case 1:var ue=-1;break;case 2:ue=250;break;case 5:ue=1073741823;break;case 4:ue=1e4;break;default:ue=5e3}return ue=W+ue,E={id:y++,callback:A,priorityLevel:E,startTime:W,expirationTime:ue,sortIndex:-1},W>ne?(E.sortIndex=W,n(f,E),t(a)===null&&E===t(f)&&(C?(p(I),I=-1):C=!0,O(S,W-ne))):(E.sortIndex=ue,n(a,E),w||N||(w=!0,Zn(_))),E},e.unstable_shouldYield=fe,e.unstable_wrapCallback=function(E){var A=v;return function(){var W=v;v=A;try{return E.apply(this,arguments)}finally{v=W}}}})(au);su.exports=au;var Nf=su.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ef=M,Ue=Nf;function j(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var uu=new Set,kr={};function dt(e,n){At(e,n),At(e+"Capture",n)}function At(e,n){for(kr[e]=n,e=0;e<n.length;e++)uu.add(n[e])}var Cn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Wo=Object.prototype.hasOwnProperty,zf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bs={},Ws={};function _f(e){return Wo.call(Ws,e)?!0:Wo.call(Bs,e)?!1:zf.test(e)?Ws[e]=!0:(Bs[e]=!0,!1)}function Lf(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Pf(e,n,t,r){if(n===null||typeof n>"u"||Lf(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function De(e,n,t,r,l,o,i){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=o,this.removeEmptyString=i}var ke={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ke[e]=new De(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];ke[n]=new De(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ke[e]=new De(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ke[e]=new De(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ke[e]=new De(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ke[e]=new De(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ke[e]=new De(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ke[e]=new De(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ke[e]=new De(e,5,!1,e.toLowerCase(),null,!1,!1)});var Oi=/[\-:]([a-z])/g;function Ri(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace(Oi,Ri);ke[n]=new De(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace(Oi,Ri);ke[n]=new De(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace(Oi,Ri);ke[n]=new De(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ke[e]=new De(e,1,!1,e.toLowerCase(),null,!1,!1)});ke.xlinkHref=new De("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ke[e]=new De(e,1,!1,e.toLowerCase(),null,!0,!0)});function Fi(e,n,t,r){var l=ke.hasOwnProperty(n)?ke[n]:null;(l!==null?l.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Pf(n,t,l,r)&&(t=null),r||l===null?_f(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):l.mustUseProperty?e[l.propertyName]=t===null?l.type===3?!1:"":t:(n=l.attributeName,r=l.attributeNamespace,t===null?e.removeAttribute(n):(l=l.type,t=l===3||l===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var _n=Ef.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Xr=Symbol.for("react.element"),yt=Symbol.for("react.portal"),xt=Symbol.for("react.fragment"),Bi=Symbol.for("react.strict_mode"),Uo=Symbol.for("react.profiler"),cu=Symbol.for("react.provider"),du=Symbol.for("react.context"),Wi=Symbol.for("react.forward_ref"),Vo=Symbol.for("react.suspense"),Ho=Symbol.for("react.suspense_list"),Ui=Symbol.for("react.memo"),Tn=Symbol.for("react.lazy"),fu=Symbol.for("react.offscreen"),Us=Symbol.iterator;function qt(e){return e===null||typeof e!="object"?null:(e=Us&&e[Us]||e["@@iterator"],typeof e=="function"?e:null)}var oe=Object.assign,mo;function sr(e){if(mo===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);mo=n&&n[1]||""}return`
`+mo+e}var ho=!1;function go(e,n){if(!e||ho)return"";ho=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(f){var r=f}Reflect.construct(e,[],n)}else{try{n.call()}catch(f){r=f}e.call(n.prototype)}else{try{throw Error()}catch(f){r=f}e()}}catch(f){if(f&&r&&typeof f.stack=="string"){for(var l=f.stack.split(`
`),o=r.stack.split(`
`),i=l.length-1,s=o.length-1;1<=i&&0<=s&&l[i]!==o[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==o[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==o[s]){var a=`
`+l[i].replace(" at new "," at ");return e.displayName&&a.includes("<anonymous>")&&(a=a.replace("<anonymous>",e.displayName)),a}while(1<=i&&0<=s);break}}}finally{ho=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?sr(e):""}function Df(e){switch(e.tag){case 5:return sr(e.type);case 16:return sr("Lazy");case 13:return sr("Suspense");case 19:return sr("SuspenseList");case 0:case 2:case 15:return e=go(e.type,!1),e;case 11:return e=go(e.type.render,!1),e;case 1:return e=go(e.type,!0),e;default:return""}}function Ko(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case xt:return"Fragment";case yt:return"Portal";case Uo:return"Profiler";case Bi:return"StrictMode";case Vo:return"Suspense";case Ho:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case du:return(e.displayName||"Context")+".Consumer";case cu:return(e._context.displayName||"Context")+".Provider";case Wi:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ui:return n=e.displayName||null,n!==null?n:Ko(e.type)||"Memo";case Tn:n=e._payload,e=e._init;try{return Ko(e(n))}catch{}}return null}function Tf(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ko(n);case 8:return n===Bi?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function Qn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pu(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function If(e){var n=pu(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var l=t.get,o=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,o.call(this,i)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Yr(e){e._valueTracker||(e._valueTracker=If(e))}function mu(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=pu(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function wl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Qo(e,n){var t=n.checked;return oe({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function Vs(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=Qn(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function hu(e,n){n=n.checked,n!=null&&Fi(e,"checked",n,!1)}function Xo(e,n){hu(e,n);var t=Qn(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?Yo(e,n.type,t):n.hasOwnProperty("defaultValue")&&Yo(e,n.type,Qn(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function Hs(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function Yo(e,n,t){(n!=="number"||wl(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var ar=Array.isArray;function Pt(e,n,t,r){if(e=e.options,n){n={};for(var l=0;l<t.length;l++)n["$"+t[l]]=!0;for(t=0;t<e.length;t++)l=n.hasOwnProperty("$"+e[t].value),e[t].selected!==l&&(e[t].selected=l),l&&r&&(e[t].defaultSelected=!0)}else{for(t=""+Qn(t),n=null,l=0;l<e.length;l++){if(e[l].value===t){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}n!==null||e[l].disabled||(n=e[l])}n!==null&&(n.selected=!0)}}function Go(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(j(91));return oe({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ks(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(j(92));if(ar(t)){if(1<t.length)throw Error(j(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:Qn(t)}}function gu(e,n){var t=Qn(n.value),r=Qn(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function Qs(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function vu(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Jo(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?vu(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Gr,yu=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,l){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,l)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(Gr=Gr||document.createElement("div"),Gr.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=Gr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function wr(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var dr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Mf=["Webkit","ms","Moz","O"];Object.keys(dr).forEach(function(e){Mf.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),dr[n]=dr[e]})});function xu(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||dr.hasOwnProperty(e)&&dr[e]?(""+n).trim():n+"px"}function ku(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,l=xu(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,l):e[t]=l}}var $f=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zo(e,n){if(n){if($f[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(j(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(j(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(j(61))}if(n.style!=null&&typeof n.style!="object")throw Error(j(62))}}function bo(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var qo=null;function Vi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ei=null,Dt=null,Tt=null;function Xs(e){if(e=Br(e)){if(typeof ei!="function")throw Error(j(280));var n=e.stateNode;n&&(n=Jl(n),ei(e.stateNode,e.type,n))}}function wu(e){Dt?Tt?Tt.push(e):Tt=[e]:Dt=e}function Su(){if(Dt){var e=Dt,n=Tt;if(Tt=Dt=null,Xs(e),n)for(e=0;e<n.length;e++)Xs(n[e])}}function ju(e,n){return e(n)}function Cu(){}var vo=!1;function Nu(e,n,t){if(vo)return e(n,t);vo=!0;try{return ju(e,n,t)}finally{vo=!1,(Dt!==null||Tt!==null)&&(Cu(),Su())}}function Sr(e,n){var t=e.stateNode;if(t===null)return null;var r=Jl(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(j(231,n,typeof t));return t}var ni=!1;if(Cn)try{var er={};Object.defineProperty(er,"passive",{get:function(){ni=!0}}),window.addEventListener("test",er,er),window.removeEventListener("test",er,er)}catch{ni=!1}function Af(e,n,t,r,l,o,i,s,a){var f=Array.prototype.slice.call(arguments,3);try{n.apply(t,f)}catch(y){this.onError(y)}}var fr=!1,Sl=null,jl=!1,ti=null,Of={onError:function(e){fr=!0,Sl=e}};function Rf(e,n,t,r,l,o,i,s,a){fr=!1,Sl=null,Af.apply(Of,arguments)}function Ff(e,n,t,r,l,o,i,s,a){if(Rf.apply(this,arguments),fr){if(fr){var f=Sl;fr=!1,Sl=null}else throw Error(j(198));jl||(jl=!0,ti=f)}}function ft(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function Eu(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function Ys(e){if(ft(e)!==e)throw Error(j(188))}function Bf(e){var n=e.alternate;if(!n){if(n=ft(e),n===null)throw Error(j(188));return n!==e?null:e}for(var t=e,r=n;;){var l=t.return;if(l===null)break;var o=l.alternate;if(o===null){if(r=l.return,r!==null){t=r;continue}break}if(l.child===o.child){for(o=l.child;o;){if(o===t)return Ys(l),e;if(o===r)return Ys(l),n;o=o.sibling}throw Error(j(188))}if(t.return!==r.return)t=l,r=o;else{for(var i=!1,s=l.child;s;){if(s===t){i=!0,t=l,r=o;break}if(s===r){i=!0,r=l,t=o;break}s=s.sibling}if(!i){for(s=o.child;s;){if(s===t){i=!0,t=o,r=l;break}if(s===r){i=!0,r=o,t=l;break}s=s.sibling}if(!i)throw Error(j(189))}}if(t.alternate!==r)throw Error(j(190))}if(t.tag!==3)throw Error(j(188));return t.stateNode.current===t?e:n}function zu(e){return e=Bf(e),e!==null?_u(e):null}function _u(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=_u(e);if(n!==null)return n;e=e.sibling}return null}var Lu=Ue.unstable_scheduleCallback,Gs=Ue.unstable_cancelCallback,Wf=Ue.unstable_shouldYield,Uf=Ue.unstable_requestPaint,se=Ue.unstable_now,Vf=Ue.unstable_getCurrentPriorityLevel,Hi=Ue.unstable_ImmediatePriority,Pu=Ue.unstable_UserBlockingPriority,Cl=Ue.unstable_NormalPriority,Hf=Ue.unstable_LowPriority,Du=Ue.unstable_IdlePriority,Ql=null,hn=null;function Kf(e){if(hn&&typeof hn.onCommitFiberRoot=="function")try{hn.onCommitFiberRoot(Ql,e,void 0,(e.current.flags&128)===128)}catch{}}var rn=Math.clz32?Math.clz32:Yf,Qf=Math.log,Xf=Math.LN2;function Yf(e){return e>>>=0,e===0?32:31-(Qf(e)/Xf|0)|0}var Jr=64,Zr=4194304;function ur(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Nl(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,l=e.suspendedLanes,o=e.pingedLanes,i=t&268435455;if(i!==0){var s=i&~l;s!==0?r=ur(s):(o&=i,o!==0&&(r=ur(o)))}else i=t&~l,i!==0?r=ur(i):o!==0&&(r=ur(o));if(r===0)return 0;if(n!==0&&n!==r&&!(n&l)&&(l=r&-r,o=n&-n,l>=o||l===16&&(o&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-rn(n),l=1<<t,r|=e[t],n&=~l;return r}function Gf(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Jf(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,o=e.pendingLanes;0<o;){var i=31-rn(o),s=1<<i,a=l[i];a===-1?(!(s&t)||s&r)&&(l[i]=Gf(s,n)):a<=n&&(e.expiredLanes|=s),o&=~s}}function ri(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Tu(){var e=Jr;return Jr<<=1,!(Jr&4194240)&&(Jr=64),e}function yo(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function Rr(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-rn(n),e[n]=t}function Zf(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var l=31-rn(t),o=1<<l;n[l]=0,r[l]=-1,e[l]=-1,t&=~o}}function Ki(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-rn(t),l=1<<r;l&n|e[r]&n&&(e[r]|=n),t&=~l}}var K=0;function Iu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Mu,Qi,$u,Au,Ou,li=!1,br=[],Rn=null,Fn=null,Bn=null,jr=new Map,Cr=new Map,Mn=[],bf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Js(e,n){switch(e){case"focusin":case"focusout":Rn=null;break;case"dragenter":case"dragleave":Fn=null;break;case"mouseover":case"mouseout":Bn=null;break;case"pointerover":case"pointerout":jr.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Cr.delete(n.pointerId)}}function nr(e,n,t,r,l,o){return e===null||e.nativeEvent!==o?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:o,targetContainers:[l]},n!==null&&(n=Br(n),n!==null&&Qi(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,l!==null&&n.indexOf(l)===-1&&n.push(l),e)}function qf(e,n,t,r,l){switch(n){case"focusin":return Rn=nr(Rn,e,n,t,r,l),!0;case"dragenter":return Fn=nr(Fn,e,n,t,r,l),!0;case"mouseover":return Bn=nr(Bn,e,n,t,r,l),!0;case"pointerover":var o=l.pointerId;return jr.set(o,nr(jr.get(o)||null,e,n,t,r,l)),!0;case"gotpointercapture":return o=l.pointerId,Cr.set(o,nr(Cr.get(o)||null,e,n,t,r,l)),!0}return!1}function Ru(e){var n=nt(e.target);if(n!==null){var t=ft(n);if(t!==null){if(n=t.tag,n===13){if(n=Eu(t),n!==null){e.blockedOn=n,Ou(e.priority,function(){$u(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function dl(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=oi(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);qo=r,t.target.dispatchEvent(r),qo=null}else return n=Br(t),n!==null&&Qi(n),e.blockedOn=t,!1;n.shift()}return!0}function Zs(e,n,t){dl(e)&&t.delete(n)}function ep(){li=!1,Rn!==null&&dl(Rn)&&(Rn=null),Fn!==null&&dl(Fn)&&(Fn=null),Bn!==null&&dl(Bn)&&(Bn=null),jr.forEach(Zs),Cr.forEach(Zs)}function tr(e,n){e.blockedOn===n&&(e.blockedOn=null,li||(li=!0,Ue.unstable_scheduleCallback(Ue.unstable_NormalPriority,ep)))}function Nr(e){function n(l){return tr(l,e)}if(0<br.length){tr(br[0],e);for(var t=1;t<br.length;t++){var r=br[t];r.blockedOn===e&&(r.blockedOn=null)}}for(Rn!==null&&tr(Rn,e),Fn!==null&&tr(Fn,e),Bn!==null&&tr(Bn,e),jr.forEach(n),Cr.forEach(n),t=0;t<Mn.length;t++)r=Mn[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<Mn.length&&(t=Mn[0],t.blockedOn===null);)Ru(t),t.blockedOn===null&&Mn.shift()}var It=_n.ReactCurrentBatchConfig,El=!0;function np(e,n,t,r){var l=K,o=It.transition;It.transition=null;try{K=1,Xi(e,n,t,r)}finally{K=l,It.transition=o}}function tp(e,n,t,r){var l=K,o=It.transition;It.transition=null;try{K=4,Xi(e,n,t,r)}finally{K=l,It.transition=o}}function Xi(e,n,t,r){if(El){var l=oi(e,n,t,r);if(l===null)_o(e,n,r,zl,t),Js(e,r);else if(qf(l,e,n,t,r))r.stopPropagation();else if(Js(e,r),n&4&&-1<bf.indexOf(e)){for(;l!==null;){var o=Br(l);if(o!==null&&Mu(o),o=oi(e,n,t,r),o===null&&_o(e,n,r,zl,t),o===l)break;l=o}l!==null&&r.stopPropagation()}else _o(e,n,r,null,t)}}var zl=null;function oi(e,n,t,r){if(zl=null,e=Vi(r),e=nt(e),e!==null)if(n=ft(e),n===null)e=null;else if(t=n.tag,t===13){if(e=Eu(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return zl=e,null}function Fu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Vf()){case Hi:return 1;case Pu:return 4;case Cl:case Hf:return 16;case Du:return 536870912;default:return 16}default:return 16}}var An=null,Yi=null,fl=null;function Bu(){if(fl)return fl;var e,n=Yi,t=n.length,r,l="value"in An?An.value:An.textContent,o=l.length;for(e=0;e<t&&n[e]===l[e];e++);var i=t-e;for(r=1;r<=i&&n[t-r]===l[o-r];r++);return fl=l.slice(e,1<r?1-r:void 0)}function pl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function qr(){return!0}function bs(){return!1}function He(e){function n(t,r,l,o,i){this._reactName=t,this._targetInst=l,this.type=r,this.nativeEvent=o,this.target=i,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(t=e[s],this[s]=t?t(o):o[s]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?qr:bs,this.isPropagationStopped=bs,this}return oe(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=qr)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=qr)},persist:function(){},isPersistent:qr}),n}var Ht={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Gi=He(Ht),Fr=oe({},Ht,{view:0,detail:0}),rp=He(Fr),xo,ko,rr,Xl=oe({},Fr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ji,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==rr&&(rr&&e.type==="mousemove"?(xo=e.screenX-rr.screenX,ko=e.screenY-rr.screenY):ko=xo=0,rr=e),xo)},movementY:function(e){return"movementY"in e?e.movementY:ko}}),qs=He(Xl),lp=oe({},Xl,{dataTransfer:0}),op=He(lp),ip=oe({},Fr,{relatedTarget:0}),wo=He(ip),sp=oe({},Ht,{animationName:0,elapsedTime:0,pseudoElement:0}),ap=He(sp),up=oe({},Ht,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),cp=He(up),dp=oe({},Ht,{data:0}),ea=He(dp),fp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},pp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},mp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function hp(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=mp[e])?!!n[e]:!1}function Ji(){return hp}var gp=oe({},Fr,{key:function(e){if(e.key){var n=fp[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=pl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?pp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ji,charCode:function(e){return e.type==="keypress"?pl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?pl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),vp=He(gp),yp=oe({},Xl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),na=He(yp),xp=oe({},Fr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ji}),kp=He(xp),wp=oe({},Ht,{propertyName:0,elapsedTime:0,pseudoElement:0}),Sp=He(wp),jp=oe({},Xl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Cp=He(jp),Np=[9,13,27,32],Zi=Cn&&"CompositionEvent"in window,pr=null;Cn&&"documentMode"in document&&(pr=document.documentMode);var Ep=Cn&&"TextEvent"in window&&!pr,Wu=Cn&&(!Zi||pr&&8<pr&&11>=pr),ta=" ",ra=!1;function Uu(e,n){switch(e){case"keyup":return Np.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Vu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var kt=!1;function zp(e,n){switch(e){case"compositionend":return Vu(n);case"keypress":return n.which!==32?null:(ra=!0,ta);case"textInput":return e=n.data,e===ta&&ra?null:e;default:return null}}function _p(e,n){if(kt)return e==="compositionend"||!Zi&&Uu(e,n)?(e=Bu(),fl=Yi=An=null,kt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Wu&&n.locale!=="ko"?null:n.data;default:return null}}var Lp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function la(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Lp[e.type]:n==="textarea"}function Hu(e,n,t,r){wu(r),n=_l(n,"onChange"),0<n.length&&(t=new Gi("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var mr=null,Er=null;function Pp(e){nc(e,0)}function Yl(e){var n=jt(e);if(mu(n))return e}function Dp(e,n){if(e==="change")return n}var Ku=!1;if(Cn){var So;if(Cn){var jo="oninput"in document;if(!jo){var oa=document.createElement("div");oa.setAttribute("oninput","return;"),jo=typeof oa.oninput=="function"}So=jo}else So=!1;Ku=So&&(!document.documentMode||9<document.documentMode)}function ia(){mr&&(mr.detachEvent("onpropertychange",Qu),Er=mr=null)}function Qu(e){if(e.propertyName==="value"&&Yl(Er)){var n=[];Hu(n,Er,e,Vi(e)),Nu(Pp,n)}}function Tp(e,n,t){e==="focusin"?(ia(),mr=n,Er=t,mr.attachEvent("onpropertychange",Qu)):e==="focusout"&&ia()}function Ip(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Yl(Er)}function Mp(e,n){if(e==="click")return Yl(n)}function $p(e,n){if(e==="input"||e==="change")return Yl(n)}function Ap(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var on=typeof Object.is=="function"?Object.is:Ap;function zr(e,n){if(on(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var l=t[r];if(!Wo.call(n,l)||!on(e[l],n[l]))return!1}return!0}function sa(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function aa(e,n){var t=sa(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=sa(t)}}function Xu(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Xu(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Yu(){for(var e=window,n=wl();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=wl(e.document)}return n}function bi(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function Op(e){var n=Yu(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Xu(t.ownerDocument.documentElement,t)){if(r!==null&&bi(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var l=t.textContent.length,o=Math.min(r.start,l);r=r.end===void 0?o:Math.min(r.end,l),!e.extend&&o>r&&(l=r,r=o,o=l),l=aa(t,o);var i=aa(t,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(n=n.createRange(),n.setStart(l.node,l.offset),e.removeAllRanges(),o>r?(e.addRange(n),e.extend(i.node,i.offset)):(n.setEnd(i.node,i.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Rp=Cn&&"documentMode"in document&&11>=document.documentMode,wt=null,ii=null,hr=null,si=!1;function ua(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;si||wt==null||wt!==wl(r)||(r=wt,"selectionStart"in r&&bi(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),hr&&zr(hr,r)||(hr=r,r=_l(ii,"onSelect"),0<r.length&&(n=new Gi("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=wt)))}function el(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var St={animationend:el("Animation","AnimationEnd"),animationiteration:el("Animation","AnimationIteration"),animationstart:el("Animation","AnimationStart"),transitionend:el("Transition","TransitionEnd")},Co={},Gu={};Cn&&(Gu=document.createElement("div").style,"AnimationEvent"in window||(delete St.animationend.animation,delete St.animationiteration.animation,delete St.animationstart.animation),"TransitionEvent"in window||delete St.transitionend.transition);function Gl(e){if(Co[e])return Co[e];if(!St[e])return e;var n=St[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Gu)return Co[e]=n[t];return e}var Ju=Gl("animationend"),Zu=Gl("animationiteration"),bu=Gl("animationstart"),qu=Gl("transitionend"),ec=new Map,ca="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Yn(e,n){ec.set(e,n),dt(n,[e])}for(var No=0;No<ca.length;No++){var Eo=ca[No],Fp=Eo.toLowerCase(),Bp=Eo[0].toUpperCase()+Eo.slice(1);Yn(Fp,"on"+Bp)}Yn(Ju,"onAnimationEnd");Yn(Zu,"onAnimationIteration");Yn(bu,"onAnimationStart");Yn("dblclick","onDoubleClick");Yn("focusin","onFocus");Yn("focusout","onBlur");Yn(qu,"onTransitionEnd");At("onMouseEnter",["mouseout","mouseover"]);At("onMouseLeave",["mouseout","mouseover"]);At("onPointerEnter",["pointerout","pointerover"]);At("onPointerLeave",["pointerout","pointerover"]);dt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));dt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));dt("onBeforeInput",["compositionend","keypress","textInput","paste"]);dt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));dt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));dt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Wp=new Set("cancel close invalid load scroll toggle".split(" ").concat(cr));function da(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,Ff(r,n,void 0,e),e.currentTarget=null}function nc(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],l=r.event;r=r.listeners;e:{var o=void 0;if(n)for(var i=r.length-1;0<=i;i--){var s=r[i],a=s.instance,f=s.currentTarget;if(s=s.listener,a!==o&&l.isPropagationStopped())break e;da(l,s,f),o=a}else for(i=0;i<r.length;i++){if(s=r[i],a=s.instance,f=s.currentTarget,s=s.listener,a!==o&&l.isPropagationStopped())break e;da(l,s,f),o=a}}}if(jl)throw e=ti,jl=!1,ti=null,e}function q(e,n){var t=n[fi];t===void 0&&(t=n[fi]=new Set);var r=e+"__bubble";t.has(r)||(tc(n,e,2,!1),t.add(r))}function zo(e,n,t){var r=0;n&&(r|=4),tc(t,e,r,n)}var nl="_reactListening"+Math.random().toString(36).slice(2);function _r(e){if(!e[nl]){e[nl]=!0,uu.forEach(function(t){t!=="selectionchange"&&(Wp.has(t)||zo(t,!1,e),zo(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[nl]||(n[nl]=!0,zo("selectionchange",!1,n))}}function tc(e,n,t,r){switch(Fu(n)){case 1:var l=np;break;case 4:l=tp;break;default:l=Xi}t=l.bind(null,n,t,e),l=void 0,!ni||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(n,t,{capture:!0,passive:l}):e.addEventListener(n,t,!0):l!==void 0?e.addEventListener(n,t,{passive:l}):e.addEventListener(n,t,!1)}function _o(e,n,t,r,l){var o=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var s=r.stateNode.containerInfo;if(s===l||s.nodeType===8&&s.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var a=i.tag;if((a===3||a===4)&&(a=i.stateNode.containerInfo,a===l||a.nodeType===8&&a.parentNode===l))return;i=i.return}for(;s!==null;){if(i=nt(s),i===null)return;if(a=i.tag,a===5||a===6){r=o=i;continue e}s=s.parentNode}}r=r.return}Nu(function(){var f=o,y=Vi(t),x=[];e:{var v=ec.get(e);if(v!==void 0){var N=Gi,w=e;switch(e){case"keypress":if(pl(t)===0)break e;case"keydown":case"keyup":N=vp;break;case"focusin":w="focus",N=wo;break;case"focusout":w="blur",N=wo;break;case"beforeblur":case"afterblur":N=wo;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":N=qs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":N=op;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":N=kp;break;case Ju:case Zu:case bu:N=ap;break;case qu:N=Sp;break;case"scroll":N=rp;break;case"wheel":N=Cp;break;case"copy":case"cut":case"paste":N=cp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":N=na}var C=(n&4)!==0,R=!C&&e==="scroll",p=C?v!==null?v+"Capture":null:v;C=[];for(var d=f,m;d!==null;){m=d;var S=m.stateNode;if(m.tag===5&&S!==null&&(m=S,p!==null&&(S=Sr(d,p),S!=null&&C.push(Lr(d,S,m)))),R)break;d=d.return}0<C.length&&(v=new N(v,w,null,t,y),x.push({event:v,listeners:C}))}}if(!(n&7)){e:{if(v=e==="mouseover"||e==="pointerover",N=e==="mouseout"||e==="pointerout",v&&t!==qo&&(w=t.relatedTarget||t.fromElement)&&(nt(w)||w[Nn]))break e;if((N||v)&&(v=y.window===y?y:(v=y.ownerDocument)?v.defaultView||v.parentWindow:window,N?(w=t.relatedTarget||t.toElement,N=f,w=w?nt(w):null,w!==null&&(R=ft(w),w!==R||w.tag!==5&&w.tag!==6)&&(w=null)):(N=null,w=f),N!==w)){if(C=qs,S="onMouseLeave",p="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(C=na,S="onPointerLeave",p="onPointerEnter",d="pointer"),R=N==null?v:jt(N),m=w==null?v:jt(w),v=new C(S,d+"leave",N,t,y),v.target=R,v.relatedTarget=m,S=null,nt(y)===f&&(C=new C(p,d+"enter",w,t,y),C.target=m,C.relatedTarget=R,S=C),R=S,N&&w)n:{for(C=N,p=w,d=0,m=C;m;m=vt(m))d++;for(m=0,S=p;S;S=vt(S))m++;for(;0<d-m;)C=vt(C),d--;for(;0<m-d;)p=vt(p),m--;for(;d--;){if(C===p||p!==null&&C===p.alternate)break n;C=vt(C),p=vt(p)}C=null}else C=null;N!==null&&fa(x,v,N,C,!1),w!==null&&R!==null&&fa(x,R,w,C,!0)}}e:{if(v=f?jt(f):window,N=v.nodeName&&v.nodeName.toLowerCase(),N==="select"||N==="input"&&v.type==="file")var _=Dp;else if(la(v))if(Ku)_=$p;else{_=Ip;var D=Tp}else(N=v.nodeName)&&N.toLowerCase()==="input"&&(v.type==="checkbox"||v.type==="radio")&&(_=Mp);if(_&&(_=_(e,f))){Hu(x,_,t,y);break e}D&&D(e,v,f),e==="focusout"&&(D=v._wrapperState)&&D.controlled&&v.type==="number"&&Yo(v,"number",v.value)}switch(D=f?jt(f):window,e){case"focusin":(la(D)||D.contentEditable==="true")&&(wt=D,ii=f,hr=null);break;case"focusout":hr=ii=wt=null;break;case"mousedown":si=!0;break;case"contextmenu":case"mouseup":case"dragend":si=!1,ua(x,t,y);break;case"selectionchange":if(Rp)break;case"keydown":case"keyup":ua(x,t,y)}var T;if(Zi)e:{switch(e){case"compositionstart":var I="onCompositionStart";break e;case"compositionend":I="onCompositionEnd";break e;case"compositionupdate":I="onCompositionUpdate";break e}I=void 0}else kt?Uu(e,t)&&(I="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(I="onCompositionStart");I&&(Wu&&t.locale!=="ko"&&(kt||I!=="onCompositionStart"?I==="onCompositionEnd"&&kt&&(T=Bu()):(An=y,Yi="value"in An?An.value:An.textContent,kt=!0)),D=_l(f,I),0<D.length&&(I=new ea(I,e,null,t,y),x.push({event:I,listeners:D}),T?I.data=T:(T=Vu(t),T!==null&&(I.data=T)))),(T=Ep?zp(e,t):_p(e,t))&&(f=_l(f,"onBeforeInput"),0<f.length&&(y=new ea("onBeforeInput","beforeinput",null,t,y),x.push({event:y,listeners:f}),y.data=T))}nc(x,n)})}function Lr(e,n,t){return{instance:e,listener:n,currentTarget:t}}function _l(e,n){for(var t=n+"Capture",r=[];e!==null;){var l=e,o=l.stateNode;l.tag===5&&o!==null&&(l=o,o=Sr(e,t),o!=null&&r.unshift(Lr(e,o,l)),o=Sr(e,n),o!=null&&r.push(Lr(e,o,l))),e=e.return}return r}function vt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function fa(e,n,t,r,l){for(var o=n._reactName,i=[];t!==null&&t!==r;){var s=t,a=s.alternate,f=s.stateNode;if(a!==null&&a===r)break;s.tag===5&&f!==null&&(s=f,l?(a=Sr(t,o),a!=null&&i.unshift(Lr(t,a,s))):l||(a=Sr(t,o),a!=null&&i.push(Lr(t,a,s)))),t=t.return}i.length!==0&&e.push({event:n,listeners:i})}var Up=/\r\n?/g,Vp=/\u0000|\uFFFD/g;function pa(e){return(typeof e=="string"?e:""+e).replace(Up,`
`).replace(Vp,"")}function tl(e,n,t){if(n=pa(n),pa(e)!==n&&t)throw Error(j(425))}function Ll(){}var ai=null,ui=null;function ci(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var di=typeof setTimeout=="function"?setTimeout:void 0,Hp=typeof clearTimeout=="function"?clearTimeout:void 0,ma=typeof Promise=="function"?Promise:void 0,Kp=typeof queueMicrotask=="function"?queueMicrotask:typeof ma<"u"?function(e){return ma.resolve(null).then(e).catch(Qp)}:di;function Qp(e){setTimeout(function(){throw e})}function Lo(e,n){var t=n,r=0;do{var l=t.nextSibling;if(e.removeChild(t),l&&l.nodeType===8)if(t=l.data,t==="/$"){if(r===0){e.removeChild(l),Nr(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=l}while(t);Nr(n)}function Wn(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function ha(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var Kt=Math.random().toString(36).slice(2),mn="__reactFiber$"+Kt,Pr="__reactProps$"+Kt,Nn="__reactContainer$"+Kt,fi="__reactEvents$"+Kt,Xp="__reactListeners$"+Kt,Yp="__reactHandles$"+Kt;function nt(e){var n=e[mn];if(n)return n;for(var t=e.parentNode;t;){if(n=t[Nn]||t[mn]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=ha(e);e!==null;){if(t=e[mn])return t;e=ha(e)}return n}e=t,t=e.parentNode}return null}function Br(e){return e=e[mn]||e[Nn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function jt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(j(33))}function Jl(e){return e[Pr]||null}var pi=[],Ct=-1;function Gn(e){return{current:e}}function ee(e){0>Ct||(e.current=pi[Ct],pi[Ct]=null,Ct--)}function G(e,n){Ct++,pi[Ct]=e.current,e.current=n}var Xn={},Ee=Gn(Xn),Ae=Gn(!1),it=Xn;function Ot(e,n){var t=e.type.contextTypes;if(!t)return Xn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var l={},o;for(o in t)l[o]=n[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=l),l}function Oe(e){return e=e.childContextTypes,e!=null}function Pl(){ee(Ae),ee(Ee)}function ga(e,n,t){if(Ee.current!==Xn)throw Error(j(168));G(Ee,n),G(Ae,t)}function rc(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var l in r)if(!(l in n))throw Error(j(108,Tf(e)||"Unknown",l));return oe({},t,r)}function Dl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Xn,it=Ee.current,G(Ee,e),G(Ae,Ae.current),!0}function va(e,n,t){var r=e.stateNode;if(!r)throw Error(j(169));t?(e=rc(e,n,it),r.__reactInternalMemoizedMergedChildContext=e,ee(Ae),ee(Ee),G(Ee,e)):ee(Ae),G(Ae,t)}var kn=null,Zl=!1,Po=!1;function lc(e){kn===null?kn=[e]:kn.push(e)}function Gp(e){Zl=!0,lc(e)}function Jn(){if(!Po&&kn!==null){Po=!0;var e=0,n=K;try{var t=kn;for(K=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}kn=null,Zl=!1}catch(l){throw kn!==null&&(kn=kn.slice(e+1)),Lu(Hi,Jn),l}finally{K=n,Po=!1}}return null}var Nt=[],Et=0,Tl=null,Il=0,Qe=[],Xe=0,st=null,wn=1,Sn="";function qn(e,n){Nt[Et++]=Il,Nt[Et++]=Tl,Tl=e,Il=n}function oc(e,n,t){Qe[Xe++]=wn,Qe[Xe++]=Sn,Qe[Xe++]=st,st=e;var r=wn;e=Sn;var l=32-rn(r)-1;r&=~(1<<l),t+=1;var o=32-rn(n)+l;if(30<o){var i=l-l%5;o=(r&(1<<i)-1).toString(32),r>>=i,l-=i,wn=1<<32-rn(n)+l|t<<l|r,Sn=o+e}else wn=1<<o|t<<l|r,Sn=e}function qi(e){e.return!==null&&(qn(e,1),oc(e,1,0))}function es(e){for(;e===Tl;)Tl=Nt[--Et],Nt[Et]=null,Il=Nt[--Et],Nt[Et]=null;for(;e===st;)st=Qe[--Xe],Qe[Xe]=null,Sn=Qe[--Xe],Qe[Xe]=null,wn=Qe[--Xe],Qe[Xe]=null}var We=null,Be=null,te=!1,tn=null;function ic(e,n){var t=Ye(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function ya(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,We=e,Be=Wn(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,We=e,Be=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=st!==null?{id:wn,overflow:Sn}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=Ye(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,We=e,Be=null,!0):!1;default:return!1}}function mi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function hi(e){if(te){var n=Be;if(n){var t=n;if(!ya(e,n)){if(mi(e))throw Error(j(418));n=Wn(t.nextSibling);var r=We;n&&ya(e,n)?ic(r,t):(e.flags=e.flags&-4097|2,te=!1,We=e)}}else{if(mi(e))throw Error(j(418));e.flags=e.flags&-4097|2,te=!1,We=e}}}function xa(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;We=e}function rl(e){if(e!==We)return!1;if(!te)return xa(e),te=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!ci(e.type,e.memoizedProps)),n&&(n=Be)){if(mi(e))throw sc(),Error(j(418));for(;n;)ic(e,n),n=Wn(n.nextSibling)}if(xa(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){Be=Wn(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}Be=null}}else Be=We?Wn(e.stateNode.nextSibling):null;return!0}function sc(){for(var e=Be;e;)e=Wn(e.nextSibling)}function Rt(){Be=We=null,te=!1}function ns(e){tn===null?tn=[e]:tn.push(e)}var Jp=_n.ReactCurrentBatchConfig;function lr(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(j(309));var r=t.stateNode}if(!r)throw Error(j(147,e));var l=r,o=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===o?n.ref:(n=function(i){var s=l.refs;i===null?delete s[o]:s[o]=i},n._stringRef=o,n)}if(typeof e!="string")throw Error(j(284));if(!t._owner)throw Error(j(290,e))}return e}function ll(e,n){throw e=Object.prototype.toString.call(n),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function ka(e){var n=e._init;return n(e._payload)}function ac(e){function n(p,d){if(e){var m=p.deletions;m===null?(p.deletions=[d],p.flags|=16):m.push(d)}}function t(p,d){if(!e)return null;for(;d!==null;)n(p,d),d=d.sibling;return null}function r(p,d){for(p=new Map;d!==null;)d.key!==null?p.set(d.key,d):p.set(d.index,d),d=d.sibling;return p}function l(p,d){return p=Kn(p,d),p.index=0,p.sibling=null,p}function o(p,d,m){return p.index=m,e?(m=p.alternate,m!==null?(m=m.index,m<d?(p.flags|=2,d):m):(p.flags|=2,d)):(p.flags|=1048576,d)}function i(p){return e&&p.alternate===null&&(p.flags|=2),p}function s(p,d,m,S){return d===null||d.tag!==6?(d=Oo(m,p.mode,S),d.return=p,d):(d=l(d,m),d.return=p,d)}function a(p,d,m,S){var _=m.type;return _===xt?y(p,d,m.props.children,S,m.key):d!==null&&(d.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Tn&&ka(_)===d.type)?(S=l(d,m.props),S.ref=lr(p,d,m),S.return=p,S):(S=kl(m.type,m.key,m.props,null,p.mode,S),S.ref=lr(p,d,m),S.return=p,S)}function f(p,d,m,S){return d===null||d.tag!==4||d.stateNode.containerInfo!==m.containerInfo||d.stateNode.implementation!==m.implementation?(d=Ro(m,p.mode,S),d.return=p,d):(d=l(d,m.children||[]),d.return=p,d)}function y(p,d,m,S,_){return d===null||d.tag!==7?(d=ot(m,p.mode,S,_),d.return=p,d):(d=l(d,m),d.return=p,d)}function x(p,d,m){if(typeof d=="string"&&d!==""||typeof d=="number")return d=Oo(""+d,p.mode,m),d.return=p,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case Xr:return m=kl(d.type,d.key,d.props,null,p.mode,m),m.ref=lr(p,null,d),m.return=p,m;case yt:return d=Ro(d,p.mode,m),d.return=p,d;case Tn:var S=d._init;return x(p,S(d._payload),m)}if(ar(d)||qt(d))return d=ot(d,p.mode,m,null),d.return=p,d;ll(p,d)}return null}function v(p,d,m,S){var _=d!==null?d.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return _!==null?null:s(p,d,""+m,S);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Xr:return m.key===_?a(p,d,m,S):null;case yt:return m.key===_?f(p,d,m,S):null;case Tn:return _=m._init,v(p,d,_(m._payload),S)}if(ar(m)||qt(m))return _!==null?null:y(p,d,m,S,null);ll(p,m)}return null}function N(p,d,m,S,_){if(typeof S=="string"&&S!==""||typeof S=="number")return p=p.get(m)||null,s(d,p,""+S,_);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Xr:return p=p.get(S.key===null?m:S.key)||null,a(d,p,S,_);case yt:return p=p.get(S.key===null?m:S.key)||null,f(d,p,S,_);case Tn:var D=S._init;return N(p,d,m,D(S._payload),_)}if(ar(S)||qt(S))return p=p.get(m)||null,y(d,p,S,_,null);ll(d,S)}return null}function w(p,d,m,S){for(var _=null,D=null,T=d,I=d=0,Q=null;T!==null&&I<m.length;I++){T.index>I?(Q=T,T=null):Q=T.sibling;var F=v(p,T,m[I],S);if(F===null){T===null&&(T=Q);break}e&&T&&F.alternate===null&&n(p,T),d=o(F,d,I),D===null?_=F:D.sibling=F,D=F,T=Q}if(I===m.length)return t(p,T),te&&qn(p,I),_;if(T===null){for(;I<m.length;I++)T=x(p,m[I],S),T!==null&&(d=o(T,d,I),D===null?_=T:D.sibling=T,D=T);return te&&qn(p,I),_}for(T=r(p,T);I<m.length;I++)Q=N(T,p,I,m[I],S),Q!==null&&(e&&Q.alternate!==null&&T.delete(Q.key===null?I:Q.key),d=o(Q,d,I),D===null?_=Q:D.sibling=Q,D=Q);return e&&T.forEach(function(fe){return n(p,fe)}),te&&qn(p,I),_}function C(p,d,m,S){var _=qt(m);if(typeof _!="function")throw Error(j(150));if(m=_.call(m),m==null)throw Error(j(151));for(var D=_=null,T=d,I=d=0,Q=null,F=m.next();T!==null&&!F.done;I++,F=m.next()){T.index>I?(Q=T,T=null):Q=T.sibling;var fe=v(p,T,F.value,S);if(fe===null){T===null&&(T=Q);break}e&&T&&fe.alternate===null&&n(p,T),d=o(fe,d,I),D===null?_=fe:D.sibling=fe,D=fe,T=Q}if(F.done)return t(p,T),te&&qn(p,I),_;if(T===null){for(;!F.done;I++,F=m.next())F=x(p,F.value,S),F!==null&&(d=o(F,d,I),D===null?_=F:D.sibling=F,D=F);return te&&qn(p,I),_}for(T=r(p,T);!F.done;I++,F=m.next())F=N(T,p,I,F.value,S),F!==null&&(e&&F.alternate!==null&&T.delete(F.key===null?I:F.key),d=o(F,d,I),D===null?_=F:D.sibling=F,D=F);return e&&T.forEach(function(ve){return n(p,ve)}),te&&qn(p,I),_}function R(p,d,m,S){if(typeof m=="object"&&m!==null&&m.type===xt&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Xr:e:{for(var _=m.key,D=d;D!==null;){if(D.key===_){if(_=m.type,_===xt){if(D.tag===7){t(p,D.sibling),d=l(D,m.props.children),d.return=p,p=d;break e}}else if(D.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Tn&&ka(_)===D.type){t(p,D.sibling),d=l(D,m.props),d.ref=lr(p,D,m),d.return=p,p=d;break e}t(p,D);break}else n(p,D);D=D.sibling}m.type===xt?(d=ot(m.props.children,p.mode,S,m.key),d.return=p,p=d):(S=kl(m.type,m.key,m.props,null,p.mode,S),S.ref=lr(p,d,m),S.return=p,p=S)}return i(p);case yt:e:{for(D=m.key;d!==null;){if(d.key===D)if(d.tag===4&&d.stateNode.containerInfo===m.containerInfo&&d.stateNode.implementation===m.implementation){t(p,d.sibling),d=l(d,m.children||[]),d.return=p,p=d;break e}else{t(p,d);break}else n(p,d);d=d.sibling}d=Ro(m,p.mode,S),d.return=p,p=d}return i(p);case Tn:return D=m._init,R(p,d,D(m._payload),S)}if(ar(m))return w(p,d,m,S);if(qt(m))return C(p,d,m,S);ll(p,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,d!==null&&d.tag===6?(t(p,d.sibling),d=l(d,m),d.return=p,p=d):(t(p,d),d=Oo(m,p.mode,S),d.return=p,p=d),i(p)):t(p,d)}return R}var Ft=ac(!0),uc=ac(!1),Ml=Gn(null),$l=null,zt=null,ts=null;function rs(){ts=zt=$l=null}function ls(e){var n=Ml.current;ee(Ml),e._currentValue=n}function gi(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function Mt(e,n){$l=e,ts=zt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&($e=!0),e.firstContext=null)}function Je(e){var n=e._currentValue;if(ts!==e)if(e={context:e,memoizedValue:n,next:null},zt===null){if($l===null)throw Error(j(308));zt=e,$l.dependencies={lanes:0,firstContext:e}}else zt=zt.next=e;return n}var tt=null;function os(e){tt===null?tt=[e]:tt.push(e)}function cc(e,n,t,r){var l=n.interleaved;return l===null?(t.next=t,os(n)):(t.next=l.next,l.next=t),n.interleaved=t,En(e,r)}function En(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var In=!1;function is(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function dc(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function jn(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function Un(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,H&2){var l=r.pending;return l===null?n.next=n:(n.next=l.next,l.next=n),r.pending=n,En(e,t)}return l=r.interleaved,l===null?(n.next=n,os(r)):(n.next=l.next,l.next=n),r.interleaved=n,En(e,t)}function ml(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Ki(e,t)}}function wa(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var l=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var i={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};o===null?l=o=i:o=o.next=i,t=t.next}while(t!==null);o===null?l=o=n:o=o.next=n}else l=o=n;t={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function Al(e,n,t,r){var l=e.updateQueue;In=!1;var o=l.firstBaseUpdate,i=l.lastBaseUpdate,s=l.shared.pending;if(s!==null){l.shared.pending=null;var a=s,f=a.next;a.next=null,i===null?o=f:i.next=f,i=a;var y=e.alternate;y!==null&&(y=y.updateQueue,s=y.lastBaseUpdate,s!==i&&(s===null?y.firstBaseUpdate=f:s.next=f,y.lastBaseUpdate=a))}if(o!==null){var x=l.baseState;i=0,y=f=a=null,s=o;do{var v=s.lane,N=s.eventTime;if((r&v)===v){y!==null&&(y=y.next={eventTime:N,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var w=e,C=s;switch(v=n,N=t,C.tag){case 1:if(w=C.payload,typeof w=="function"){x=w.call(N,x,v);break e}x=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=C.payload,v=typeof w=="function"?w.call(N,x,v):w,v==null)break e;x=oe({},x,v);break e;case 2:In=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,v=l.effects,v===null?l.effects=[s]:v.push(s))}else N={eventTime:N,lane:v,tag:s.tag,payload:s.payload,callback:s.callback,next:null},y===null?(f=y=N,a=x):y=y.next=N,i|=v;if(s=s.next,s===null){if(s=l.shared.pending,s===null)break;v=s,s=v.next,v.next=null,l.lastBaseUpdate=v,l.shared.pending=null}}while(!0);if(y===null&&(a=x),l.baseState=a,l.firstBaseUpdate=f,l.lastBaseUpdate=y,n=l.shared.interleaved,n!==null){l=n;do i|=l.lane,l=l.next;while(l!==n)}else o===null&&(l.shared.lanes=0);ut|=i,e.lanes=i,e.memoizedState=x}}function Sa(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],l=r.callback;if(l!==null){if(r.callback=null,r=t,typeof l!="function")throw Error(j(191,l));l.call(r)}}}var Wr={},gn=Gn(Wr),Dr=Gn(Wr),Tr=Gn(Wr);function rt(e){if(e===Wr)throw Error(j(174));return e}function ss(e,n){switch(G(Tr,n),G(Dr,e),G(gn,Wr),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:Jo(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=Jo(n,e)}ee(gn),G(gn,n)}function Bt(){ee(gn),ee(Dr),ee(Tr)}function fc(e){rt(Tr.current);var n=rt(gn.current),t=Jo(n,e.type);n!==t&&(G(Dr,e),G(gn,t))}function as(e){Dr.current===e&&(ee(gn),ee(Dr))}var re=Gn(0);function Ol(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Do=[];function us(){for(var e=0;e<Do.length;e++)Do[e]._workInProgressVersionPrimary=null;Do.length=0}var hl=_n.ReactCurrentDispatcher,To=_n.ReactCurrentBatchConfig,at=0,le=null,ce=null,he=null,Rl=!1,gr=!1,Ir=0,Zp=0;function je(){throw Error(j(321))}function cs(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!on(e[t],n[t]))return!1;return!0}function ds(e,n,t,r,l,o){if(at=o,le=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,hl.current=e===null||e.memoizedState===null?nm:tm,e=t(r,l),gr){o=0;do{if(gr=!1,Ir=0,25<=o)throw Error(j(301));o+=1,he=ce=null,n.updateQueue=null,hl.current=rm,e=t(r,l)}while(gr)}if(hl.current=Fl,n=ce!==null&&ce.next!==null,at=0,he=ce=le=null,Rl=!1,n)throw Error(j(300));return e}function fs(){var e=Ir!==0;return Ir=0,e}function pn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return he===null?le.memoizedState=he=e:he=he.next=e,he}function Ze(){if(ce===null){var e=le.alternate;e=e!==null?e.memoizedState:null}else e=ce.next;var n=he===null?le.memoizedState:he.next;if(n!==null)he=n,ce=e;else{if(e===null)throw Error(j(310));ce=e,e={memoizedState:ce.memoizedState,baseState:ce.baseState,baseQueue:ce.baseQueue,queue:ce.queue,next:null},he===null?le.memoizedState=he=e:he=he.next=e}return he}function Mr(e,n){return typeof n=="function"?n(e):n}function Io(e){var n=Ze(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=ce,l=r.baseQueue,o=t.pending;if(o!==null){if(l!==null){var i=l.next;l.next=o.next,o.next=i}r.baseQueue=l=o,t.pending=null}if(l!==null){o=l.next,r=r.baseState;var s=i=null,a=null,f=o;do{var y=f.lane;if((at&y)===y)a!==null&&(a=a.next={lane:0,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null}),r=f.hasEagerState?f.eagerState:e(r,f.action);else{var x={lane:y,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null};a===null?(s=a=x,i=r):a=a.next=x,le.lanes|=y,ut|=y}f=f.next}while(f!==null&&f!==o);a===null?i=r:a.next=s,on(r,n.memoizedState)||($e=!0),n.memoizedState=r,n.baseState=i,n.baseQueue=a,t.lastRenderedState=r}if(e=t.interleaved,e!==null){l=e;do o=l.lane,le.lanes|=o,ut|=o,l=l.next;while(l!==e)}else l===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function Mo(e){var n=Ze(),t=n.queue;if(t===null)throw Error(j(311));t.lastRenderedReducer=e;var r=t.dispatch,l=t.pending,o=n.memoizedState;if(l!==null){t.pending=null;var i=l=l.next;do o=e(o,i.action),i=i.next;while(i!==l);on(o,n.memoizedState)||($e=!0),n.memoizedState=o,n.baseQueue===null&&(n.baseState=o),t.lastRenderedState=o}return[o,r]}function pc(){}function mc(e,n){var t=le,r=Ze(),l=n(),o=!on(r.memoizedState,l);if(o&&(r.memoizedState=l,$e=!0),r=r.queue,ps(vc.bind(null,t,r,e),[e]),r.getSnapshot!==n||o||he!==null&&he.memoizedState.tag&1){if(t.flags|=2048,$r(9,gc.bind(null,t,r,l,n),void 0,null),ge===null)throw Error(j(349));at&30||hc(t,n,l)}return l}function hc(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=le.updateQueue,n===null?(n={lastEffect:null,stores:null},le.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function gc(e,n,t,r){n.value=t,n.getSnapshot=r,yc(n)&&xc(e)}function vc(e,n,t){return t(function(){yc(n)&&xc(e)})}function yc(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!on(e,t)}catch{return!0}}function xc(e){var n=En(e,1);n!==null&&ln(n,e,1,-1)}function ja(e){var n=pn();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Mr,lastRenderedState:e},n.queue=e,e=e.dispatch=em.bind(null,le,e),[n.memoizedState,e]}function $r(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=le.updateQueue,n===null?(n={lastEffect:null,stores:null},le.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function kc(){return Ze().memoizedState}function gl(e,n,t,r){var l=pn();le.flags|=e,l.memoizedState=$r(1|n,t,void 0,r===void 0?null:r)}function bl(e,n,t,r){var l=Ze();r=r===void 0?null:r;var o=void 0;if(ce!==null){var i=ce.memoizedState;if(o=i.destroy,r!==null&&cs(r,i.deps)){l.memoizedState=$r(n,t,o,r);return}}le.flags|=e,l.memoizedState=$r(1|n,t,o,r)}function Ca(e,n){return gl(8390656,8,e,n)}function ps(e,n){return bl(2048,8,e,n)}function wc(e,n){return bl(4,2,e,n)}function Sc(e,n){return bl(4,4,e,n)}function jc(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Cc(e,n,t){return t=t!=null?t.concat([e]):null,bl(4,4,jc.bind(null,n,e),t)}function ms(){}function Nc(e,n){var t=Ze();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&cs(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function Ec(e,n){var t=Ze();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&cs(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function zc(e,n,t){return at&21?(on(t,n)||(t=Tu(),le.lanes|=t,ut|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,$e=!0),e.memoizedState=t)}function bp(e,n){var t=K;K=t!==0&&4>t?t:4,e(!0);var r=To.transition;To.transition={};try{e(!1),n()}finally{K=t,To.transition=r}}function _c(){return Ze().memoizedState}function qp(e,n,t){var r=Hn(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},Lc(e))Pc(n,t);else if(t=cc(e,n,t,r),t!==null){var l=Le();ln(t,e,r,l),Dc(t,n,r)}}function em(e,n,t){var r=Hn(e),l={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(Lc(e))Pc(n,l);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=n.lastRenderedReducer,o!==null))try{var i=n.lastRenderedState,s=o(i,t);if(l.hasEagerState=!0,l.eagerState=s,on(s,i)){var a=n.interleaved;a===null?(l.next=l,os(n)):(l.next=a.next,a.next=l),n.interleaved=l;return}}catch{}finally{}t=cc(e,n,l,r),t!==null&&(l=Le(),ln(t,e,r,l),Dc(t,n,r))}}function Lc(e){var n=e.alternate;return e===le||n!==null&&n===le}function Pc(e,n){gr=Rl=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function Dc(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Ki(e,t)}}var Fl={readContext:Je,useCallback:je,useContext:je,useEffect:je,useImperativeHandle:je,useInsertionEffect:je,useLayoutEffect:je,useMemo:je,useReducer:je,useRef:je,useState:je,useDebugValue:je,useDeferredValue:je,useTransition:je,useMutableSource:je,useSyncExternalStore:je,useId:je,unstable_isNewReconciler:!1},nm={readContext:Je,useCallback:function(e,n){return pn().memoizedState=[e,n===void 0?null:n],e},useContext:Je,useEffect:Ca,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,gl(4194308,4,jc.bind(null,n,e),t)},useLayoutEffect:function(e,n){return gl(4194308,4,e,n)},useInsertionEffect:function(e,n){return gl(4,2,e,n)},useMemo:function(e,n){var t=pn();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=pn();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=qp.bind(null,le,e),[r.memoizedState,e]},useRef:function(e){var n=pn();return e={current:e},n.memoizedState=e},useState:ja,useDebugValue:ms,useDeferredValue:function(e){return pn().memoizedState=e},useTransition:function(){var e=ja(!1),n=e[0];return e=bp.bind(null,e[1]),pn().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=le,l=pn();if(te){if(t===void 0)throw Error(j(407));t=t()}else{if(t=n(),ge===null)throw Error(j(349));at&30||hc(r,n,t)}l.memoizedState=t;var o={value:t,getSnapshot:n};return l.queue=o,Ca(vc.bind(null,r,o,e),[e]),r.flags|=2048,$r(9,gc.bind(null,r,o,t,n),void 0,null),t},useId:function(){var e=pn(),n=ge.identifierPrefix;if(te){var t=Sn,r=wn;t=(r&~(1<<32-rn(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=Ir++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=Zp++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},tm={readContext:Je,useCallback:Nc,useContext:Je,useEffect:ps,useImperativeHandle:Cc,useInsertionEffect:wc,useLayoutEffect:Sc,useMemo:Ec,useReducer:Io,useRef:kc,useState:function(){return Io(Mr)},useDebugValue:ms,useDeferredValue:function(e){var n=Ze();return zc(n,ce.memoizedState,e)},useTransition:function(){var e=Io(Mr)[0],n=Ze().memoizedState;return[e,n]},useMutableSource:pc,useSyncExternalStore:mc,useId:_c,unstable_isNewReconciler:!1},rm={readContext:Je,useCallback:Nc,useContext:Je,useEffect:ps,useImperativeHandle:Cc,useInsertionEffect:wc,useLayoutEffect:Sc,useMemo:Ec,useReducer:Mo,useRef:kc,useState:function(){return Mo(Mr)},useDebugValue:ms,useDeferredValue:function(e){var n=Ze();return ce===null?n.memoizedState=e:zc(n,ce.memoizedState,e)},useTransition:function(){var e=Mo(Mr)[0],n=Ze().memoizedState;return[e,n]},useMutableSource:pc,useSyncExternalStore:mc,useId:_c,unstable_isNewReconciler:!1};function en(e,n){if(e&&e.defaultProps){n=oe({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}function vi(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:oe({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var ql={isMounted:function(e){return(e=e._reactInternals)?ft(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=Le(),l=Hn(e),o=jn(r,l);o.payload=n,t!=null&&(o.callback=t),n=Un(e,o,l),n!==null&&(ln(n,e,l,r),ml(n,e,l))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=Le(),l=Hn(e),o=jn(r,l);o.tag=1,o.payload=n,t!=null&&(o.callback=t),n=Un(e,o,l),n!==null&&(ln(n,e,l,r),ml(n,e,l))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=Le(),r=Hn(e),l=jn(t,r);l.tag=2,n!=null&&(l.callback=n),n=Un(e,l,r),n!==null&&(ln(n,e,r,t),ml(n,e,r))}};function Na(e,n,t,r,l,o,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,i):n.prototype&&n.prototype.isPureReactComponent?!zr(t,r)||!zr(l,o):!0}function Tc(e,n,t){var r=!1,l=Xn,o=n.contextType;return typeof o=="object"&&o!==null?o=Je(o):(l=Oe(n)?it:Ee.current,r=n.contextTypes,o=(r=r!=null)?Ot(e,l):Xn),n=new n(t,o),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=ql,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=o),n}function Ea(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&ql.enqueueReplaceState(n,n.state,null)}function yi(e,n,t,r){var l=e.stateNode;l.props=t,l.state=e.memoizedState,l.refs={},is(e);var o=n.contextType;typeof o=="object"&&o!==null?l.context=Je(o):(o=Oe(n)?it:Ee.current,l.context=Ot(e,o)),l.state=e.memoizedState,o=n.getDerivedStateFromProps,typeof o=="function"&&(vi(e,n,o,t),l.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(n=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),n!==l.state&&ql.enqueueReplaceState(l,l.state,null),Al(e,t,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Wt(e,n){try{var t="",r=n;do t+=Df(r),r=r.return;while(r);var l=t}catch(o){l=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:n,stack:l,digest:null}}function $o(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function xi(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var lm=typeof WeakMap=="function"?WeakMap:Map;function Ic(e,n,t){t=jn(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){Wl||(Wl=!0,Li=r),xi(e,n)},t}function Mc(e,n,t){t=jn(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=n.value;t.payload=function(){return r(l)},t.callback=function(){xi(e,n)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(t.callback=function(){xi(e,n),typeof r!="function"&&(Vn===null?Vn=new Set([this]):Vn.add(this));var i=n.stack;this.componentDidCatch(n.value,{componentStack:i!==null?i:""})}),t}function za(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new lm;var l=new Set;r.set(n,l)}else l=r.get(n),l===void 0&&(l=new Set,r.set(n,l));l.has(t)||(l.add(t),e=ym.bind(null,e,n,t),n.then(e,e))}function _a(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function La(e,n,t,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=jn(-1,1),n.tag=2,Un(t,n,1))),t.lanes|=1),e)}var om=_n.ReactCurrentOwner,$e=!1;function _e(e,n,t,r){n.child=e===null?uc(n,null,t,r):Ft(n,e.child,t,r)}function Pa(e,n,t,r,l){t=t.render;var o=n.ref;return Mt(n,l),r=ds(e,n,t,r,o,l),t=fs(),e!==null&&!$e?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~l,zn(e,n,l)):(te&&t&&qi(n),n.flags|=1,_e(e,n,r,l),n.child)}function Da(e,n,t,r,l){if(e===null){var o=t.type;return typeof o=="function"&&!Ss(o)&&o.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=o,$c(e,n,o,r,l)):(e=kl(t.type,null,r,n,n.mode,l),e.ref=n.ref,e.return=n,n.child=e)}if(o=e.child,!(e.lanes&l)){var i=o.memoizedProps;if(t=t.compare,t=t!==null?t:zr,t(i,r)&&e.ref===n.ref)return zn(e,n,l)}return n.flags|=1,e=Kn(o,r),e.ref=n.ref,e.return=n,n.child=e}function $c(e,n,t,r,l){if(e!==null){var o=e.memoizedProps;if(zr(o,r)&&e.ref===n.ref)if($e=!1,n.pendingProps=r=o,(e.lanes&l)!==0)e.flags&131072&&($e=!0);else return n.lanes=e.lanes,zn(e,n,l)}return ki(e,n,t,r,l)}function Ac(e,n,t){var r=n.pendingProps,l=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(Lt,Fe),Fe|=t;else{if(!(t&1073741824))return e=o!==null?o.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,G(Lt,Fe),Fe|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:t,G(Lt,Fe),Fe|=r}else o!==null?(r=o.baseLanes|t,n.memoizedState=null):r=t,G(Lt,Fe),Fe|=r;return _e(e,n,l,t),n.child}function Oc(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function ki(e,n,t,r,l){var o=Oe(t)?it:Ee.current;return o=Ot(n,o),Mt(n,l),t=ds(e,n,t,r,o,l),r=fs(),e!==null&&!$e?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~l,zn(e,n,l)):(te&&r&&qi(n),n.flags|=1,_e(e,n,t,l),n.child)}function Ta(e,n,t,r,l){if(Oe(t)){var o=!0;Dl(n)}else o=!1;if(Mt(n,l),n.stateNode===null)vl(e,n),Tc(n,t,r),yi(n,t,r,l),r=!0;else if(e===null){var i=n.stateNode,s=n.memoizedProps;i.props=s;var a=i.context,f=t.contextType;typeof f=="object"&&f!==null?f=Je(f):(f=Oe(t)?it:Ee.current,f=Ot(n,f));var y=t.getDerivedStateFromProps,x=typeof y=="function"||typeof i.getSnapshotBeforeUpdate=="function";x||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==r||a!==f)&&Ea(n,i,r,f),In=!1;var v=n.memoizedState;i.state=v,Al(n,r,i,l),a=n.memoizedState,s!==r||v!==a||Ae.current||In?(typeof y=="function"&&(vi(n,t,y,r),a=n.memoizedState),(s=In||Na(n,t,s,r,v,a,f))?(x||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(n.flags|=4194308)):(typeof i.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=a),i.props=r,i.state=a,i.context=f,r=s):(typeof i.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{i=n.stateNode,dc(e,n),s=n.memoizedProps,f=n.type===n.elementType?s:en(n.type,s),i.props=f,x=n.pendingProps,v=i.context,a=t.contextType,typeof a=="object"&&a!==null?a=Je(a):(a=Oe(t)?it:Ee.current,a=Ot(n,a));var N=t.getDerivedStateFromProps;(y=typeof N=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==x||v!==a)&&Ea(n,i,r,a),In=!1,v=n.memoizedState,i.state=v,Al(n,r,i,l);var w=n.memoizedState;s!==x||v!==w||Ae.current||In?(typeof N=="function"&&(vi(n,t,N,r),w=n.memoizedState),(f=In||Na(n,t,f,r,v,w,a)||!1)?(y||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,w,a),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,w,a)),typeof i.componentDidUpdate=="function"&&(n.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(n.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=w),i.props=r,i.state=w,i.context=a,r=f):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(n.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(n.flags|=1024),r=!1)}return wi(e,n,t,r,o,l)}function wi(e,n,t,r,l,o){Oc(e,n);var i=(n.flags&128)!==0;if(!r&&!i)return l&&va(n,t,!1),zn(e,n,o);r=n.stateNode,om.current=n;var s=i&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&i?(n.child=Ft(n,e.child,null,o),n.child=Ft(n,null,s,o)):_e(e,n,s,o),n.memoizedState=r.state,l&&va(n,t,!0),n.child}function Rc(e){var n=e.stateNode;n.pendingContext?ga(e,n.pendingContext,n.pendingContext!==n.context):n.context&&ga(e,n.context,!1),ss(e,n.containerInfo)}function Ia(e,n,t,r,l){return Rt(),ns(l),n.flags|=256,_e(e,n,t,r),n.child}var Si={dehydrated:null,treeContext:null,retryLane:0};function ji(e){return{baseLanes:e,cachePool:null,transitions:null}}function Fc(e,n,t){var r=n.pendingProps,l=re.current,o=!1,i=(n.flags&128)!==0,s;if((s=i)||(s=e!==null&&e.memoizedState===null?!1:(l&2)!==0),s?(o=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),G(re,l&1),e===null)return hi(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(i=r.children,e=r.fallback,o?(r=n.mode,o=n.child,i={mode:"hidden",children:i},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=i):o=to(i,r,0,null),e=ot(e,r,t,null),o.return=n,e.return=n,o.sibling=e,n.child=o,n.child.memoizedState=ji(t),n.memoizedState=Si,e):hs(n,i));if(l=e.memoizedState,l!==null&&(s=l.dehydrated,s!==null))return im(e,n,i,r,s,l,t);if(o){o=r.fallback,i=n.mode,l=e.child,s=l.sibling;var a={mode:"hidden",children:r.children};return!(i&1)&&n.child!==l?(r=n.child,r.childLanes=0,r.pendingProps=a,n.deletions=null):(r=Kn(l,a),r.subtreeFlags=l.subtreeFlags&14680064),s!==null?o=Kn(s,o):(o=ot(o,i,t,null),o.flags|=2),o.return=n,r.return=n,r.sibling=o,n.child=r,r=o,o=n.child,i=e.child.memoizedState,i=i===null?ji(t):{baseLanes:i.baseLanes|t,cachePool:null,transitions:i.transitions},o.memoizedState=i,o.childLanes=e.childLanes&~t,n.memoizedState=Si,r}return o=e.child,e=o.sibling,r=Kn(o,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function hs(e,n){return n=to({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function ol(e,n,t,r){return r!==null&&ns(r),Ft(n,e.child,null,t),e=hs(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function im(e,n,t,r,l,o,i){if(t)return n.flags&256?(n.flags&=-257,r=$o(Error(j(422))),ol(e,n,i,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(o=r.fallback,l=n.mode,r=to({mode:"visible",children:r.children},l,0,null),o=ot(o,l,i,null),o.flags|=2,r.return=n,o.return=n,r.sibling=o,n.child=r,n.mode&1&&Ft(n,e.child,null,i),n.child.memoizedState=ji(i),n.memoizedState=Si,o);if(!(n.mode&1))return ol(e,n,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var s=r.dgst;return r=s,o=Error(j(419)),r=$o(o,r,void 0),ol(e,n,i,r)}if(s=(i&e.childLanes)!==0,$e||s){if(r=ge,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|i)?0:l,l!==0&&l!==o.retryLane&&(o.retryLane=l,En(e,l),ln(r,e,l,-1))}return ws(),r=$o(Error(j(421))),ol(e,n,i,r)}return l.data==="$?"?(n.flags|=128,n.child=e.child,n=xm.bind(null,e),l._reactRetry=n,null):(e=o.treeContext,Be=Wn(l.nextSibling),We=n,te=!0,tn=null,e!==null&&(Qe[Xe++]=wn,Qe[Xe++]=Sn,Qe[Xe++]=st,wn=e.id,Sn=e.overflow,st=n),n=hs(n,r.children),n.flags|=4096,n)}function Ma(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),gi(e.return,n,t)}function Ao(e,n,t,r,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:l}:(o.isBackwards=n,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=t,o.tailMode=l)}function Bc(e,n,t){var r=n.pendingProps,l=r.revealOrder,o=r.tail;if(_e(e,n,r.children,t),r=re.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ma(e,t,n);else if(e.tag===19)Ma(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(G(re,r),!(n.mode&1))n.memoizedState=null;else switch(l){case"forwards":for(t=n.child,l=null;t!==null;)e=t.alternate,e!==null&&Ol(e)===null&&(l=t),t=t.sibling;t=l,t===null?(l=n.child,n.child=null):(l=t.sibling,t.sibling=null),Ao(n,!1,l,t,o);break;case"backwards":for(t=null,l=n.child,n.child=null;l!==null;){if(e=l.alternate,e!==null&&Ol(e)===null){n.child=l;break}e=l.sibling,l.sibling=t,t=l,l=e}Ao(n,!0,t,null,o);break;case"together":Ao(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function vl(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function zn(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),ut|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(j(153));if(n.child!==null){for(e=n.child,t=Kn(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=Kn(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function sm(e,n,t){switch(n.tag){case 3:Rc(n),Rt();break;case 5:fc(n);break;case 1:Oe(n.type)&&Dl(n);break;case 4:ss(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,l=n.memoizedProps.value;G(Ml,r._currentValue),r._currentValue=l;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(G(re,re.current&1),n.flags|=128,null):t&n.child.childLanes?Fc(e,n,t):(G(re,re.current&1),e=zn(e,n,t),e!==null?e.sibling:null);G(re,re.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return Bc(e,n,t);n.flags|=128}if(l=n.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),G(re,re.current),r)break;return null;case 22:case 23:return n.lanes=0,Ac(e,n,t)}return zn(e,n,t)}var Wc,Ci,Uc,Vc;Wc=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Ci=function(){};Uc=function(e,n,t,r){var l=e.memoizedProps;if(l!==r){e=n.stateNode,rt(gn.current);var o=null;switch(t){case"input":l=Qo(e,l),r=Qo(e,r),o=[];break;case"select":l=oe({},l,{value:void 0}),r=oe({},r,{value:void 0}),o=[];break;case"textarea":l=Go(e,l),r=Go(e,r),o=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Ll)}Zo(t,r);var i;t=null;for(f in l)if(!r.hasOwnProperty(f)&&l.hasOwnProperty(f)&&l[f]!=null)if(f==="style"){var s=l[f];for(i in s)s.hasOwnProperty(i)&&(t||(t={}),t[i]="")}else f!=="dangerouslySetInnerHTML"&&f!=="children"&&f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(kr.hasOwnProperty(f)?o||(o=[]):(o=o||[]).push(f,null));for(f in r){var a=r[f];if(s=l!=null?l[f]:void 0,r.hasOwnProperty(f)&&a!==s&&(a!=null||s!=null))if(f==="style")if(s){for(i in s)!s.hasOwnProperty(i)||a&&a.hasOwnProperty(i)||(t||(t={}),t[i]="");for(i in a)a.hasOwnProperty(i)&&s[i]!==a[i]&&(t||(t={}),t[i]=a[i])}else t||(o||(o=[]),o.push(f,t)),t=a;else f==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,s=s?s.__html:void 0,a!=null&&s!==a&&(o=o||[]).push(f,a)):f==="children"?typeof a!="string"&&typeof a!="number"||(o=o||[]).push(f,""+a):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&(kr.hasOwnProperty(f)?(a!=null&&f==="onScroll"&&q("scroll",e),o||s===a||(o=[])):(o=o||[]).push(f,a))}t&&(o=o||[]).push("style",t);var f=o;(n.updateQueue=f)&&(n.flags|=4)}};Vc=function(e,n,t,r){t!==r&&(n.flags|=4)};function or(e,n){if(!te)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ce(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var l=e.child;l!==null;)t|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)t|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function am(e,n,t){var r=n.pendingProps;switch(es(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ce(n),null;case 1:return Oe(n.type)&&Pl(),Ce(n),null;case 3:return r=n.stateNode,Bt(),ee(Ae),ee(Ee),us(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(rl(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,tn!==null&&(Ti(tn),tn=null))),Ci(e,n),Ce(n),null;case 5:as(n);var l=rt(Tr.current);if(t=n.type,e!==null&&n.stateNode!=null)Uc(e,n,t,r,l),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(j(166));return Ce(n),null}if(e=rt(gn.current),rl(n)){r=n.stateNode,t=n.type;var o=n.memoizedProps;switch(r[mn]=n,r[Pr]=o,e=(n.mode&1)!==0,t){case"dialog":q("cancel",r),q("close",r);break;case"iframe":case"object":case"embed":q("load",r);break;case"video":case"audio":for(l=0;l<cr.length;l++)q(cr[l],r);break;case"source":q("error",r);break;case"img":case"image":case"link":q("error",r),q("load",r);break;case"details":q("toggle",r);break;case"input":Vs(r,o),q("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},q("invalid",r);break;case"textarea":Ks(r,o),q("invalid",r)}Zo(t,o),l=null;for(var i in o)if(o.hasOwnProperty(i)){var s=o[i];i==="children"?typeof s=="string"?r.textContent!==s&&(o.suppressHydrationWarning!==!0&&tl(r.textContent,s,e),l=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(o.suppressHydrationWarning!==!0&&tl(r.textContent,s,e),l=["children",""+s]):kr.hasOwnProperty(i)&&s!=null&&i==="onScroll"&&q("scroll",r)}switch(t){case"input":Yr(r),Hs(r,o,!0);break;case"textarea":Yr(r),Qs(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=Ll)}r=l,n.updateQueue=r,r!==null&&(n.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=vu(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(t,{is:r.is}):(e=i.createElement(t),t==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,t),e[mn]=n,e[Pr]=r,Wc(e,n,!1,!1),n.stateNode=e;e:{switch(i=bo(t,r),t){case"dialog":q("cancel",e),q("close",e),l=r;break;case"iframe":case"object":case"embed":q("load",e),l=r;break;case"video":case"audio":for(l=0;l<cr.length;l++)q(cr[l],e);l=r;break;case"source":q("error",e),l=r;break;case"img":case"image":case"link":q("error",e),q("load",e),l=r;break;case"details":q("toggle",e),l=r;break;case"input":Vs(e,r),l=Qo(e,r),q("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=oe({},r,{value:void 0}),q("invalid",e);break;case"textarea":Ks(e,r),l=Go(e,r),q("invalid",e);break;default:l=r}Zo(t,l),s=l;for(o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="style"?ku(e,a):o==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,a!=null&&yu(e,a)):o==="children"?typeof a=="string"?(t!=="textarea"||a!=="")&&wr(e,a):typeof a=="number"&&wr(e,""+a):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(kr.hasOwnProperty(o)?a!=null&&o==="onScroll"&&q("scroll",e):a!=null&&Fi(e,o,a,i))}switch(t){case"input":Yr(e),Hs(e,r,!1);break;case"textarea":Yr(e),Qs(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Qn(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?Pt(e,!!r.multiple,o,!1):r.defaultValue!=null&&Pt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Ll)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return Ce(n),null;case 6:if(e&&n.stateNode!=null)Vc(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(j(166));if(t=rt(Tr.current),rt(gn.current),rl(n)){if(r=n.stateNode,t=n.memoizedProps,r[mn]=n,(o=r.nodeValue!==t)&&(e=We,e!==null))switch(e.tag){case 3:tl(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&tl(r.nodeValue,t,(e.mode&1)!==0)}o&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[mn]=n,n.stateNode=r}return Ce(n),null;case 13:if(ee(re),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(te&&Be!==null&&n.mode&1&&!(n.flags&128))sc(),Rt(),n.flags|=98560,o=!1;else if(o=rl(n),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(j(318));if(o=n.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(j(317));o[mn]=n}else Rt(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;Ce(n),o=!1}else tn!==null&&(Ti(tn),tn=null),o=!0;if(!o)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||re.current&1?de===0&&(de=3):ws())),n.updateQueue!==null&&(n.flags|=4),Ce(n),null);case 4:return Bt(),Ci(e,n),e===null&&_r(n.stateNode.containerInfo),Ce(n),null;case 10:return ls(n.type._context),Ce(n),null;case 17:return Oe(n.type)&&Pl(),Ce(n),null;case 19:if(ee(re),o=n.memoizedState,o===null)return Ce(n),null;if(r=(n.flags&128)!==0,i=o.rendering,i===null)if(r)or(o,!1);else{if(de!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(i=Ol(e),i!==null){for(n.flags|=128,or(o,!1),r=i.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)o=t,e=r,o.flags&=14680066,i=o.alternate,i===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=i.childLanes,o.lanes=i.lanes,o.child=i.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=i.memoizedProps,o.memoizedState=i.memoizedState,o.updateQueue=i.updateQueue,o.type=i.type,e=i.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return G(re,re.current&1|2),n.child}e=e.sibling}o.tail!==null&&se()>Ut&&(n.flags|=128,r=!0,or(o,!1),n.lanes=4194304)}else{if(!r)if(e=Ol(i),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),or(o,!0),o.tail===null&&o.tailMode==="hidden"&&!i.alternate&&!te)return Ce(n),null}else 2*se()-o.renderingStartTime>Ut&&t!==1073741824&&(n.flags|=128,r=!0,or(o,!1),n.lanes=4194304);o.isBackwards?(i.sibling=n.child,n.child=i):(t=o.last,t!==null?t.sibling=i:n.child=i,o.last=i)}return o.tail!==null?(n=o.tail,o.rendering=n,o.tail=n.sibling,o.renderingStartTime=se(),n.sibling=null,t=re.current,G(re,r?t&1|2:t&1),n):(Ce(n),null);case 22:case 23:return ks(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?Fe&1073741824&&(Ce(n),n.subtreeFlags&6&&(n.flags|=8192)):Ce(n),null;case 24:return null;case 25:return null}throw Error(j(156,n.tag))}function um(e,n){switch(es(n),n.tag){case 1:return Oe(n.type)&&Pl(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Bt(),ee(Ae),ee(Ee),us(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return as(n),null;case 13:if(ee(re),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(j(340));Rt()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return ee(re),null;case 4:return Bt(),null;case 10:return ls(n.type._context),null;case 22:case 23:return ks(),null;case 24:return null;default:return null}}var il=!1,Ne=!1,cm=typeof WeakSet=="function"?WeakSet:Set,P=null;function _t(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){ie(e,n,r)}else t.current=null}function Ni(e,n,t){try{t()}catch(r){ie(e,n,r)}}var $a=!1;function dm(e,n){if(ai=El,e=Yu(),bi(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var l=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var i=0,s=-1,a=-1,f=0,y=0,x=e,v=null;n:for(;;){for(var N;x!==t||l!==0&&x.nodeType!==3||(s=i+l),x!==o||r!==0&&x.nodeType!==3||(a=i+r),x.nodeType===3&&(i+=x.nodeValue.length),(N=x.firstChild)!==null;)v=x,x=N;for(;;){if(x===e)break n;if(v===t&&++f===l&&(s=i),v===o&&++y===r&&(a=i),(N=x.nextSibling)!==null)break;x=v,v=x.parentNode}x=N}t=s===-1||a===-1?null:{start:s,end:a}}else t=null}t=t||{start:0,end:0}}else t=null;for(ui={focusedElem:e,selectionRange:t},El=!1,P=n;P!==null;)if(n=P,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,P=e;else for(;P!==null;){n=P;try{var w=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var C=w.memoizedProps,R=w.memoizedState,p=n.stateNode,d=p.getSnapshotBeforeUpdate(n.elementType===n.type?C:en(n.type,C),R);p.__reactInternalSnapshotBeforeUpdate=d}break;case 3:var m=n.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(S){ie(n,n.return,S)}if(e=n.sibling,e!==null){e.return=n.return,P=e;break}P=n.return}return w=$a,$a=!1,w}function vr(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var o=l.destroy;l.destroy=void 0,o!==void 0&&Ni(n,t,o)}l=l.next}while(l!==r)}}function eo(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function Ei(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function Hc(e){var n=e.alternate;n!==null&&(e.alternate=null,Hc(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[mn],delete n[Pr],delete n[fi],delete n[Xp],delete n[Yp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Kc(e){return e.tag===5||e.tag===3||e.tag===4}function Aa(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Kc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function zi(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=Ll));else if(r!==4&&(e=e.child,e!==null))for(zi(e,n,t),e=e.sibling;e!==null;)zi(e,n,t),e=e.sibling}function _i(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(_i(e,n,t),e=e.sibling;e!==null;)_i(e,n,t),e=e.sibling}var ye=null,nn=!1;function Dn(e,n,t){for(t=t.child;t!==null;)Qc(e,n,t),t=t.sibling}function Qc(e,n,t){if(hn&&typeof hn.onCommitFiberUnmount=="function")try{hn.onCommitFiberUnmount(Ql,t)}catch{}switch(t.tag){case 5:Ne||_t(t,n);case 6:var r=ye,l=nn;ye=null,Dn(e,n,t),ye=r,nn=l,ye!==null&&(nn?(e=ye,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):ye.removeChild(t.stateNode));break;case 18:ye!==null&&(nn?(e=ye,t=t.stateNode,e.nodeType===8?Lo(e.parentNode,t):e.nodeType===1&&Lo(e,t),Nr(e)):Lo(ye,t.stateNode));break;case 4:r=ye,l=nn,ye=t.stateNode.containerInfo,nn=!0,Dn(e,n,t),ye=r,nn=l;break;case 0:case 11:case 14:case 15:if(!Ne&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var o=l,i=o.destroy;o=o.tag,i!==void 0&&(o&2||o&4)&&Ni(t,n,i),l=l.next}while(l!==r)}Dn(e,n,t);break;case 1:if(!Ne&&(_t(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(s){ie(t,n,s)}Dn(e,n,t);break;case 21:Dn(e,n,t);break;case 22:t.mode&1?(Ne=(r=Ne)||t.memoizedState!==null,Dn(e,n,t),Ne=r):Dn(e,n,t);break;default:Dn(e,n,t)}}function Oa(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new cm),n.forEach(function(r){var l=km.bind(null,e,r);t.has(r)||(t.add(r),r.then(l,l))})}}function qe(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var l=t[r];try{var o=e,i=n,s=i;e:for(;s!==null;){switch(s.tag){case 5:ye=s.stateNode,nn=!1;break e;case 3:ye=s.stateNode.containerInfo,nn=!0;break e;case 4:ye=s.stateNode.containerInfo,nn=!0;break e}s=s.return}if(ye===null)throw Error(j(160));Qc(o,i,l),ye=null,nn=!1;var a=l.alternate;a!==null&&(a.return=null),l.return=null}catch(f){ie(l,n,f)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Xc(n,e),n=n.sibling}function Xc(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(qe(n,e),fn(e),r&4){try{vr(3,e,e.return),eo(3,e)}catch(C){ie(e,e.return,C)}try{vr(5,e,e.return)}catch(C){ie(e,e.return,C)}}break;case 1:qe(n,e),fn(e),r&512&&t!==null&&_t(t,t.return);break;case 5:if(qe(n,e),fn(e),r&512&&t!==null&&_t(t,t.return),e.flags&32){var l=e.stateNode;try{wr(l,"")}catch(C){ie(e,e.return,C)}}if(r&4&&(l=e.stateNode,l!=null)){var o=e.memoizedProps,i=t!==null?t.memoizedProps:o,s=e.type,a=e.updateQueue;if(e.updateQueue=null,a!==null)try{s==="input"&&o.type==="radio"&&o.name!=null&&hu(l,o),bo(s,i);var f=bo(s,o);for(i=0;i<a.length;i+=2){var y=a[i],x=a[i+1];y==="style"?ku(l,x):y==="dangerouslySetInnerHTML"?yu(l,x):y==="children"?wr(l,x):Fi(l,y,x,f)}switch(s){case"input":Xo(l,o);break;case"textarea":gu(l,o);break;case"select":var v=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!o.multiple;var N=o.value;N!=null?Pt(l,!!o.multiple,N,!1):v!==!!o.multiple&&(o.defaultValue!=null?Pt(l,!!o.multiple,o.defaultValue,!0):Pt(l,!!o.multiple,o.multiple?[]:"",!1))}l[Pr]=o}catch(C){ie(e,e.return,C)}}break;case 6:if(qe(n,e),fn(e),r&4){if(e.stateNode===null)throw Error(j(162));l=e.stateNode,o=e.memoizedProps;try{l.nodeValue=o}catch(C){ie(e,e.return,C)}}break;case 3:if(qe(n,e),fn(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{Nr(n.containerInfo)}catch(C){ie(e,e.return,C)}break;case 4:qe(n,e),fn(e);break;case 13:qe(n,e),fn(e),l=e.child,l.flags&8192&&(o=l.memoizedState!==null,l.stateNode.isHidden=o,!o||l.alternate!==null&&l.alternate.memoizedState!==null||(ys=se())),r&4&&Oa(e);break;case 22:if(y=t!==null&&t.memoizedState!==null,e.mode&1?(Ne=(f=Ne)||y,qe(n,e),Ne=f):qe(n,e),fn(e),r&8192){if(f=e.memoizedState!==null,(e.stateNode.isHidden=f)&&!y&&e.mode&1)for(P=e,y=e.child;y!==null;){for(x=P=y;P!==null;){switch(v=P,N=v.child,v.tag){case 0:case 11:case 14:case 15:vr(4,v,v.return);break;case 1:_t(v,v.return);var w=v.stateNode;if(typeof w.componentWillUnmount=="function"){r=v,t=v.return;try{n=r,w.props=n.memoizedProps,w.state=n.memoizedState,w.componentWillUnmount()}catch(C){ie(r,t,C)}}break;case 5:_t(v,v.return);break;case 22:if(v.memoizedState!==null){Fa(x);continue}}N!==null?(N.return=v,P=N):Fa(x)}y=y.sibling}e:for(y=null,x=e;;){if(x.tag===5){if(y===null){y=x;try{l=x.stateNode,f?(o=l.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(s=x.stateNode,a=x.memoizedProps.style,i=a!=null&&a.hasOwnProperty("display")?a.display:null,s.style.display=xu("display",i))}catch(C){ie(e,e.return,C)}}}else if(x.tag===6){if(y===null)try{x.stateNode.nodeValue=f?"":x.memoizedProps}catch(C){ie(e,e.return,C)}}else if((x.tag!==22&&x.tag!==23||x.memoizedState===null||x===e)&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===e)break e;for(;x.sibling===null;){if(x.return===null||x.return===e)break e;y===x&&(y=null),x=x.return}y===x&&(y=null),x.sibling.return=x.return,x=x.sibling}}break;case 19:qe(n,e),fn(e),r&4&&Oa(e);break;case 21:break;default:qe(n,e),fn(e)}}function fn(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(Kc(t)){var r=t;break e}t=t.return}throw Error(j(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(wr(l,""),r.flags&=-33);var o=Aa(e);_i(e,o,l);break;case 3:case 4:var i=r.stateNode.containerInfo,s=Aa(e);zi(e,s,i);break;default:throw Error(j(161))}}catch(a){ie(e,e.return,a)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function fm(e,n,t){P=e,Yc(e)}function Yc(e,n,t){for(var r=(e.mode&1)!==0;P!==null;){var l=P,o=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||il;if(!i){var s=l.alternate,a=s!==null&&s.memoizedState!==null||Ne;s=il;var f=Ne;if(il=i,(Ne=a)&&!f)for(P=l;P!==null;)i=P,a=i.child,i.tag===22&&i.memoizedState!==null?Ba(l):a!==null?(a.return=i,P=a):Ba(l);for(;o!==null;)P=o,Yc(o),o=o.sibling;P=l,il=s,Ne=f}Ra(e)}else l.subtreeFlags&8772&&o!==null?(o.return=l,P=o):Ra(e)}}function Ra(e){for(;P!==null;){var n=P;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:Ne||eo(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!Ne)if(t===null)r.componentDidMount();else{var l=n.elementType===n.type?t.memoizedProps:en(n.type,t.memoizedProps);r.componentDidUpdate(l,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=n.updateQueue;o!==null&&Sa(n,o,r);break;case 3:var i=n.updateQueue;if(i!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}Sa(n,i,t)}break;case 5:var s=n.stateNode;if(t===null&&n.flags&4){t=s;var a=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":a.autoFocus&&t.focus();break;case"img":a.src&&(t.src=a.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var f=n.alternate;if(f!==null){var y=f.memoizedState;if(y!==null){var x=y.dehydrated;x!==null&&Nr(x)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}Ne||n.flags&512&&Ei(n)}catch(v){ie(n,n.return,v)}}if(n===e){P=null;break}if(t=n.sibling,t!==null){t.return=n.return,P=t;break}P=n.return}}function Fa(e){for(;P!==null;){var n=P;if(n===e){P=null;break}var t=n.sibling;if(t!==null){t.return=n.return,P=t;break}P=n.return}}function Ba(e){for(;P!==null;){var n=P;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{eo(4,n)}catch(a){ie(n,t,a)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var l=n.return;try{r.componentDidMount()}catch(a){ie(n,l,a)}}var o=n.return;try{Ei(n)}catch(a){ie(n,o,a)}break;case 5:var i=n.return;try{Ei(n)}catch(a){ie(n,i,a)}}}catch(a){ie(n,n.return,a)}if(n===e){P=null;break}var s=n.sibling;if(s!==null){s.return=n.return,P=s;break}P=n.return}}var pm=Math.ceil,Bl=_n.ReactCurrentDispatcher,gs=_n.ReactCurrentOwner,Ge=_n.ReactCurrentBatchConfig,H=0,ge=null,ae=null,xe=0,Fe=0,Lt=Gn(0),de=0,Ar=null,ut=0,no=0,vs=0,yr=null,Me=null,ys=0,Ut=1/0,xn=null,Wl=!1,Li=null,Vn=null,sl=!1,On=null,Ul=0,xr=0,Pi=null,yl=-1,xl=0;function Le(){return H&6?se():yl!==-1?yl:yl=se()}function Hn(e){return e.mode&1?H&2&&xe!==0?xe&-xe:Jp.transition!==null?(xl===0&&(xl=Tu()),xl):(e=K,e!==0||(e=window.event,e=e===void 0?16:Fu(e.type)),e):1}function ln(e,n,t,r){if(50<xr)throw xr=0,Pi=null,Error(j(185));Rr(e,t,r),(!(H&2)||e!==ge)&&(e===ge&&(!(H&2)&&(no|=t),de===4&&$n(e,xe)),Re(e,r),t===1&&H===0&&!(n.mode&1)&&(Ut=se()+500,Zl&&Jn()))}function Re(e,n){var t=e.callbackNode;Jf(e,n);var r=Nl(e,e===ge?xe:0);if(r===0)t!==null&&Gs(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&Gs(t),n===1)e.tag===0?Gp(Wa.bind(null,e)):lc(Wa.bind(null,e)),Kp(function(){!(H&6)&&Jn()}),t=null;else{switch(Iu(r)){case 1:t=Hi;break;case 4:t=Pu;break;case 16:t=Cl;break;case 536870912:t=Du;break;default:t=Cl}t=td(t,Gc.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Gc(e,n){if(yl=-1,xl=0,H&6)throw Error(j(327));var t=e.callbackNode;if($t()&&e.callbackNode!==t)return null;var r=Nl(e,e===ge?xe:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=Vl(e,r);else{n=r;var l=H;H|=2;var o=Zc();(ge!==e||xe!==n)&&(xn=null,Ut=se()+500,lt(e,n));do try{gm();break}catch(s){Jc(e,s)}while(!0);rs(),Bl.current=o,H=l,ae!==null?n=0:(ge=null,xe=0,n=de)}if(n!==0){if(n===2&&(l=ri(e),l!==0&&(r=l,n=Di(e,l))),n===1)throw t=Ar,lt(e,0),$n(e,r),Re(e,se()),t;if(n===6)$n(e,r);else{if(l=e.current.alternate,!(r&30)&&!mm(l)&&(n=Vl(e,r),n===2&&(o=ri(e),o!==0&&(r=o,n=Di(e,o))),n===1))throw t=Ar,lt(e,0),$n(e,r),Re(e,se()),t;switch(e.finishedWork=l,e.finishedLanes=r,n){case 0:case 1:throw Error(j(345));case 2:et(e,Me,xn);break;case 3:if($n(e,r),(r&130023424)===r&&(n=ys+500-se(),10<n)){if(Nl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Le(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=di(et.bind(null,e,Me,xn),n);break}et(e,Me,xn);break;case 4:if($n(e,r),(r&4194240)===r)break;for(n=e.eventTimes,l=-1;0<r;){var i=31-rn(r);o=1<<i,i=n[i],i>l&&(l=i),r&=~o}if(r=l,r=se()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*pm(r/1960))-r,10<r){e.timeoutHandle=di(et.bind(null,e,Me,xn),r);break}et(e,Me,xn);break;case 5:et(e,Me,xn);break;default:throw Error(j(329))}}}return Re(e,se()),e.callbackNode===t?Gc.bind(null,e):null}function Di(e,n){var t=yr;return e.current.memoizedState.isDehydrated&&(lt(e,n).flags|=256),e=Vl(e,n),e!==2&&(n=Me,Me=t,n!==null&&Ti(n)),e}function Ti(e){Me===null?Me=e:Me.push.apply(Me,e)}function mm(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var l=t[r],o=l.getSnapshot;l=l.value;try{if(!on(o(),l))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function $n(e,n){for(n&=~vs,n&=~no,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-rn(n),r=1<<t;e[t]=-1,n&=~r}}function Wa(e){if(H&6)throw Error(j(327));$t();var n=Nl(e,0);if(!(n&1))return Re(e,se()),null;var t=Vl(e,n);if(e.tag!==0&&t===2){var r=ri(e);r!==0&&(n=r,t=Di(e,r))}if(t===1)throw t=Ar,lt(e,0),$n(e,n),Re(e,se()),t;if(t===6)throw Error(j(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,et(e,Me,xn),Re(e,se()),null}function xs(e,n){var t=H;H|=1;try{return e(n)}finally{H=t,H===0&&(Ut=se()+500,Zl&&Jn())}}function ct(e){On!==null&&On.tag===0&&!(H&6)&&$t();var n=H;H|=1;var t=Ge.transition,r=K;try{if(Ge.transition=null,K=1,e)return e()}finally{K=r,Ge.transition=t,H=n,!(H&6)&&Jn()}}function ks(){Fe=Lt.current,ee(Lt)}function lt(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,Hp(t)),ae!==null)for(t=ae.return;t!==null;){var r=t;switch(es(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Pl();break;case 3:Bt(),ee(Ae),ee(Ee),us();break;case 5:as(r);break;case 4:Bt();break;case 13:ee(re);break;case 19:ee(re);break;case 10:ls(r.type._context);break;case 22:case 23:ks()}t=t.return}if(ge=e,ae=e=Kn(e.current,null),xe=Fe=n,de=0,Ar=null,vs=no=ut=0,Me=yr=null,tt!==null){for(n=0;n<tt.length;n++)if(t=tt[n],r=t.interleaved,r!==null){t.interleaved=null;var l=r.next,o=t.pending;if(o!==null){var i=o.next;o.next=l,r.next=i}t.pending=r}tt=null}return e}function Jc(e,n){do{var t=ae;try{if(rs(),hl.current=Fl,Rl){for(var r=le.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Rl=!1}if(at=0,he=ce=le=null,gr=!1,Ir=0,gs.current=null,t===null||t.return===null){de=1,Ar=n,ae=null;break}e:{var o=e,i=t.return,s=t,a=n;if(n=xe,s.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){var f=a,y=s,x=y.tag;if(!(y.mode&1)&&(x===0||x===11||x===15)){var v=y.alternate;v?(y.updateQueue=v.updateQueue,y.memoizedState=v.memoizedState,y.lanes=v.lanes):(y.updateQueue=null,y.memoizedState=null)}var N=_a(i);if(N!==null){N.flags&=-257,La(N,i,s,o,n),N.mode&1&&za(o,f,n),n=N,a=f;var w=n.updateQueue;if(w===null){var C=new Set;C.add(a),n.updateQueue=C}else w.add(a);break e}else{if(!(n&1)){za(o,f,n),ws();break e}a=Error(j(426))}}else if(te&&s.mode&1){var R=_a(i);if(R!==null){!(R.flags&65536)&&(R.flags|=256),La(R,i,s,o,n),ns(Wt(a,s));break e}}o=a=Wt(a,s),de!==4&&(de=2),yr===null?yr=[o]:yr.push(o),o=i;do{switch(o.tag){case 3:o.flags|=65536,n&=-n,o.lanes|=n;var p=Ic(o,a,n);wa(o,p);break e;case 1:s=a;var d=o.type,m=o.stateNode;if(!(o.flags&128)&&(typeof d.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(Vn===null||!Vn.has(m)))){o.flags|=65536,n&=-n,o.lanes|=n;var S=Mc(o,s,n);wa(o,S);break e}}o=o.return}while(o!==null)}qc(t)}catch(_){n=_,ae===t&&t!==null&&(ae=t=t.return);continue}break}while(!0)}function Zc(){var e=Bl.current;return Bl.current=Fl,e===null?Fl:e}function ws(){(de===0||de===3||de===2)&&(de=4),ge===null||!(ut&268435455)&&!(no&268435455)||$n(ge,xe)}function Vl(e,n){var t=H;H|=2;var r=Zc();(ge!==e||xe!==n)&&(xn=null,lt(e,n));do try{hm();break}catch(l){Jc(e,l)}while(!0);if(rs(),H=t,Bl.current=r,ae!==null)throw Error(j(261));return ge=null,xe=0,de}function hm(){for(;ae!==null;)bc(ae)}function gm(){for(;ae!==null&&!Wf();)bc(ae)}function bc(e){var n=nd(e.alternate,e,Fe);e.memoizedProps=e.pendingProps,n===null?qc(e):ae=n,gs.current=null}function qc(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=um(t,n),t!==null){t.flags&=32767,ae=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{de=6,ae=null;return}}else if(t=am(t,n,Fe),t!==null){ae=t;return}if(n=n.sibling,n!==null){ae=n;return}ae=n=e}while(n!==null);de===0&&(de=5)}function et(e,n,t){var r=K,l=Ge.transition;try{Ge.transition=null,K=1,vm(e,n,t,r)}finally{Ge.transition=l,K=r}return null}function vm(e,n,t,r){do $t();while(On!==null);if(H&6)throw Error(j(327));t=e.finishedWork;var l=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(j(177));e.callbackNode=null,e.callbackPriority=0;var o=t.lanes|t.childLanes;if(Zf(e,o),e===ge&&(ae=ge=null,xe=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||sl||(sl=!0,td(Cl,function(){return $t(),null})),o=(t.flags&15990)!==0,t.subtreeFlags&15990||o){o=Ge.transition,Ge.transition=null;var i=K;K=1;var s=H;H|=4,gs.current=null,dm(e,t),Xc(t,e),Op(ui),El=!!ai,ui=ai=null,e.current=t,fm(t),Uf(),H=s,K=i,Ge.transition=o}else e.current=t;if(sl&&(sl=!1,On=e,Ul=l),o=e.pendingLanes,o===0&&(Vn=null),Kf(t.stateNode),Re(e,se()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)l=n[t],r(l.value,{componentStack:l.stack,digest:l.digest});if(Wl)throw Wl=!1,e=Li,Li=null,e;return Ul&1&&e.tag!==0&&$t(),o=e.pendingLanes,o&1?e===Pi?xr++:(xr=0,Pi=e):xr=0,Jn(),null}function $t(){if(On!==null){var e=Iu(Ul),n=Ge.transition,t=K;try{if(Ge.transition=null,K=16>e?16:e,On===null)var r=!1;else{if(e=On,On=null,Ul=0,H&6)throw Error(j(331));var l=H;for(H|=4,P=e.current;P!==null;){var o=P,i=o.child;if(P.flags&16){var s=o.deletions;if(s!==null){for(var a=0;a<s.length;a++){var f=s[a];for(P=f;P!==null;){var y=P;switch(y.tag){case 0:case 11:case 15:vr(8,y,o)}var x=y.child;if(x!==null)x.return=y,P=x;else for(;P!==null;){y=P;var v=y.sibling,N=y.return;if(Hc(y),y===f){P=null;break}if(v!==null){v.return=N,P=v;break}P=N}}}var w=o.alternate;if(w!==null){var C=w.child;if(C!==null){w.child=null;do{var R=C.sibling;C.sibling=null,C=R}while(C!==null)}}P=o}}if(o.subtreeFlags&2064&&i!==null)i.return=o,P=i;else e:for(;P!==null;){if(o=P,o.flags&2048)switch(o.tag){case 0:case 11:case 15:vr(9,o,o.return)}var p=o.sibling;if(p!==null){p.return=o.return,P=p;break e}P=o.return}}var d=e.current;for(P=d;P!==null;){i=P;var m=i.child;if(i.subtreeFlags&2064&&m!==null)m.return=i,P=m;else e:for(i=d;P!==null;){if(s=P,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:eo(9,s)}}catch(_){ie(s,s.return,_)}if(s===i){P=null;break e}var S=s.sibling;if(S!==null){S.return=s.return,P=S;break e}P=s.return}}if(H=l,Jn(),hn&&typeof hn.onPostCommitFiberRoot=="function")try{hn.onPostCommitFiberRoot(Ql,e)}catch{}r=!0}return r}finally{K=t,Ge.transition=n}}return!1}function Ua(e,n,t){n=Wt(t,n),n=Ic(e,n,1),e=Un(e,n,1),n=Le(),e!==null&&(Rr(e,1,n),Re(e,n))}function ie(e,n,t){if(e.tag===3)Ua(e,e,t);else for(;n!==null;){if(n.tag===3){Ua(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Vn===null||!Vn.has(r))){e=Wt(t,e),e=Mc(n,e,1),n=Un(n,e,1),e=Le(),n!==null&&(Rr(n,1,e),Re(n,e));break}}n=n.return}}function ym(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=Le(),e.pingedLanes|=e.suspendedLanes&t,ge===e&&(xe&t)===t&&(de===4||de===3&&(xe&130023424)===xe&&500>se()-ys?lt(e,0):vs|=t),Re(e,n)}function ed(e,n){n===0&&(e.mode&1?(n=Zr,Zr<<=1,!(Zr&130023424)&&(Zr=4194304)):n=1);var t=Le();e=En(e,n),e!==null&&(Rr(e,n,t),Re(e,t))}function xm(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),ed(e,t)}function km(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(t=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(n),ed(e,t)}var nd;nd=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||Ae.current)$e=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return $e=!1,sm(e,n,t);$e=!!(e.flags&131072)}else $e=!1,te&&n.flags&1048576&&oc(n,Il,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;vl(e,n),e=n.pendingProps;var l=Ot(n,Ee.current);Mt(n,t),l=ds(null,n,r,e,l,t);var o=fs();return n.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,Oe(r)?(o=!0,Dl(n)):o=!1,n.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,is(n),l.updater=ql,n.stateNode=l,l._reactInternals=n,yi(n,r,e,t),n=wi(null,n,r,!0,o,t)):(n.tag=0,te&&o&&qi(n),_e(null,n,l,t),n=n.child),n;case 16:r=n.elementType;e:{switch(vl(e,n),e=n.pendingProps,l=r._init,r=l(r._payload),n.type=r,l=n.tag=Sm(r),e=en(r,e),l){case 0:n=ki(null,n,r,e,t);break e;case 1:n=Ta(null,n,r,e,t);break e;case 11:n=Pa(null,n,r,e,t);break e;case 14:n=Da(null,n,r,en(r.type,e),t);break e}throw Error(j(306,r,""))}return n;case 0:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:en(r,l),ki(e,n,r,l,t);case 1:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:en(r,l),Ta(e,n,r,l,t);case 3:e:{if(Rc(n),e===null)throw Error(j(387));r=n.pendingProps,o=n.memoizedState,l=o.element,dc(e,n),Al(n,r,null,t);var i=n.memoizedState;if(r=i.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},n.updateQueue.baseState=o,n.memoizedState=o,n.flags&256){l=Wt(Error(j(423)),n),n=Ia(e,n,r,t,l);break e}else if(r!==l){l=Wt(Error(j(424)),n),n=Ia(e,n,r,t,l);break e}else for(Be=Wn(n.stateNode.containerInfo.firstChild),We=n,te=!0,tn=null,t=uc(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Rt(),r===l){n=zn(e,n,t);break e}_e(e,n,r,t)}n=n.child}return n;case 5:return fc(n),e===null&&hi(n),r=n.type,l=n.pendingProps,o=e!==null?e.memoizedProps:null,i=l.children,ci(r,l)?i=null:o!==null&&ci(r,o)&&(n.flags|=32),Oc(e,n),_e(e,n,i,t),n.child;case 6:return e===null&&hi(n),null;case 13:return Fc(e,n,t);case 4:return ss(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=Ft(n,null,r,t):_e(e,n,r,t),n.child;case 11:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:en(r,l),Pa(e,n,r,l,t);case 7:return _e(e,n,n.pendingProps,t),n.child;case 8:return _e(e,n,n.pendingProps.children,t),n.child;case 12:return _e(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,l=n.pendingProps,o=n.memoizedProps,i=l.value,G(Ml,r._currentValue),r._currentValue=i,o!==null)if(on(o.value,i)){if(o.children===l.children&&!Ae.current){n=zn(e,n,t);break e}}else for(o=n.child,o!==null&&(o.return=n);o!==null;){var s=o.dependencies;if(s!==null){i=o.child;for(var a=s.firstContext;a!==null;){if(a.context===r){if(o.tag===1){a=jn(-1,t&-t),a.tag=2;var f=o.updateQueue;if(f!==null){f=f.shared;var y=f.pending;y===null?a.next=a:(a.next=y.next,y.next=a),f.pending=a}}o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),gi(o.return,t,n),s.lanes|=t;break}a=a.next}}else if(o.tag===10)i=o.type===n.type?null:o.child;else if(o.tag===18){if(i=o.return,i===null)throw Error(j(341));i.lanes|=t,s=i.alternate,s!==null&&(s.lanes|=t),gi(i,t,n),i=o.sibling}else i=o.child;if(i!==null)i.return=o;else for(i=o;i!==null;){if(i===n){i=null;break}if(o=i.sibling,o!==null){o.return=i.return,i=o;break}i=i.return}o=i}_e(e,n,l.children,t),n=n.child}return n;case 9:return l=n.type,r=n.pendingProps.children,Mt(n,t),l=Je(l),r=r(l),n.flags|=1,_e(e,n,r,t),n.child;case 14:return r=n.type,l=en(r,n.pendingProps),l=en(r.type,l),Da(e,n,r,l,t);case 15:return $c(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,l=n.pendingProps,l=n.elementType===r?l:en(r,l),vl(e,n),n.tag=1,Oe(r)?(e=!0,Dl(n)):e=!1,Mt(n,t),Tc(n,r,l),yi(n,r,l,t),wi(null,n,r,!0,e,t);case 19:return Bc(e,n,t);case 22:return Ac(e,n,t)}throw Error(j(156,n.tag))};function td(e,n){return Lu(e,n)}function wm(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ye(e,n,t,r){return new wm(e,n,t,r)}function Ss(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Sm(e){if(typeof e=="function")return Ss(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Wi)return 11;if(e===Ui)return 14}return 2}function Kn(e,n){var t=e.alternate;return t===null?(t=Ye(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function kl(e,n,t,r,l,o){var i=2;if(r=e,typeof e=="function")Ss(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case xt:return ot(t.children,l,o,n);case Bi:i=8,l|=8;break;case Uo:return e=Ye(12,t,n,l|2),e.elementType=Uo,e.lanes=o,e;case Vo:return e=Ye(13,t,n,l),e.elementType=Vo,e.lanes=o,e;case Ho:return e=Ye(19,t,n,l),e.elementType=Ho,e.lanes=o,e;case fu:return to(t,l,o,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case cu:i=10;break e;case du:i=9;break e;case Wi:i=11;break e;case Ui:i=14;break e;case Tn:i=16,r=null;break e}throw Error(j(130,e==null?e:typeof e,""))}return n=Ye(i,t,n,l),n.elementType=e,n.type=r,n.lanes=o,n}function ot(e,n,t,r){return e=Ye(7,e,r,n),e.lanes=t,e}function to(e,n,t,r){return e=Ye(22,e,r,n),e.elementType=fu,e.lanes=t,e.stateNode={isHidden:!1},e}function Oo(e,n,t){return e=Ye(6,e,null,n),e.lanes=t,e}function Ro(e,n,t){return n=Ye(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function jm(e,n,t,r,l){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=yo(0),this.expirationTimes=yo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=yo(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function js(e,n,t,r,l,o,i,s,a){return e=new jm(e,n,t,s,a),n===1?(n=1,o===!0&&(n|=8)):n=0,o=Ye(3,null,null,n),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},is(o),e}function Cm(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:yt,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function rd(e){if(!e)return Xn;e=e._reactInternals;e:{if(ft(e)!==e||e.tag!==1)throw Error(j(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(Oe(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(j(171))}if(e.tag===1){var t=e.type;if(Oe(t))return rc(e,t,n)}return n}function ld(e,n,t,r,l,o,i,s,a){return e=js(t,r,!0,e,l,o,i,s,a),e.context=rd(null),t=e.current,r=Le(),l=Hn(t),o=jn(r,l),o.callback=n??null,Un(t,o,l),e.current.lanes=l,Rr(e,l,r),Re(e,r),e}function ro(e,n,t,r){var l=n.current,o=Le(),i=Hn(l);return t=rd(t),n.context===null?n.context=t:n.pendingContext=t,n=jn(o,i),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=Un(l,n,i),e!==null&&(ln(e,l,i,o),ml(e,l,i)),i}function Hl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Va(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Cs(e,n){Va(e,n),(e=e.alternate)&&Va(e,n)}function Nm(){return null}var od=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ns(e){this._internalRoot=e}lo.prototype.render=Ns.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(j(409));ro(e,n,null,null)};lo.prototype.unmount=Ns.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;ct(function(){ro(null,e,null,null)}),n[Nn]=null}};function lo(e){this._internalRoot=e}lo.prototype.unstable_scheduleHydration=function(e){if(e){var n=Au();e={blockedOn:null,target:e,priority:n};for(var t=0;t<Mn.length&&n!==0&&n<Mn[t].priority;t++);Mn.splice(t,0,e),t===0&&Ru(e)}};function Es(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function oo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ha(){}function Em(e,n,t,r,l){if(l){if(typeof r=="function"){var o=r;r=function(){var f=Hl(i);o.call(f)}}var i=ld(n,r,e,0,null,!1,!1,"",Ha);return e._reactRootContainer=i,e[Nn]=i.current,_r(e.nodeType===8?e.parentNode:e),ct(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var s=r;r=function(){var f=Hl(a);s.call(f)}}var a=js(e,0,!1,null,null,!1,!1,"",Ha);return e._reactRootContainer=a,e[Nn]=a.current,_r(e.nodeType===8?e.parentNode:e),ct(function(){ro(n,a,t,r)}),a}function io(e,n,t,r,l){var o=t._reactRootContainer;if(o){var i=o;if(typeof l=="function"){var s=l;l=function(){var a=Hl(i);s.call(a)}}ro(n,i,e,l)}else i=Em(t,n,e,l,r);return Hl(i)}Mu=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=ur(n.pendingLanes);t!==0&&(Ki(n,t|1),Re(n,se()),!(H&6)&&(Ut=se()+500,Jn()))}break;case 13:ct(function(){var r=En(e,1);if(r!==null){var l=Le();ln(r,e,1,l)}}),Cs(e,1)}};Qi=function(e){if(e.tag===13){var n=En(e,134217728);if(n!==null){var t=Le();ln(n,e,134217728,t)}Cs(e,134217728)}};$u=function(e){if(e.tag===13){var n=Hn(e),t=En(e,n);if(t!==null){var r=Le();ln(t,e,n,r)}Cs(e,n)}};Au=function(){return K};Ou=function(e,n){var t=K;try{return K=e,n()}finally{K=t}};ei=function(e,n,t){switch(n){case"input":if(Xo(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var l=Jl(r);if(!l)throw Error(j(90));mu(r),Xo(r,l)}}}break;case"textarea":gu(e,t);break;case"select":n=t.value,n!=null&&Pt(e,!!t.multiple,n,!1)}};ju=xs;Cu=ct;var zm={usingClientEntryPoint:!1,Events:[Br,jt,Jl,wu,Su,xs]},ir={findFiberByHostInstance:nt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},_m={bundleType:ir.bundleType,version:ir.version,rendererPackageName:ir.rendererPackageName,rendererConfig:ir.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:_n.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=zu(e),e===null?null:e.stateNode},findFiberByHostInstance:ir.findFiberByHostInstance||Nm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var al=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!al.isDisabled&&al.supportsFiber)try{Ql=al.inject(_m),hn=al}catch{}}Ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zm;Ve.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Es(n))throw Error(j(200));return Cm(e,n,null,t)};Ve.createRoot=function(e,n){if(!Es(e))throw Error(j(299));var t=!1,r="",l=od;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(l=n.onRecoverableError)),n=js(e,1,!1,null,null,t,!1,r,l),e[Nn]=n.current,_r(e.nodeType===8?e.parentNode:e),new Ns(n)};Ve.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=zu(n),e=e===null?null:e.stateNode,e};Ve.flushSync=function(e){return ct(e)};Ve.hydrate=function(e,n,t){if(!oo(n))throw Error(j(200));return io(null,e,n,!0,t)};Ve.hydrateRoot=function(e,n,t){if(!Es(e))throw Error(j(405));var r=t!=null&&t.hydratedSources||null,l=!1,o="",i=od;if(t!=null&&(t.unstable_strictMode===!0&&(l=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),n=ld(n,null,e,1,t??null,l,!1,o,i),e[Nn]=n.current,_r(e),r)for(e=0;e<r.length;e++)t=r[e],l=t._getVersion,l=l(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,l]:n.mutableSourceEagerHydrationData.push(t,l);return new lo(n)};Ve.render=function(e,n,t){if(!oo(n))throw Error(j(200));return io(null,e,n,!1,t)};Ve.unmountComponentAtNode=function(e){if(!oo(e))throw Error(j(40));return e._reactRootContainer?(ct(function(){io(null,null,e,!1,function(){e._reactRootContainer=null,e[Nn]=null})}),!0):!1};Ve.unstable_batchedUpdates=xs;Ve.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!oo(t))throw Error(j(200));if(e==null||e._reactInternals===void 0)throw Error(j(38));return io(e,n,t,!1,r)};Ve.version="18.3.1-next-f1338f8080-20240426";function id(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(id)}catch(e){console.error(e)}}id(),iu.exports=Ve;var Lm=iu.exports,Ka=Lm;Bo.createRoot=Ka.createRoot,Bo.hydrateRoot=Ka.hydrateRoot;const Pm=`# 简介\r
\r
1、《光线传奇》是中国第一部在地性奇幻小说史诗。作者笔名是琳倾雨。光线传奇三部曲分别为：\r
第一部《光线传奇之彩虹水晶》，发生在地球时间：公元2015年~2025年，主角：田妙可、丽丽等人。\r
第二部《光线传奇之星陨之战》，发生在地球时间：远古~公元1997年，主角：林凯、佩里（女）等人。\r
第三部《光线传奇之归零者》，发生在地球时间：2026年~2126年，主角：成年田妙可等人。\r
\r
2、琳倾雨，真名为田妙可儿，原名田野，安徽合肥人。\r
与《光线传奇》中琳凯蒂亚星球的官方语言琳凯蒂亚语（Rincatian）的创作者为同一人。\r
光线传奇主角田妙可（田野）的姓名正是来源于其作者。\r
\r
# 第一部《彩虹水晶》故事\r
\r
## 核心人物\r
\r
#核心人物（七大光线使者）【XX使者为职业名，姓名为地球名】\r
1、赤煌使者-太阳光线：田野/妙可，原琳凯蒂亚6岁公主（星帝小女），转世为地球18岁少年。\r
力量：香气治愈灵魂；闪耀之光，补给。\r
2、橙引使者-月亮光线：梦雪，田野/妙可姐姐（星帝长女），22岁，后成为幼儿园教师。原魂觉醒于2009年，但被困当年合肥日全食，仅在超级月亮时短暂连接。\r
力量：时间凝滞，回溯过去，引力，幻境。\r
3、金序使者-星辰光线：丽丽，15岁，地球上的田野儿时青梅竹马。琳凯蒂亚星球上也是伙伴，是妙可的贴身保镖。琳星生母为琳赛奇高级官员，被琳赛奇激进派迫害关押。生父为其烈士。\r
力量：秩序，星图导航，陨落繁星，数学，精准永恒，土星之力，治愈肉体。\r
4、碧生使者-风尘光线：蔡啸林，17岁，幽默的人，非常喜欢耍帅。\r
力量：风之力，龙卷风，木星之力。\r
5、沧时使者-时空光线：俊伟，18岁，被时空附身，是前期主要的反派。冷静、精于算计。\r
能力：操控时间与空间（但有限），开启虫洞，火星之力。是星帝同母异父弟弟的寄养大儿子。从小没有母亲，被星帝弟弟寄养，其父亲也不知是谁。故事设定：母亲是琳帕尔革新派成员，父亲是琳帕尔忠诚人员，但因妻子原因被迫害。\r
6、靛环使者-云雨光线：韩斌，17岁，被云雨附身，是前期主要的反派。性格较为冲动。完成父辈“复兴琳帕尔荣光”的遗愿，追求绝对力量与控制。是星帝同母异父弟弟的亲生小儿子。\r
能力：降雨、操控情绪，梦境，后发明寒冰魔卡。\r
7、紫枢使者-电磁光线：俊哥，25岁，最早觉醒但一直隐藏的使者，2010年开始暗中保护梦雪，后来在2012年成为夫妻。有一子，昊辰，2岁。\r
力量：雷电与磁力，擅长能量操控与干扰。\r
6*、云雨同宗同源的力量-冰雪之力（小云雨使者）：梦云，16岁，妙可表姐，妙可姑姑家长女。因家庭冷暴力与社会否定而内心空洞，被反派诱导“自愿”堕落，是关键的悲剧角色与双面间谍。\r
能力：控水、寒冰，暴雪。\r
3*、星辰光线的同宗同源-流星之力：迷奥，一个神秘的人，是会幻化成6岁男孩的狸花猫。\r
能力：附身。\r
7*、新型力量-声波之力：羽希，-4岁，梦雪女儿。\r
能力：声波骇浪。\r
\r
## 琳凯蒂亚中枢人物\r
1、星帝：第六循魔法世界的掌权者，拥有绝对实权和军队。\r
2、星母：星帝的妻子，妙可和梦雪的生母。\r
3、星使：星帝的左膀右臂，是个德高望重的老人。负责琳凯蒂亚魔法事物。琳赛奇现任主席，是地球孩子的引导者，地球庇护所的建立者，魔法学院的建立者及校长。\r
4、塔吉斯：琳帕尔逃亡地球建立巢国的著名商人。只讲钱不讲情分之人。\r
5、赫敏：琳帕尔革新派领导人，建立无光者保护组织。\r
6、亚莲娜：女盟协会创建者。\r
7、琳帕尔：琳帕尔党的建立者。\r
8、恁逻：琳赛奇激进派会长，一味的“和平共赢理论”，实则压迫谋权夺位。\r
\r
## 其他人物\r
1、佳怡，10岁，梦云妹妹。\r
2、三宝，8岁，梦云弟弟。\r
3、露曦，梦云的闺蜜。活泼开朗友善，喜欢小孩子。\r
4、叶青雨，5岁小男孩，青色水晶转世，孤儿院的孩子。\r
5、白雪，妙可高中同学，红色水晶附体。\r
6、周冰岩：被用作能量容器的普通人，最终反噬化为混沌晶核，象征“捷径力量”的终极悲剧。\r
\r
## 世界设定核心\r
\r
1. 文明类型哲学：\r
   · 掠夺型（琳帕尔）：权力至上，控制与纯化，血统纯正。\r
   · 规避型（异能兽）：琳凯蒂亚远古生物，身体附带特殊能量。无意识的力量工具。\r
   · 无视型（归零者）：对“存在”本身的格式化。第三部出现。\r
   · 替代型（琳赛奇）：合作共赢，艰难共生。\r
2. 四大奇迹：\r
   · 星门（徘徊回廊）：宇宙上古遗物，灾难与诱惑之门。\r
   · 大蜀山·兽心熔炉（合肥）：星陨之战终极异能兽的封印地。\r
   · 巢湖·方舟圣骸：琳帕尔逃亡之地，文明的子宫与坟墓。\r
   · 天穹星轨（未完成）：琳赛奇与琳帕尔革新派合作理想的遗迹。\r
3. 语言与历法：\r
   · 琳凯蒂亚语（田语）：融合了严密逻辑与实用主义的人工融合语言，是文明思维的编码。其古语几乎流失，只用作复杂咒语出现。\r
   · 星历：琳帕尔制定的历法，演变为地球星座体系。西方星座文明受其影响。\r
4. 核心主题：\r
   · 身份：个人在多重归属中的寻找与确立。\r
   · 创伤：文明与个人如何面对历史伤痕。\r
   · 共存：在差异与冲突中，寻找不完美的和谐之路。\r
   · 选择：在宏大的命运循环中，个体自由意志的重量。\r
\r
## 第一部故事概要\r
\r
这是一个关于身份破碎与重建、在失落中寻找使命的奇幻成长故事。\r
18岁的合肥少年田野突遭异变，被来自外星叛逆者的光箭击中，身体重塑为6岁的金发女孩妙可。\r
这场剧变撕裂了他熟悉的青春：强健的体魄化为幼弱的身躯，男性的身份被女性的外壳包裹，球场上的荣耀与即将到来的高三生活，瞬间成为遥不可及的过去。\r
在星使爷爷的指引下，妙可得知自己实为琳凯蒂亚星球的太阳光线使者。\r
七颗从她体内散落的彩虹水晶隐匿于城市之中，未来将寻得其他孩子作为宿主。\r
她肩负着找回水晶、唤醒同伴、阻止叛逆者阴谋的双重使命。\r
然而，比星际战争更迫近的，是内心的战争——她必须作为“田妙可”，一个被所有人视为陌生幼女的存在，去适应这个不再认识“田野”的世界。\r
故事的核心张力在于灵魂与躯壳的错位。\r
一边是困在孩童身体里、记忆完整的18岁少年，承受着不被识认的刺痛与力量尽失的绝望；\r
另一边是家族与周围人笨拙而温暖的接纳，试图在新的身份框架下重新构筑联系。\r
在奇幻冒险的背景下，作品深刻描绘了身份认同的危机、失去与获得的辩证，以及一个灵魂如何在极端变故中，带着双重的记忆与责任，学习步履蹒跚地走向明天。\r
它既是关于拯救世界的星际童话，也是一场关于“我是谁”的内心跋涉。`,Dm=`{\r
"_comment": "琳凯蒂亚语-汉语映射表",\r
  "它被命名为“嫦娥1号”。": "Ji moneē “Ĉaŋê 1”.",\r
  "你的名字是什么？": "Nia nomo es ne?",\r
  "她有一本小明的书": "Ŝi ez Xiomiŋ'a i libo yo.",\r
  "书在桌子上。": "Libo'l ez dekowo yo.",\r
  "桌子上有书。": "Dekowo'l ez libo yo.",\r
  "加油，你是伟大的！": "Ginmō, ni es glanda ino ga!",\r
  "你吃饭了吗？": "Ni'ô tabele ne?",\r
  "夏天的太阳很大。": "Somero'a suno'l ce-biga yo.",\r
  "这只猫看见了那只鸟。": "Ko hamigo midele go bêrdo.",\r
  "我的朋友给了我一本书。": "Wia amiko ponile wi’m i libo.",\r
  "美丽的花在桌子上。": "Bela lowo ez dekowo.",\r
  "啊，这真是太美了！": "Ah, hoseeli belaye ga!",\r
  "我有一个朋友。": "Wia i amiko.",\r
  "我正在学习琳凯蒂亚语。": "Wi soseze Rincatian.",\r
  "他打算去学校。": "Hi toge soselio.",\r
  "她已经回家了。": "Ŝi gaŋle homo.",\r
  "请把窗户打开。": "Celoŋ ni ope windō'n.",\r
  "这不是我的书，而是他的。": "Ko nes wia libo ses hia.",\r
  "也许明天会下雨。": "Ezeli togen xu yōge.",\r
  "今天天气很好，所以我来了公园。": "Qigen xa tēnkio ce-belaye gosï wi tole parko.",\r
  "今天天气很好。": "Qigen xa tēnkio ce-belaye yo.",\r
  "我是一名学生。": "Wi es i soseo yo.",\r
  "今天天气晴朗。": "Qigen xa tēnkio es selēna.",\r
  "我们喜欢听音乐。": "Win dāske miôsiko yo.",\r
  "她有一个漂亮的书包。": "Ŝi ez i bela liboruko.",\r
  "你的书包真漂亮啊!": "Nia liboujo hoseeli belaye ga!",\r
  "我们每天早上七点起床。": "Win caŋgen monen qim do xu hēlāê lotor'n.",\r
  "这是我的英语老师。": "Ko es wia Engliŝ sensejiar.",\r
  "猫喜欢吃鱼。": "Hamigo dāske fō tabe fiŝo.",\r
  "我周末经常去公园。": "Wi sinmum xu mandixi toe parko.",\r
  "这本书很有趣。": "Ko libo es ce-intersi yo.",\r
  "他会说一点中文。": "Hi ixoli parle Han liŋvo gâhiyo.",\r
  "教室里有二十张桌子。": "senselionē ez nimŝim deko.",\r
  "我妈妈正在做早餐。": "Wia mama doze monentabo.",\r
  "我想去北京旅行。": "Wi toge Bējiŋ viaxo poroŋ voliyo.",\r
  "他比我高一点。": "Hi ixoli hāgitē wi'n.",\r
  "我们应该努力学习。": "Win jindōli sose deviyo.",\r
  "昨天我看了一部电影。": "Legen,wi midele i filmo.",\r
  "如果你努力，你就会成功。": "Ce ni doge saki rugo ni jindōe.",\r
  "这朵花是红色的。": "Ko lowo es ruẑa.",\r
  "我和我的朋友一起去上学。": "Wi yixo wia amiko toe soselio.",\r
  "我每天花一小时读英语。": "Wi caŋgen xu i xigan peyoŋ perite Engliŝ.",\r
  "TA吃了小明的苹果。": "Xi tabele XioMiŋ'a piŋgō.",\r
  "张海明的作业被他自己写完了。": "ẐaŋHāmiŋ'a induso libolē hiẑi'n.",\r
  "我已经学习琳语三年了。": "Wi sâm yano xu sosele Rincatian.",\r
  "当我到家时，妈妈正在打扫房间。": "Wi torē homo xu,mama'ô pureze ĉambo.",\r
  "这座桥是在 2010 年被建造的。": "Ko ponto di2010 yano xu hoŋmolē.",\r
  "这是我读过的最有趣的一本书。": "Ko es wi peritele da intersisā i libo handêyo.",\r
  "我不知道他明天是否会来参加聚会。": "Wi mōjie fō hi togen xu partege parto sēroneyo.",\r
  "大家都知道这件事情。": "Onin ce-nemōjie ko mono.",\r
  "世界上有许多的人不喜欢冬天。": "Sēgānē,mandi ino nedāske vinĉo.",\r
  "那个人是谁？为什么他总是在我们学校附近售卖文具？": "Go ino es nei?Nānde hi caŋxili wina soseliohüji ku muaĉete soseom?",\r
  "他的朋友学过的琳凯蒂亚语书被他的朋友读完了。": "Hia amiko sosele da Rincatian libo peritelē hia amiko nō yo.",\r
  "如果你多练习，你的口语会变得更好。": "Rugo ni mandili ezerce,nia parolo bonatēliē.",\r
  "他跑得如此快，以至于没人能追上他。": "Hi kure ce-sohu silo nezomi güĉetoe hi sēēyo.",\r
  "我昨天忘记把作业带到学校来了。": "Wi legen xu forge fō induso'ō poltetoē soselio.",\r
  "我们班有三分之二的学生喜欢打篮球。": "Wina senselio ez sâm-ape-nim soseo fo dāske fō plēe korbopilko.",\r
  "她不仅会弹钢琴，还会拉小提琴。": "Ŝi kugle piano gâhi kowe plēe violino gâhiyo.",\r
  "我想知道你昨晚为什么没按时睡觉。": "Wi nemōjie deθi fō nānde ni legen noten xiganwo xu dorme.",\r
  "自从搬到这里，我们就交了很多朋友。": "",\r
  "这些照片是我在去年暑假拍的。": "Kon fōtōguo es wi leyano varmo holido xu fōtōgue.",\r
  "保持健康对我们每个人来说都很重要。": "",\r
  "我希望将来能成为一名优秀的医生。": "Wi esge i bōbona medikejiar voliyo.",\r
  "当雨停的时候，我们正在公园里散步。": "Yōle xu,win parkonē sanbuze.",\r
  "这本书值得一读，因为它呈现了很多道理。": "Ko libo peritē mezi qavi ji monĉe mandi razono.",\r
  "他花了两个小时才解出这道数学题。": "",\r
  "我们应该学会独立，而不是总是依赖父母。": "",\r
  "我看见一个小女孩正在路边哭，于是走了过去。": "Wi midele fō i xovilino'ô voyohüji ku mulādeze kuni wi ketole.",\r
  "无论何时何地，我们永远守护你。": "Nejen caŋxicaŋlo,win caŋxili flege ni.",\r
  "某些男同学总是喜欢欺负我们学校部分女同学。": "Imen nambososeo caŋxili dāske fō hōmge wina soselio da ixo vrinososeo.",\r
  "今天是中国的传统节日——春节，家家户户都很开心！": "Qigen es Ĉina ĉuâdicio ferio-halinoferio,caŋi ce-hapiye.",\r
  "我的妹妹每天乘坐公交车去上学。": "Wia mimito caŋgen xu kolekiĉar peyoŋ toe soselio.",\r
  "当我从学校出来时，我的老师就给我的妈妈通完了电话。": "Wi ĉulāze soselio'n xu, wia sosejiar'ô eleparlele wia mama nō teyo."\r
}\r
`,Tm=`琳凯蒂亚语（田语）语法规则15条\r
【规则1：语音规则】\r
1.1 音节构成有以下五种组合（任何音节中，每个位置仅允有一个音素）：\r
①音节＝辅音；②音节=元音；③音节=辅音＋元音；④音节＝元音+尾音；⑤音节=辅音+元音+尾音。\r
1.2 可作尾音的字母：g [k̚](顿音)、l (不发音)、m [m̚](闭口音)、n [n̚](前鼻音)、r [ɚ](卷舌音)、ŋ [ŋ] (后鼻音)。\r
1.3 字母表\r
田语41个字母：a ā â b c ĉ d e ē ê f g h i ï î j k l m n o ō ô p q r s ŝ t u ü û v w x y z ẑ θ ŋ。\r
辅音（26个）\r
Mm [m] / [m̚]	Nn [n] / [n̚]	Ll [l] / [ɭ]	Hh [x]	Rr [ɻ] / [l] / [ɚ]	Xx [ɕ]	Ŝŝ [ʂ] / [ɕ] (sh)\r
Pp [pʰ]	Tt [tʰ]	Kk [kʰ]	Ss [s]	Cc [tsʰ]	Qq [tɕʰ]	Ĉĉ[tʂʰ]/[tɕʰ](ch)\r
Bb [p]	Dd [t]	Gg [k] / [k̚]	Θθ [θ] (th)	Zz [ts] / [θ]	Jj [tɕ]	Ẑẑ [tʂ] / [tɕ](zh)\r
Ff [f]	Vv [v]		Yy [j]半元音	Ww [w]半元音		Ŋŋ [ŋ] (ng)\r
元音（15个）\r
Aa [ä]	Ee [e̞]	Ii [i]	Oo [ɑʊ̯]	Uu [u]\r
Āā [aɪ̯]（ai）	Ēē [eɪ̯]（ei）	Ïï [z̩]（iz）半辅音	Ōō [oʊ̯]（ou）	Üü [y]（yu）\r
Ââ [æ]（ae）	Êê [ɤ]（eh）	Îî [ɸ]（iv）半辅音	Ôô [œ]（oe）	Ûû [o]（uo）\r
①小括号为特殊字母转写方案。②辅音字母名称为“发音+[ɑʊ̯]”，如b读作[pɑʊ̯]。③音位变体自由拼读。\r
\r
【规则2：词法规则】\r
2.1 按数量分类\r
有限词（代词、数词、连词、助词、抒情词），即封闭词类；\r
无限词（名词、动词、形容词、副词、声叹词），即开放词类。\r
2.2 按来源分类\r
2.2.1外来词：需依田语语音规则及构词法将外语拉丁拼写方式转为对应形式，语意可能变化。\r
例2.2.1 将英语“chat”转写成“ĉate v.聊天；ĉato n.聊天”。\r
2.2.2原有词：类似于成语的语言压缩包。例如，gaŋdyodene：说的也是；ginmō，加油。\r
2.2.3标准词：无限标准词：田语中规定且固定的3000个拥有名、动、形、副至少4种形式之一的词根，名词必以“o”结尾，动词必以“e”结尾，形容词必以“a或i”结尾，副词必以“u或li”结尾。\r
有限标准词：所有有限词均为标准词。无限词中的声叹词不属于标准词。\r
例2.2.3 无限标准词：mono n.姓名；mone v.命名。\r
2.3 抒情词：包含强调词（如ce），领语中的牵词，结语中的止词。所有抒情词均可做独立成分。\r
2.4 声叹词：包含拟声词、拟态词、叹词，统一词尾为“-h”，做独立成分。\r
例2.4：“叮咚”为“diŋdoŋh”，闪耀的样子为“kilāh”，“啊”为“ah”。\r
2.5 构词法公式：单词 ＝（前缀）+ 词根 +（后缀）（前缀、词根、后缀数量不限）\r
\r
【规则3：名词规则】\r
3.1 名词化词尾“-o”：将非名词转化为名词，指代与该词核心语义相关的事物、概念。\r
（注意：规则2中的名词词尾“-o”是构词行为，此处为语法行为，动、形、副亦同。请注意区分。）\r
例3.1：mone v.命名→moneo n.命名（这件事）\r
3.2 名词的集群“-n”：表示集体属性，理解为“……们”，附着于名词词尾“-o”后。\r
例3.2：soseon n.学生们；nim soseo√ nim soseon× 两个学生；nim soseon两个学生群体√；sose v.学习；in n.人，人类；inon n.人群，大众。\r
3.3 由于专有名词不是无限标准词且本身就是名词，所以无需名词词尾。\r
3.4 名词方位词尾（静态）：名词+方位词构成复合名词。方位词尾拥有名词词尾属性，无需再加“-o”。\r
方位关系（6种）\r
	接壤	不接壤\r
内部	名词+θinē+方位词	名词+nē+方位词\r
外部	名词+θiwā+方位词	名词+wā+方位词\r
不考虑内外关系	名词+θi+方位词	名词+方位词（日常简化形式）\r
方位词（18个）\r
左\r
ezor	右\r
ayor	前\r
qin	后\r
h	中，强调中间\r
joŋji	外\r
wā\r
东\r
elasï	西\r
wesï	南\r
suθï	北\r
norθï	内、里（强调范围）\r
nē 	附近（边、旁）\r
hüji\r
紧挨着、接着、靠\r
eto	周围\r
qiko	上（同趋向动词）\r
wo	下（同趋向动词）\r
lu	靠到、挨到（结果）\r
etole	靠去、挨去、接近（过程）\r
toeto\r
例3.4.1：deko n.桌子；dekon n.一些桌子；deko-n-wo→dekonwo n.在一些桌子上（不考虑方位关系）；deko-n-nē-qin→dekonnēqin n.悬浮嵌在一些桌子前面；deko-θiwā-lu→dekoθiwālu n.粘在桌子下；dekowāwo n.悬浮于桌子上方；dekoθinē n.桌子内部接壤处。\r
例3.4.2：dekowo lio ez libo. 桌子上有书。libo’l ez dekowo. 书在桌子上。\r
例3.4.3 方位词能直接做名词：Elasï’l ez tāyaŋ. 东边有太阳。\r
\r
【规则4：动词规则】\r
4.1 普通动词化词尾“-e等16种体态词尾”：将非动词转化为动词，指代与该词核心语义相关的动作，过程，与3.1相同。\r
4.2 动词趋向词尾（动态）：谓语动词+趋向词构成动趋复合动词充当述语（动词体态词尾放置于复合动词末尾）表示动作的方向等。趋向词尾拥有动词词尾属性，只可省略一般主动式“-e”。\r
趋向词表（32个）\r
	wo（上）	lu（下）	ĉu（出）	jio（进）	gaŋ（回）	ke（过）	hē（起）	gâ（开）\r
lā（来）过程，从A点到B点，\r
参考点在B点时	wolā\r
（上来）	lulā\r
（下来）	ĉulā\r
（出来）	jiolā\r
（进来）	gaŋlā/olā（回来）从B点到A点，参考点在A点时	kelā\r
（过来）	hēlā\r
（起来）	gâlā\r
（开来）\r
to（去）过程，从A点到B点，\r
参考点在A点时	woto\r
（上去）	luto\r
（下去）	ĉunēn\r
（出去）（开）	jioto\r
（进去）	gaŋto/oto（回去）从B点到A点，参考点在B点时	keto\r
（过去）	hēto\r
（起去）起开	gâto\r
（开去）\r
其它	lalām\r
从来（从起点起向未来）	latom\r
从去（从起点开始向过去）	lātōm\r
来到	totōm\r
去到	torē\r
到达、抵达	ĉiō\r
朝、向\r
例4.2：midewotoze 正在看上去（mide：见；woto：上去）；pêlētoze 去玩了（pêlē：玩耍，ze为动词主动进行式。侧重在去玩的路上，即开始执行中）；pêlētole 玩去了（侧重事后解释，le为动词主动完成式）；pêlēge 打算玩（ge为动词主动计划式）。\r
4.2.1 趋向词本身可充当述语成分作动词（可直连宾语）表示主语的位移状态。\r
例4.2.1：计划位移：toge（计划前往）；位移中：toze（正在路上）；位移完成：tole（已经到达）；\r
Win toge soselio. 我们打算去学校。（toge是to的计划式）；Hi lutole.他已经下去了。\r
4.3 性状动词（关系动词）：用来充当述语成分。包含两种，一是表示性质或判断的“es”（类似于汉语“是”），二是表示状态或存在的“ez [e̞θ]”（表示在/有）。性状动词只可单做述语成分，但可被副词修饰。性状动词的具体逻辑如下：\r
4.3.1性质动词“es”——等同性（表示主语的性质或判断主语是什么的连接桥梁，后接宾语）\r
①等同的：A es B，A＝B，意为“A是、等于、等同于B”；\r
②近似的：A ese B，A≈B，意为“A像、可能是、近似于B”；【像不像为esene】\r
③不同的：A nes B，A≠B，意为“A不是、不等于、不同于B”；\r
④不定的：A esne B，A?B，意为“A是否为、是不是B”；\r
⑤所有的：A caŋes B，A≌B，意为“A总是、全部是、都是B”；\r
⑥肯定的：A ces B，A==B，意为“A一定是、肯定是、绝对是；就是B”。【否定为cenes】\r
4.3.2状态动词“ez”——现实性（表示主语状态或者存在性的连接桥梁，后接宾语）\r
①现实的：A ez B，A∈B，意为“A在，置于，存在于B”；B∈A，意为“B有，拥有A”；\r
②可能的：A eze B，（A∈B）∪（A∉B），意为“A可能于B”；（B∈A）∪（B∉A），意为“B可能有A”；\r
③不可能的：A nez B，A∉B，意为“A不于B”；B∉A，意为“B没有A”；\r
④不定的：A ezne B，A?B，意为“A是否在、在不在B”；B?A，意为“B是否有、有没有A”；\r
⑤所有的：A caŋez B，A≌B，意为“A总在B”；B≌A，意为“B总有、全部有，都有A”。【“总”表示时间上的任何时候】\r
⑥肯定的：A cez B，A==B，意为“A肯定在；就在B”；B==A，意为“B一定有、绝对有；就有A”。【否定为cenez】\r
\r
【规则5：动词和形容词的谓语规则】\r
5.1体态词尾规则\r
谓语中的动词和形容词围绕一般、计划、进行、完成4个体和主动、被动、使动、迫动4个语态形成16个动词体态词尾和16个形容词体态词尾（均是一个音节构成）同时用于标记谓语成分。\r
动词词尾e实际就是一般主动式。形容词作谓语时必须使用表中某一词尾。具体如下（直接附着在单词后）：\r
4×4×2体态词尾\r
	主动	被动	使动	迫动（被迫、不得不）\r
一般	一般主动式	动作	e	一般被动式	动作	ē	一般使动式	动作	ê	一般迫动式	动作	û\r
		形容	ye		形容	yē		形容	yê		形容	yû\r
计划	主动计划式	动作	ge	被动计划式	动作	gē	使动计划式	动作	gê	迫动计划式	动作	gû\r
		形容	gie		形容	giē		形容	giê		形容	giû\r
进行	主动进行式	动作	ze	被动进行式	动作	zē	使动进行式	动作	zê	迫动进行式	动作	zû\r
		形容	zie		形容	ziē		形容	ziê		形容	ziû\r
完成	主动完成式	动作	le	被动完成式	动作	lē	使动完成式	动作	lê	迫动完成式	动作	lû\r
		形容	lie		形容	liē		形容	liê		形容	liû\r
谓语中的形容词词尾可表示形容词性质或状态的变化，例如“花变红了”。使用使动或迫动时，宾语需要附着直接宾语助词。\r
5.2变化规则\r
根据使之变化的对象的不同，变化分为自变和他变，在不知道是否为自变的情况下均以自变考量。自变是指不受外界影响，自发产生的变化，一般只对主语负责，无需宾语；他变是指受到外界的影响而产生变化，一般需要有宾语。\r
再者，根据变化时是否产生位移可分为静变（静态转变）和动变（动态转变）。静变是指人或物的性质或状态发生变化的结果。也叫自我趋向。静变一般变化时所需的时间较长，肉眼难以观察其变化过程,侧重变化的结果；动变是指人或物的性质或状态发生变化的过程。动变一般变化时所需的时间较短，在短时间内可以看见其变化过程，侧重变化的过程。\r
前一组和后一组可两两组合，以突出更加丰富的变化含义。形容词表示变化的表述如下\r
自静变（主动完成式）：lie	自动变（主动进行式）：zie\r
他静变（被动完成式）：liē	他动变（被动进行式）：ziē\r
\r
【规则6：形容词和副词规则】\r
6.1 形容词化词尾和副词化词尾：将非形容词（副词）转化为修饰性形容词（副词），指代与该词核心语义相关的性质或状态，与3.1相同。口语中，强弱形容词以及副词的两种词尾作用的分界并不明显，主要由说话者依情感自己决定使用哪种。\r
形容词：-i（弱形容词：弱情感、含蓄；状态形容词）\r
-a（强形容词：强烈、夸张、鲜明；性质形容词）	副词：-u（通常修饰动词或形容词）\r
-li（通常修饰其他成分或句子）\r
6.2 修饰性形容词词尾和副词词尾分为原级、相同级、比较级、最高级4种，其他词性不可接相同级、比较级和最高级词尾。\r
	原级（仅做修饰词）	相同级（与…一样）	比较级（比…更…）	最高级（最……）\r
形容词	-i或-a	-ixo	-tē	-sā\r
副词	-u或-li			\r
6.3 当处理含有相同级、比较级、最高级形容词或副词的句子时，宾语需要使用助词“nō”。\r
当含有相同级、比较级、最高级的形容词做述语时，形容词的体态词尾附着其后，仅一般主动式可省略。\r
例6.3：belasālie 曾经最美（lie形容词做述语时不做修饰词的完成式）；Wi belatē ŝi’n. 我比她漂亮。（省略了形容词的一般主动式ye）；sohusā kure最快速度地跑。\r
\r
【规则7：代词规则】\r
7.1代词表\r
代词表\r
人称代词	第一人称	第二人称	第三人称	全体称\r
基本型	单型	wi\r
我	ni\r
你	hi\r
他（男）	ŝi\r
她（女）	ji\r
它（物）	xi 第三人称单型通用①	onin\r
大家、在座的所有人、女士们和先生们\r
	复型（-n，\r
…们）	win\r
我们	nin\r
你们	hin\r
他们	ŝin\r
她们	jin\r
它们	xin 第三人称复型通用	\r
敬型\r
（-câli）	单型	wicâli(傲)老子	nincâli\r
您，您们	hicâli\r
他	ŝicâli\r
她	jicâli\r
它	xicâli\r
通用	onincâli\r
大家、在座的所有人、全体\r
	复型	câli\r
爸爸们		hincâli\r
他们	ŝincâli\r
她们	jincâli\r
它们	jincâli\r
通用	\r
谦型\r
（-zo）	单型	izo\r
我	nizo\r
你	hizo\r
他（男）	ŝizo\r
她（女）	jizo\r
它（物）	xizo\r
通用	oninzo\r
大家的、所有人的、每个人的\r
	复型	izomin\r
我们	ninzo\r
你们	hinzo\r
他们	ŝinzo\r
她们	jinzo\r
它们	xinzo\r
通用	\r
物主\r
（-a，…的）\r
（前可接名词）	单型	wia\r
我的	nia\r
你的	hia\r
他（男）的	ŝia\r
她（女）的	jia\r
它（物）的	xia\r
他她它的	onina\r
大家的、所有人的、每个人的\r
	复型（-na，\r
…们的）	wina\r
我们的	nina\r
你们的	hina\r
他们的	ŝina\r
她们的	jina\r
它们的	xina\r
他她它们的	\r
反身\r
（-ẑi，…自己）	单型	wiẑi\r
我自己，自己	niẑi\r
你自己	hiẑi\r
他自己	ŝiẑi\r
她自己	jiẑi\r
它自己	xiẑi\r
通用自己	dōmodâẑi\r
大家自己，每个人自己\r
	复型（-nẑi，\r
…们自己）	winẑi\r
我们自己	ninẑi\r
你们自己	hinẑi\r
他们自己	ŝinẑi\r
她们自己	jinẑi\r
它们自己	xinẑi\r
通用自己	\r
反身物主复型\r
-nẑia（…们自己的）	winẑia\r
我们自己的	ninẑia\r
你们自己的	hinẑia\r
他们自己的	ŝinẑia\r
她们自己的	jinẑia\r
它们自己的	xinẑia\r
他她它们自己的	dōmodâẑia\r
大家自己，每个人自己的\r
①：【主宾代词】他、她、它（通用）（主语或宾语中心词原形）。\r
7.2 相关词表（相关词表包含指示代词、疑问代词、副词、止词等）\r
相关词表（代词、副词等）\r
	指示	疑问	逻辑	数量\r
	近指	远指		任意	存在	否定	个别	部分	大量	整体\r
事物	ko\r
这，这个，这事，这物	go\r
那，那个，那事，那物	neko\r
哪个，什么（问事物名回名称）啥+名词	imē\r
某、某个、任意、某物、某事	ezom\r
有的、存在、有些	nezom\r
没有、无、不存在、毫无	xoi\r
极少的、不多的	ixo\r
部分，一些，少许，一点	mandi\r
许多的、大多数的	caŋ\r
全部、一切、所有、整、每个①\r
人（动物亦可用）	koi\r
这个人	goi\r
那个人	nei\r
谁，哪个人	mēi\r
某人、任意某人	ezomi\r
有人、存在某人	nezomi\r
没有人、不存在某人	xoin\r
极少数人	ixoin\r
一些人，部分人	mandin\r
许多人，很多人	caŋi\r
每个人，任何人\r
时间	koxi\r
这时候	goxi\r
那时候	nexi\r
何时，什么时候（问时回时）	mēxi\r
某时、任意某时、曾经	ezomxi\r
有时、存在某时，有些时候	nezomxi\r
无时、不存在某时，永不，从来不	xoixi\r
偶尔，偶时	ixoxi\r
一些时候	mandixi\r
很多时候，许多时候，经常，常常	caŋxi\r
每时每刻，任何时候，永远\r
地点	kolo\r
这里	golo\r
那里，那个地方	nelo\r
何地，哪里，什么地方（问地回地）	mēlo\r
某地、某处、任意某地	ezomlo\r
有地、存在某地，有些地方	nezomlo\r
没有地、不存在某地、无处	xoilo\r
极少地方	ixolo\r
一些地方	mandilo\r
许多地方，很多地方	caŋlo\r
到处、每处、处处、各处、任何地方\r
性质	kono\r
这样的	gono\r
那样的	nānno\r
什么，哪样的②	mēno\r
某样的		neno\r
没有一样的				caŋno\r
每样的，各样的\r
理由	dē\r
句中语段指示代词④	gosi\r
因此，所以	nānde\r
为什么	mēnān\r
为某种缘故	ezomnān\r
有理由	nenān\r
无理由，没有理由				caŋnān\r
为每种缘故\r
方式	koeli\r
这样地	goeli\r
那样地	seeli\r
怎样，如何③	mēeli\r
某样地		nēeli\r
怎样也不				caŋeli\r
每样地，各样地\r
程度			hoseeli\r
多么（问程度）							\r
数量	kon\r
这些\r
	gon\r
那些	dosē\r
多少（问数量）\r
nekon\r
哪些（问群体）	imen\r
某些，某个数量	——	——	——	——	——	jindō\r
尽所有，尽一切可能，尽最大努力（竭尽）\r
其他相关词	samhō\r
（相互、互相；彼此）	wa【物称代词】我家（专指自己家里的人/物）	dose\r
做、造、使……成为	kota\r
其余，其他	yalê\r
因为某种缘故	yolê\r
用某种方法	neinde\r
谁的（问所属物）\r
①【整体代词】全部、每、次次、都、整、总、一切、每个、所有、每物、任何。\r
②（问事物性质，回形容词）（简写：nān）。“no”来源于“nomo（名字）”\r
③如何，怎样（问事物状态，回形容词）（怎么，问性质状态方式行动）。\r
④逗号或句号后，或回答别人的问题时，指称前一整句的内容；在同一句中，指代前面的词，连词除外，以避免词汇重复。如果所述一个核心词，用xē。\r
⑤尽可能地、尽最大努力。表示将某事物最大化的意愿。它表示要运用一切可能来达到最高程度。\r
\r
【规则8：数词规则】\r
8.1 数词的子类构成\r
数词的构成\r
拉丁	释义	拉丁	释义	拉丁	释义\r
fu-	【负数词】负几	di-	【序数词】第-	-bām	【倍数词】-倍\r
ẑeŋ-	【正数词】正几	ape	【分数词】-分之-（动词：分开）	haŋ-	【概数词】大约、左右 [约]；数（以）……\r
do	【小数词】几点几	例如1.2读作“i do nim”；1%读作“cen ape i”；“第六”写作“dilêm”；“数以千计”写作“haŋkio”。\r
8.2 常见基数词（几乎都是单音节）\r
基数词词表\r
编号	拉丁	田谚	释义	编号	拉丁	田谚	释义	编号	拉丁	田谚	释义\r
S1	nu		0	S9	fa		8	S16	mion		百万\r
S2	i		1	S10	jôl		9	S17	ŝim mion		千万\r
S3	nim		2	S11	ŝim		十	S18	yom		亿\r
S4	sâm		3	S12	cen		百	S19	bion		十亿\r
S5	fōl		4	S13	kio		千	S20	ŝim bion		百亿\r
S6	ven		5	S14	wan		万	S21	kiom		千亿\r
S7	lêm		6	S15	ŝim wan		十万	S22	ĉuē		兆\r
S8	qim		7	例如“八万九千七百零五”写作“fawan jôlkio qimcen ven”。1~9后面紧跟“百、千”这样的数词\r
\r
8.3 下表中展现的是常用的量名词。琳语中没有量词，量名词实际上是名词的一种。汉语中的量词表述翻译时使用“数词 + 量名词 + da + 名词”这一结构来修饰名词（类似于英语的a glass of water）。\r
量名词展示（名词均能充当）\r
tufo	【特殊名量词】束，丛，簇，绺		\r
peco	【特殊名量词】片，块；件	foyo	【特殊名量词】次，回，趟\r
rupo	【特殊名量词】群，批；丛；组	ton	【单位量词】吨（重量高单位）\r
mit	【单位量词】米（距离单位）	kiloger	【单位量词】千克\r
dumit	【单位量词】分米	faŋto	【单位量词】磅\r
celimit	【单位量词】厘米	ger	【单位量词】克（重量低单位）\r
minimit	【单位量词】毫米	liẑo	【单位量词】升\r
kilomit	【单位量词】千米	miniliẑo	【单位量词】毫升\r
8.3.1 还有seego（特别多）、pluẑē（好几个，不止一个）、neniom（毫无，一点也没有）、seetoη（全部，所有、整个）、amaso（一大堆，一群）这些类似于量词的词只用来做定语或者状语。\r
\r
【规则9：连词规则】\r
连词的作用是用逻辑连接词（连词）连接两个及以上的句子（分句）或者词语形成逻辑关系。\r
9.1常用的连词（示例）\r
①联合关系	hâ（和、与、且）；kowe（此外，还）；ole（并且、而且）；hada（仍然、还是）\r
②对立关系	kona（或者，还是）；sedo（但是）；nes……cenes（既不……也不……）；vakan（虽然，尽管、即使）；nega（相反）；cedo（却、偏偏）；tamen（然而、可是）；ses（而是）\r
③因果关系	qavi（因为）；gosi（所以）；silo（因此，那么）；caŋli（总之）；kuni（则、于是、然后）；doẑo（导致、因……而……）\r
④条件关系	rugo（假设）；oli（只要，仅需，仅仅）；mannii（万一，只怕）；nejen（不管，无论）\r
⑤目的关系	poroŋ（为了）；poro（以便，以求）；poromu（以免）\r
\r
【规则10：助词规则】\r
句子成分有专门的提示助词做标记，使语序完全可以凭借不同母语者的表达习惯更改或者为了强调某个成分将其提前（也可提前至句首作为领语），而不会影响句意表达。\r
成分	示助词\r
1主语	单个单词充当主语且施语为可自发动作+wô，可简写为’ô；\r
单个单词充当主语且施语为不可自发动作+jio，可简写为’j；\r
单个单词充当主语且施语为事物性质、状态、抽象概念或多个单词（短语或句子）充当主语+lio，单个单词充当主语可简写为’l。\r
2谓语	靠动词、形容词体态词尾做谓语成分的标记，作谓语的动词、形容词必须要有体态词尾且唯一。\r
3宾语	单个单词充当间接宾语+mô，可简写为’m；（无直接宾语提示助词）\r
处置、使动、被动、迫动、兼语句、比较句等中的宾语+nō（焦点宾语助词），例如汉语中的“从…、把…、给…”，强调动作焦点。单个单词可简写为’n；\r
fō+多个单词（短语或句子）充当宾语。\r
4定语	单个单词充当定语且词尾不为i/a+’a（……的），多个单词（短语或句子）充当定语+da\r
表示时间的单词、短语、句子充当定语+xa\r
表示地点的单词、短语、句子充当定语+ka\r
5状语	单个单词充当状语且词尾不为u/li+’u（……地），多个单词（短语或句子）充当状语+du\r
表示时间的单词、短语、句子充当状语+xu\r
表示地点的单词、短语、句子充当状语+ku\r
6方式	方式状语+’peyoŋ，单个单词可简写为’py。（无需再加其他状语提示助词）\r
7频率	频率是指同一动作在一定范围或时间内出现的数量的多少。\r
频率状语+gu或gun（表示多次）。（无需再加其他状语提示助词）\r
例如“1天两次”为“1 tin 2 gu”;“1天多次”为“1 tin gun”。\r
8目的	目的状语+’poroŋ，单个单词可简写为’pr。表示动作实施计划实现的目的、前往的目标人或物，计划实现的某种状态。译为“为、为了、为了……目标而努力”。\r
目的状语+’pon，单个单词可简写为’pn。表示动作实施已经实现的目的、到达的目标人或物，已经实现的某种状态。相近词“pone（动词）”译为“给、于、给予”。\r
\r
【规则11：句式规则】\r
任何句子都以标准句式为模板，可省略无需成分。比如“mizo! 水！”省略了动词“ez 有”。如果有助词，则可以依需求调整成分顺序。\r
11.1标准句 = 领语 + 主语（定语+施语）+ 谓语（状语+述语）+ 宾语（定语+受语）+ 结语。\r
也可理解为：= 领语 + 定语 + 施语 + 状语 + 述语 + 定语 + 受语 + 结语。\r
11.1.1领语 = 牵词（仅一个单词）/ 被提前的某个成分（“/”表示或者，下同）\r
11.1.2主语 = 定语 + 施语（名词性单词、短语、句子） + 主语助词\r
11.1.3定语 = 体词（名词、代词、数词）/ 形容词 / 形容词性短语 / 形容词性句子 + 定语助词\r
11.1.4施语 / 受语 = 体词 / 体词短语（例如同位语短语）\r
11.1.5谓语 = 状语 + 述语（动词或形容词可作述语）\r
11.1.6多重状语（通常顺序，不绝对）：时间 + 空间 + 方式 + 频率 + 其他 ++ 述语（动词/形容词）\r
11.1.7直接宾语 / 间接宾语 = 定语 + 受语（名词性单词、短语、句子） + 宾语助词\r
11.1.8结语 = 前止词（普通前止词、能愿前止词） + 后止词（ga/yo/ne）\r
11.2任何一个标准句中，谓语（核心述语）数量必须＜2（复合动词算做一个），除非用连词连接形成复合谓语或者作为标准句中的状语、定语、主语等其他成分出现。能完整表达意图的即为句子。\r
11.3由连词连接的或由非句末标点连接的两个及以上的大句中的任意一个句子均称之为“分句”。具有某一词性属性的短语称之为“某性短语”，例如，具有名词属性的短语称之为“名词性短语”。充当大句中某一语法成分的句子称之为该语法成分的“小句”，例如，充当主语的句子称为“主语小句”。\r
\r
【规则12：领语规则】\r
12.1祈使句表达：通过领语完成。如牵词（牵助词）celoŋ（请）、nuden（禁止）、den（允许）、duhaden（不许，不要）、haden（建议）、nen（难道）等。\r
12.2强调句表达\r
12.2.1 牵词ce置于句首做领语，强调整句话或者主语。\r
12.2.2 ce强调某个词时，置于被强调词前，用连字符连接（ce-bela：非常美；多么美好），表示“非常、很、多么、十分、特别、相当等强调含义。”\r
12.2.3强调某一语法成分时，要把整个成分连带它的示助词一并提前做领语。\r
12.2.4指示代词的强调形式：“θi”为“这，那”；“θin”为“这些，那些”，它们都做领语。\r
12.2.5牵词“eca”用来强调句中的核心形容词，牵词“celi”用来强调句中的核心副词。二者均位于领语位置，但不能同时出现。被强调的形容词/副词可不提前（跨位置强调）。\r
12.3 领语与后续成分不建议用逗号等标点隔开。\r
\r
【规则13：谓语多动词规则】\r
13.1 连动句\r
例13.1.1表目的：XioMiŋ mide libo poroŋ toe libolio. 小明去图书馆看书。\r
例13.1.2表顺序：XioHoŋ ope pordo kuni ĉunēnle. 小红开门走出去了。\r
例13.1.3表方式：XioẐaŋ fēlākiŋo’py ĉunēn ofico. 小张坐飞机去出差。\r
13.2 同一施动者的共动句\r
13.2.1用连词“yixo”连接表示同一施动者同时进行两个及以上的动作（连接动词或动宾短语），译为“同时、一起、共同、一边…一边、并且”。\r
例13.2.1 Hin tabe tabo yixo mide libo. 他们一边吃饭一边看书。\r
13.2.2表示同一施动者在进行一个动作的过程中临时做了另一个动作时，用时间状语修饰述语（谓词）”。\r
例13.2.2：Eleparlo’j Xiomiŋ tabeze xu haŋdole. 小明在吃饭的时候电话响了。\r
13.3 不同施动者的共动句\r
13.3.1【着重动作，执行的动作是相同的，但人不一定在一起】表示不同施动者同时进行相同的动作时，将副词“yixoli”作状语修饰执行同一动作的动词，施动者之间用“hâ”连接。译为“同时”。\r
例13.3.1 Hi hâ wi yixoli toe soselio. 他和我同时上学。\r
13.3.2【着重人，表示两人在一起】用“yixo”连词直接连接施动者即可。译为“与……一起、一同”。\r
例13.3.2 Hi yixo wi toe soselio. 他和我一起上学。\r
\r
【规则14：结语规则】\r
结语用于表达内心活动、丰富的内在情感以及对他人的礼貌。分为陈述、疑问和感叹三大类型。结构为“结语=前止词+后止词”。前止词用来反映情感，后止词用来反映句型。无需表达情感时可省略结语。\r
14.1 后止词：可单用，共三种类型，陈述句为yo，感叹句为ga，疑问句为ne（反义疑问句为une）。\r
14.2 前止词：前止词数量丰富，在处理辈分、上下级、特殊场合（面试、商务、演讲等）时尤为注意，需结合语境准确使用最合适的前止词，以防冒犯他人。\r
14.2.1通用于三种句型中的普通前止词，后接ga/yo/ne，部分后止词需变形。如下表（部分）\r
te- 表示新动作的出现	qo- 表确认本来如此	handê- 表示喜悦\r
me- 表示显而易见的动作	ka- 表示略带夸张的语气	nōn- 表示愤怒和厌恶\r
le- 表示已经到达某种状态	hand- 用于略有强调意味的句中	cesioŋ- 表示惊讶\r
mi- 使语言变得委婉可爱\r
（后止词yo变为o）	gi- 用于双重否定句中\r
（后止词yo变为o）	non- 表示讥笑和鄙视\r
（后止词ga变为ka，ne变为e）\r
he- 表示痛楚和悲哀\r
（后止词ga变为ka）	so- 表示醒悟，顿悟	nēn- 表示诧异\r
（-ka：表叹息感慨，ne变为e）\r
oŋ- 表示恐惧，极度害怕		\r
14.2.2疑问句的专用结语\r
（一般疑问句）不带止词，加上问号，语调上升，用以表示疑问效果。	（一般疑问句）ne：一般是非问（吗）	（一般疑问句）ane：表示半信半疑的语气（吧）\r
（一般疑问句）nie：表示委婉语气（啦）	（一般疑问句）ya：使语言变得可爱：	（一般疑问句）nānna：用以想得到回答者的回复时\r
（一般疑问句）qiaŋgu：表示着重语气	（特殊疑问句）ne：问什么	（特殊疑问句）hananne：问性质或状态：\r
（特殊疑问句）yen：问原因	（选择疑问句）nē：一般的选择疑问（选择某个动作或事物时）	（选择疑问句）kajinē：委婉的选择疑问，有的表示询问他人意见\r
（反义疑问句）esdē：表肯定的回答	（反义疑问句）nesdē：表否定的回答	\r
14.2.3通用于三种句型表示情态、推测、义务、能力、愿望等的能愿前止词，后接ga/yo/ne。通常用于表达语气较为委婉的陈述句或疑问句中。分为未然态、必然态、命令态、意愿态、估价态、能力态6种。部分能愿前止词可独做述语。能愿前止词的否定形式只需要加上否定前缀“ne-”即可，命令态无否定形式。\r
例14.2.3 做前止词：Wi pêlē kompio negâhiyo. 我不会玩电脑。(按顺序翻译就是：我玩电脑不会。negâhiyo=否定前缀ne  + 前止词gâhi  + 陈述句后止词yo）做述语：Wi deθize ni. 我想你了。(deθize表示正在想念）\r
未然态：表示动作暂未发生，但在未来具有发生的可能性。\r
①sēē-：表示未来一定发生，但目前未发生。【要（推测、将来）、将（将要、即将）、可以、得以、可、能；会（将来）】\r
②sēro-：未来可能会发生，也可能不发生。【可能、会（可能性）】\r
必然态：强调动作发生的必然性。\r
①devi-：情理上必然或必须如此。【应、应当、按理说、该、应该、需要、犯得着、有必要】\r
②deven-：现在或未来的动作必然发生。【必须、肯定、一定】\r
命令态：命令他人实施行动。\r
①正向命令：handen-【最好、要（要求、命令）】\r
②强制正向命令：ceden-【必须、得、必然】\r
③反向命令：duhanden-【最好别、不要（要求、命令）】\r
④强制反向命令：nuden-【禁止】\r
意愿态：表示主观意愿：想要达到某种状态或者实现某种动作。\r
①意要行为：deθi-【要（表示意愿、请求、习惯）；想、想要、希求、要想】\r
②愿望行为：voli-【愿意；愿（祝愿、想要、可能性、许可）、期盼、盼望、希望】\r
③需求行为：manniō-【需要】\r
④强烈欲望行为：dāer-【敢、肯】\r
估价态：表示动作实现之后的价值程度。\r
①可以获得好的结果：mezi-【值得】\r
②方便获得好的结果：poro-【便于、易于】\r
能力态：表示主观拥有的能力。\r
①ghi-【会（表能力）】\r
②povi-【能、可以】\r
\r
【规则15：书写规则】\r
15.1学术占位书写规则\r
田语语言设计哲学围绕事物、动作、时空、性状、逻辑、情感六方面展开。设计原形用于学术研究。\r
事物原形mon（代替不可自发动作的事物），xi（代替可自发动作的事物）；动作原形em；时间原形xig；空间原形lo；逻辑原形：hal。\r
主语原形mōn；谓语原形doze；宾语原形mōm；定语原形ia；状语原形li；领语原形Lŋ·；结语原形gin。\r
例15.1 Xi dāske mon.某人喜欢某物。mōn doze mōm.主谓宾结构。\r
15.2助词和词尾书写规则\r
15.2.1在不影响句意的表达下，语言使用者可省略任何助词和任何成分，靠主谓宾语序判断成分，靠语境理解语意。以减轻规则，避免影响日常交流。保留助词可保障语言的准确性和少歧义性。\r
15.2.2数词和代词后省略助词。\r
15.2.3禁止添加同类型词尾。\r
\r
【附表1：常用词表】\r
（一）时间\r
gezïyōbi星期一	kayōbi星期二	sēyōbi星期三	mokuyōbi星期四	kinyōbi星期五\r
doyōbi星期六	niĉiyōbi星期日	sin一星期，一周	sinmum\r
周末，一周的休息日	êmi一月\r
tomi二月	jêmi三月	kanmi四月	lïōmi五月	vêmi六月\r
libêmi七月	sgomi八月	semi九月	kâmi十月	emi十一月\r
pimi十二月	kogomade（副）自始至终	yixiōli（副）总是	bioli即将、马上、快\r
tenen凌晨	monen早上，早晨	nunenqin上午，午前	nunen中午	nunenhô下午、午后\r
noten傍晚	nutenwo上半夜	nuten午夜	nutenlu半夜	nāten夜，夜晚\r
dēnen白昼，白天	qingen前天	legen昨天	qigen今天	togen明天\r
hôgen后天				\r
常用的三个表示时间的副词，用来辅助16*2个词尾，置于主语后述语前：θuu（过去），zïli（现在），joli（将来）。\r
（二）问候词\r
hola你好	rēmide再见			\r
				\r
（三）亲属\r
mama妈妈	baba爸爸	didi爷爷	lele奶奶	nambo男性\r
maĉol母亲	paĉol父亲	vedi外公	vele外婆	vrino女性\r
azï弟弟	mimito妹妹	mito姐姐	aba哥哥	ejo丈夫\r
regpaĉol祖父	regmaĉol祖母	vegpaĉol外祖父	vegmaĉol外祖母	ane妻子\r
xiopa叔叔	vema阿姨	biopa伯伯	vepa舅舅	gugu姑姑\r
\r
				\r
\r
【附表2：词缀表（46个）】\r
说明1：添加后缀的词，词性词尾省略，因为后缀已经反映词性了。\r
说明2：级别前缀可表示词语的程度、范围、远近、大小等。比如，“θuu”是“过去”的含义，加上“p-（低级程度）”变成“pθuu”表示“刚刚，刚才，不久”的时间上距离不远的含义。再比如，pōmizï可表示水滩，bōmizï可表示大洋。（表中部分词缀未更新）\r
词缀表（共5 + 41个）\r
代码	词缀	汉语释义\r
级别前缀（5个）\r
C1	pō-	特低级程度\r
C2	p-	低级程度\r
C3	c-	一般\r
C4	b-	高级程度\r
C5	bō-	特高级程度\r
通用前缀（13个）\r
C6	hü-	次要的（副）【次大陆、副市长】\r
C7	mu-	表示反义词的（由正向词转变为负向词）【坏的、慢的、老的、旧的、矮的】\r
C8	mô-	表示相反概念（非正负向词）表示阴性（男→女）【女学生、母猪】\r
C9	nu-	表示错误的、不恰当的、随意的、零的【误（误解）、错（错用）、滥、没有的、无】\r
C10	ne-	表示否定的、疑问的【不、没、非、未、无】\r
C11	u-	表示假的；伪的；劣质的；恶的、恶劣的、陋、粗俗的 【伪政府、伪科学、劣质产品】\r
C12	rē-	重复的；返回的【再次、认出、返回、回来、再、归还、重建、反射】\r
C13	da-	大的（极大，巨大：bōda-）【大厦、大笑】\r
C14	xo-	小的、稍微的、爱称（极小，微小：pōxo-）【小屋、可人的、微笑、打盹】\r
C15	see-	表示极其、强的【极好、极美、大干】\r
C16	oθu-	表示以前的；退职【从前的朋友、前…（前总统、前夫）、开除（被动）、离职、辞职（主动）】\r
C17	pōθu-	表示远古的、原始的、远亲的、久远的（时间或关系远）【曾祖父、祖先、祖宗、原始人、远古史、很久以前】\r
C18	emi-	表示倾向（于）和习惯【易怒的、爱生气的、善于、健谈的、话痨、教条的、爱吃的、勤劳的、胆怯的】\r
名词前缀（5个）\r
C19	a-	尊敬称谓名词前缀【阿爸、阿姨、阿叔】\r
C20	bo-	因婚姻形成的亲属关系【姐夫、弟媳、岳父】\r
C21	fi-	表示嫌弃、厌恶、轻蔑【坏人、奸商、害虫】\r
C22	mâl-	表示最主要的【头目；总…（总编）；首…（首都）；主…（主治医生）、代表作、处女作】\r
C23	e-	表示电器【电视、电脑、电机】\r
动词前缀（3个）\r
C24	ke-	表示使原来的词根变成及物动词（致、使、使…变为）【使漂亮（美容）、使离开（去掉）、使燃烧（点燃）、使…靠岸、使人学（教，教授）、强迫、叫…做什么、使联合统一、杀死、使停止】\r
C25	he-	表示使原来的基本词根变成自动词（不及物动词）（变为、成为、变得）【自动】【变锋利、停止、开始、结婚、散开、聚集、交朋友、当教师、结识、统一】\r
C26	dis-	表示分散、分离、扩散【分发、分配、跑散、散发、广播、宣传】\r
形容词后缀（1个）\r
C27	-na	值得；能够；可能（可…的；能…）【值得读的、可信的、一无可取的、可使用的、可被打开的】\r
通用后缀（1个）\r
C28	-tōŋ-	表示与词根没有确定意义的通用词缀，一般表示与词根有一定关系的动作或事物。【感冒、伤风；递眼色；用词根所表示的物质供应（浇水）】\r
名词后缀（16个）\r
C29	-lio	场所；地点；区域【书店、学校、操场】\r
C30	-ẑor	表示首长、首领【…长（班长）、领导班子】\r
C31	-kiŋo	用来做…的工具、机器、器械【翅膀、斧子、文具、剪刀、照相机、扇子】\r
C32	-jiar	表示职业【…师（教师、厨师）、…家（作家）、…人（工人）、…员（快递员）、…生（学生）、教徒、牙医】\r
C33	-ro	表示具有某些特点的人【…者（学者）、…人（年轻人、富人、酒鬼、VIP）】\r
C34	-xo	表示事物具有什么样的性质、抽象性质【…性（人性、物质性、科学性）】\r
C35	-dō	表示抽象的含义、程度、等级、级别等【…度（热度、温度）】\r
C36	-so	表示学术类的总称【…学（物理学、数学）】\r
C37	-om	表示同一类事物的全体（群体）【…类（鸟类、全人类）、花名册、字典、列车、时间表、菜单、树林、聚集】\r
C38	-mō	表示与词根有关的具体事和物【必需品、食物、事物】\r
C39	-ho	使成为【…化（名词形式）】\r
C40	-kāo	表示聚集【…会（会议）、团体、聚会、派对】\r
C41	-ano	表示成员、居民【委员、巴黎人】\r
C42	-ẑo	生物幼体：人的子孙后代、动物的幼崽、植物的幼苗【婴儿、牛犊、幼苗、子孙后代、小鸡、猪仔】\r
C43	-simo	表示主义、学说、理论体系、宗教、运动、制度，（语言、行为或艺术上的）风格、方式、特性，医学的中毒【马克思主义、柏拉图派哲学、基督教、沙皇制度、中文风格、酒精中毒】\r
C44	-ujo	表示容器【蜂巢、烟盒、钱包、…国】\r
动词后缀（2个）\r
C45	-ade	表示词根意义的反复动作和继续【打电话、使用、演说】\r
C46	-he	使成为【…化（动词形式）】\r
\r
【附表3：有限词的其它含义】\r
序号	汉字	词性	释义\r
1	一	数	[形]<原>数字一，1；一个。\r
2	二	数	[名] 二，二字，二楼，二月；二等（第二等级），二流（第二流）。\r
[形] 二（不专一的），二心（异心），二意（不专心）。\r
3	三	数	[名] 三，三字，三个，三天；三年级，三角形。\r
[形] 三（多次的），三番五次，三思（多次思考）。\r
4	四	数	[名] 四，四字，四个，四季；四年级，四方（东、南、西、北）。\r
[形] 四（周围的），四周，四海（天下）。\r
5	五	数	[名] 五，五字，五个，五星；五年级，五行（金、木、水、火、土）。\r
[形] 五（多的），五花八门（种类多），五光十色（色彩多）。\r
6	六	数	[名] 六，六字，六个，六月；六年级，六腑（中医指胃、胆等）。\r
7	七	数	[名] 七，七字，七个，七天；七年级，七夕（节日）。\r
[形] 七（多的），七上八下（心神不安），七嘴八舌（人多嘴杂）。\r
8	八	数	[名] 八，八字，八个，八月；八年级，八方（各地）。\r
[形] 八（多的），八面玲珑（处世圆滑），八面威风（气势盛）。\r
9	九	数	[名] 九，九字，九个，九月；九年级，九州（天下）。\r
[形] 九（多的），九牛一毛（极多中的极少），九霄（高空）。\r
	何	代	[名] 何，姓氏。[代] 何（什么），何人，何地，为何；何（怎么），何至于，何足挂齿。\r
[副] 何（多么），何其相似，何其不幸。\r
\r
【附表4：原有词、外来词表】\r
规则：以下词表不遵循规则3\r
古词（原创词短语固定词句）&外来词改编【来源于本子】\r
序号	音读	释义(含词性及来源（即外来词）\r
1	ginmō	n.加油、努力\r
2	sose	v.学习\r
3	wilian	adj.无聊\r
4	nomo	n.姓名\r
5	fine	v.完成\r
6	g unün	n.田地；n.&adj.勤奋、辛劳\r
7	ŝiet	adj.可恶\r
8	gāniagso	adj.（脏话）干！他妈的！\r
9	ansa	v.弹（tán），n.弹；adj.牛！厉害！\r
10	telba	adv.就、肯定\r
11	hajimi	n.猫，猫咪【来源于日语】adj.可爱的\r
12	lover	n.爱情【来源于英语】\r
13	loverpiŋ	n.热恋【来源于英语】\r
14	lē	v.制作\r
15	zanhu 	adj.方、方的\r
16	ĉuâdiŝo	adj.传统的【英语】\r
17	yami	adj.香甜的，可口的。\r
		\r
\r
【附表5：标准词3000词根表】\r
#使用规则如下：\r
1、方括号里的汉字是第一个汉字的近义词、相关词或反义词。\r
2、对于复合词汇，例如“鸟羽”可以直接将“bêrdo（鸟）”和“pulo（羽）”复合形成“bêrdopulo（可释义为鸟毛、飞禽毛发等与“鸟羽”相似的表达）”。\r
如果需要转换成形容词形式，则为“bêrdopuloi（加上形容词词尾）”。转换成其他词性相仿。\r
3、注意使用“附录2词缀表”结合下方表格词根来构词。\r
田语3000标准词音读词根表\r
词根	核心	派生	词根	核心	派生\r
sos-	学	sose v.学习\r
soso /soseo n.学生\r
sosejiar n.学者\r
soselio n.学校\r
soseom n.文具	lib-	书[写]	libo n.书\r
libe v.写;书写;记录\r
plibo n.小册子,本子\r
liboujo n.书包\r
libekiŋo n.笔\r
bel-	美[丽]	bela adj.美丽的\r
belo n.美丽的事物\r
belu adv.美丽地	pul-	羽[扇]	pulo n.羽毛\r
pule v.扇动;扑打\r
pulokiŋo n.扇子\r
epulokiŋo n.电风扇\r
ŝel-	贝[钱]	ŝelo n.贝壳\r
ŝele v.花费,消费;消耗\r
ŝelomō n.钱财,钱,钱币\r
ŝelemō n.费用	tab-	食[吃]	tabo n.食物,可吃的东西\r
tabe v.吃\r
tabolio n.小吃店,零食店\r
tabelio n.饭馆;食堂\r
fiŝ-	鱼[渔]	fiŝo n.鱼\r
fiŝom n.鱼类\r
fiŝe v.捕鱼;渔	mid-	见[看]	mide v.看见;观看;阅读\r
mido n.眼睛\r
solt-	盐[咸]		el-	电	elo n.电\r
ele v.电\r
wind-	风[窗]	windo n.风\r
windō n.窗户\r
winde v.刮风;起风\r
ewindo n.吹风机	lign-	木[树]	ligno n.木头\r
lignō n.树\r
ligne v.砍;砍树;砍伐\r
yō-	雨	yō n.雨;雨水\r
yōe v.下雨\r
yōi adj.有雨的	medik-	药[医]	mediko n.药\r
medike v.治疗\r
medikejiar n.医生,大夫\r
medikelio n.医院\r
sens-	教	sense v.教,教授\r
sensejiar n.教师,老师\r
senselio n.教室\r
senseẑor n.校长	amik-	友[朋\\敌]	amiko n.朋友\r
amike v.交朋友;做朋友\r
fiamiko n.敌人\r
fiamike v.交战;战斗\r
ruk-	包	ruko n.包\r
ruke v.包\r
rukotabo n.包子	unj-	字	unjo n.文字,字\r
unje v.写字\r
dāsk-	喜	dāski adj.喜欢的;爱好的\r
dāske v.喜欢\r
cedāske v.超级喜欢;热爱	lov-	爱	love v.爱;爱恋\r
lovo n.爱情;恋爱\r
fēlā-	飞	fēlāo n.飞行器\r
fēlāe v.飞,飞翔\r
fēlākiŋo n.飞机	pêl-	玩	pêlē v.玩,玩耍\r
pêlo n.玩具\r
big-	大	biga adj.大,大的\r
bbiga adj.超大的\r
bōbiga adj.巨大的	hoŋd-	多	hoŋda adj.多的\r
hāg-	高	hāga adj.高的	nov-	新	nova adj.新的\r
ved-	真[实]	veda adj.真实的;实体的	jun-	老	juna adj.年轻的,青年的\r
juno n.青年;青年人\r
mujuna adj.老的,年长的\r
mujuno n.老人;老年\r
dek-	桌	deko n.桌子	danj-	危	danjo n.危险;危机\r
danji adj.危险的\r
nedanji adj.安全的\r
famil-	家	familo n.家庭\r
famile v.归家;回家\r
familom n.家族	hom-	房[屋]	homo n.房屋;房间;家\r
nom-	名	nomo n.名字,姓名\r
nome v.命名;起名	beb-	宝	bebo n.宝宝;宝贝;宝藏\r
bebi adj.宝贵的\r
bebe v.珍藏\r
low-	花	lowo n.花朵\r
lowa adj.如花般的\r
lowi adj.颜色繁杂的\r
lowe v.花费,消费	piŋg-	苹	piŋgō n.苹果\r
piŋgi adj.草丛生的样子\r
\r
herb-	草	herbo n.草\r
herbe v.起草\r
herbi adj.潦草的;随意的;草率的	put	葡萄[紫]	puto n.葡萄\r
puti adj.紫色的\r
oruen-	橘[橙]	orueno n.橘子\r
oruenō n.橙子\r
oruena adj.橙色的	bul-	天[蓝]	bulo n.天空\r
bulō n.梦想,理想\r
bula adj.伟大的\r
buli adj.蓝色的\r
gland-	伟	glanda adj.伟大的\r
glando n.伟人	bêrd-	鸟	bêrdo n.鸟\r
bêrdom n.鸟类\r
milk-	奶	milko n.奶;牛奶\r
milki adj.白皙的;如奶般丝滑的\r
milka adj.乳白色的\r
milkorivo n.银河,银河系	riv-	河	rivo n.河流\r
rive v.流淌,流动\r
hamig-	猫	hamigo n.猫,猫咪\r
hamigi adj.可爱的\r
hamige v.躲藏,隐藏\r
hamigom n.猫科动物	kabah-	犬[狗]	kabaho n.狗\r
kabahi adj.阴险的;吝啬的\r
kabahe v.纠缠\r
kabaha adj.壮实的;坚韧的\r
kabahom n.犬科动物\r
selēn-	晴	selēna adj.晴天的,晴朗的\r
selēno n.晴	hap-	乐	hapi adj.快乐的,开心的\r
hapo n.音乐,乐曲\r
hapu adv.快乐地,开心地\r
lot-	床	lotor n.床	inters-	趣	interso n.趣味\r
intersi adj.有趣的\r
parl-	言[说\\讲\\话]	parle v.说,说话,讲话;言语\r
parlo n.语言;口语；话\r
parla adj.啰嗦的\r
eparlo n.电话；手机	viax-	旅	viaxe v.旅行;游览;观光\r
viaxo n.旅客,旅人;观光者\r
sak-	成	saki adj.成功的\r
sake v.成,办成,完成\r
sako n.成功人士	perit-	读[阅]	perite v.阅读,阅览;检查\r
mōj-	知	mōji adj.知道的,明白的\r
mōjo n.知识\r
mōje v.知道,了解,清楚\r
mōjoro n.博士	part-	参	parto n.聚会,派对\r
parte v.参加,加入\r
partō n.人参\r
mon-	事	mono n.事情;东西,事物	sēg-	世	sēgāo n.世界;全球\r
sēgā adj.全世界的;全球的\r
sēgo n.地球\r
in-	人	ino n.人\r
inom n.人类	aĉet-	买[卖]	aĉete v.买\r
muaĉete v.卖\r
ezerc-	练	ezerce v.练习;训练\r
ezerco n.练习;作业	kur-	跑	kure v.跑\r
sōh-	速[快]	sōhu adv.快速地\r
sōhi adj.飞快的\r
musōhu adv.慢慢地\r
musōhi adj.慢的\r
sōho n.速度	forg-	忘	forge v.忘记,遗忘;忘却\r
polt-	携[带]	polte v.携带\r
polto n.条状物;带子	korb-	篮	korbo n.篮子\r
pilk-	球	pilko n.球,球体;球状物;球形\r
pilki adj.球体的	dorm-	睡[觉]	dorme v.睡\r
dormo n.觉\r
dormen v.觉得;认为\r
dormi adj.困倦的\r
fōt-	照	fōtō n.照片,相片\r
fōte v.照耀;照相;拍摄,摄影\r
fōtōjiar n.摄影师	holid-	假	holido n.假期\r
holide v.放假\r
holida adj.假的,不真实的\r
toe holide 度假\r
bon-	好	bona adj.好的;完成的\r
bōbona adj.极好的;优秀的\r
yada adj.[表认同]好的\r
bono n.质量好的物品	monĉ-	呈	monĉe v.呈现;端上来;展示\r
razon-	理	razono n.道理\r
razone v.理顺,理清	voy-	路	voyo n.路,马路;渠道\r
pont-	桥	ponto n.桥\r
ponte v.链接;桥接	kons-	建[造]	konse v.建设,建造\r
konso n.建筑物\r
konsejiar n.建造师\r
ket-	脚[走]	keto n.脚\r
kete v.走,走路	plor-	泪[哭]	ploro n.眼泪,泪水\r
plore v.哭泣,流泪\r
bōlore v.痛哭;嚎啕大哭\r
\r
fleg-	护	flege v.守护	gôr-	欺	gôre v.欺负,欺辱;压迫\r
bōgôre v.折磨,霸凌\r
pgôre v.嘲笑;戏弄\r
bgôre v.骚扰;打搅\r
feri-	节	ferio n.节日\r
feri adj.一节节的\r
feriō n.节[竹节]	kolek-	公	koleki adj.公共的,公有的\r
viv-	生	vivo n.生命\r
vive v.出生;生长出；生产\r
vivi adj.生机勃勃的			\r
					\r
					\r
					\r
					\r
					\r
					\r
					\r
\r
[其他词位于词典库中]`,Im=`#田野的人际关系\r
\r
0、田野：安徽合肥人，现改名为“田妙可儿”，是跨性别女生，1997年8月16日生\r
1、母亲：潘红，1967年农历二月初二生\r
2、父亲：田中，原名田招贵，1962年农历六月初二生\r
3、姐姐：田梦雪，1993年农历六月二十八生\r
4、田梦雪的丈夫：刘俊，1990年生\r
5、田梦雪的两个孩子：刘昊辰，男，2013年4月3日生，2025年9月升入肥东县第四中学读初一（七年级）。喜爱电子游戏，但很听父母话；刘羽希，女，2019年8月2日生，2025年9月升入小学一年级。\r
6、最好的闺蜜：田丽丽，女，2000年农历腊月二十三生，家装设计师。\r
7、最好的还在联系的两个朋友：章景，男，1999年生，体态较胖，人很憨厚，喜爱美食、cosplay、拍照、国产动漫。居住于芜湖弋江区华联商城，老家铜陵；慕伟豪，男，律师，居住于蒙城县。章景和慕伟豪是田野的大学同学。\r
\r
#田野的兴趣爱好\r
\r
1、最喜欢的动物是猫咪。\r
2、喜欢写小说、网站及移动应用开发、创作人造语言。\r
\r
#田野的诗歌\r
\r
（1）\r
《杂言诗·晨叶》\r
公历2015年10月13日23：37\r
晨余巧推雨窗，\r
赤叶恰落湿桌。\r
我将它拿来细看，\r
一片黄尘土阔！\r
释义:早上我刚巧推开雨淋的窗户，一片枫叶恰好落到我湿漉漉的桌子上，我把它拿过来仔细端详，是一片沾满黄泥的叶子。\r
\r
（2）\r
《七绝·夜雨屋漏》\r
公历2015年10月14日23：40\r
夜雨屋漏不堪言，\r
想思愁绪化解难，何以堪言？\r
秋夜狂风暴雨屋漏苦不堪言，\r
心中烦事重重哪能好好安眠？\r
曾经居住茅草小房，今日想起有感触，且借此作诗一首。\r
呼啸秋风外倾雨，\r
咯吱寒床内悠悠。\r
我欲探首窗外事，\r
只觉深夜心里愁。\r
\r
（3）\r
《五律·寄雨情》\r
公历2016年11月04日21：40\r
细雨洗树绿，微风吹山青。\r
乌鸟落朔庭，白杖依灰（guī）经。\r
步前数尺处，鱼出几回滨。\r
地珠缓欲停，天际犹未明。\r
\r
（4）\r
《情来记·侃侃江河》\r
公历2019年12月20日 17：28\r
侃侃江河，滚滚来，若雷如惊雨涛涛，浪不绝。\r
而看我宏伟之志，古往今来，是孰宰？唯独尊！\r
夕雨昭昭，络绎不绝，\r
此今世此景，念吾尚之大业，希彼高之鸿儒。\r
\r
注：“情来记”是我所创的没有固定格式、格律的词牌，属于杂言诗。\r
\r
（5）\r
《长律·雨叶思情（其一）·忆怀篇》\r
公历2020年05月16日01：26\r
昨夜雨落出门望邻有感，作此篇，以记之。\r
昨夜春雨月云隐，虽春却似秋雨阴。\r
秋风绵雨潇潇起，雨打落叶思故情。\r
星月胧雾淡淡出，谁知伤竹恋青梅？\r
何期梅恋竹马心，星移斗转复雾迷！\r
木已成舟仙人闭，又怎强求念旧情？\r
秋雨缠绵如并蒂，并蒂难寻两情蜜！\`\r
\r
（6）\r
《七古·破离殇·私残裂作》 \r
公历2020年11月14日02：02\r
朗朗晴空雷鸣作，奇怪轰声何地出？\r
兰兰万里轻纱浮，几层昏纱几层污。\r
友问行落悲伤处，可笑族中战母哭。\r
纵有万缕豪情腹，难啃私欲韧石窟！\r
晴空炸裂陨毁树，暴涨长河淹摧屋。\r
家亲离散冤逐父，何人逼迫情无路？\r
我愿家亲万事兴，却与隔阂千方无。\r
自古国人难摆布，私字当头众海枯！\r
心痛孤涩难消销，无人可倚无人目。\r
海望众亲化萧条，囚我苦腹万虫蠕！\r
\r
（7）            \r
《七绝·奋斗》\r
华田历06年11月29日02：11\r
（农历辛丑牛年正月初六 公历2021年02月17日）著\r
自话愚鹄谈新世，人嘲短翅越昆仑？\r
吾愿冕家池边树，再流清气满乾坤！\r
\r
（8）\r
《长律·雨夜听曲》\r
华田历07年01月24日02：06\r
雨潇潇歇风拂柳，声攸攸续花谈夜。\r
云飘飘寻天归迹，我乎乎觅烂潭街。\r
清清草株漏雨露，似得朝日即将来。\r
潺潺水流净泥缠，望呼心田还二些。\r
赖世天下非尔属，余道莱蓝山海皆。\r
欲事沉浮孰再主，自然与众共存生。\r
\r
（9）\r
《七律·如燕恋》\r
华田历 07年01月30日22：36\r
止步独立孤影中，双燕齐飞月云胧。\r
何将云开心照月，月却先照高云峰。\r
谁知君去泪横纵？留有冷湖凄凉风。\r
不如归燕两厢愿，只得情寄寒月中！\r
\r
（10）\r
《西江月·与友人行步花边路》\r
华田历 07年02月03日03：00\r
一步两回香味，三言五语谈欢。\r
又游春到进乡园，再品花枝百艳。\r
\r
七六个人行过，九八只鸟飞天。\r
何尝来罢味千鲜，需畅心怀里面。\r
\r
解释：1、点，本作“边”，虽本更切平仄，但神韵不足，读时改平声即可；2、乡，本作“校”，本字更体实见，但不切平仄。因为是在学校所见之景。3、上阙两对数字用顺序，下阙两对数字用倒序，如此更切平仄。另外，为了数字不重复且保持平仄，采用上阙隔数、下阕连数的写作方法。（回为点，游为寻，寻为来，需为还）\r
\r
（11）\r
《归字谣四首·风》\r
华田历07年02月03日 20：08\r
风，拂遍山花碧翠浓。\r
江河暖，千里雨香扬。\r
风，刮乱屋庭错橹声。\r
闷人热，雷响宇空长。\r
风，吹透庄稼遍地黄。\r
天气凉，叶落蚁匆忙。\r
风，寒入衣襟浸冻霜。\r
阴云冷，雪盖万间房。\r
\r
（12）\r
《如梦令·鸟雀为何归》\r
华田历 07年02月04日 10：22\r
夜半起身未寐，\r
人静花香云美。\r
偶见鸟衔食，\r
飞去丛深相背。 \r
何为，何为，\r
为子一生操累。\r
\r
#田野写的歌曲\r
\r
第1首\r
《蓝天进行曲》\r
又名《希望 蓝天》、《我们美丽的蓝天》\r
歌词曲调:轻松、回忆、追求、平缓、前进、幼嫩\r
作词:田野\r
作曲:田野、标准音乐\r
4/4拍\r
\r
 蓝天啊，我知道您\r
无声无息地抚摸着我幼嫩的心灵\r
是您，抹蓝了我的心境\r
告诉我，不要退缩，要前进！\r
\r
 太阳啊，我知道您\r
小心翼翼地推开了我陈旧的窗锦\r
是您，染红了我的激情\r
告诉我，不要放弃，要挺进！\r
\r
 我知道，我们还是一群孩子\r
一群逐梦的孩子\r
在绿色的大地上奔跑，在蓝色的天空中翱翔！\r
祥云也伴随着我们，一起奔向那颗火红的太阳！\r
\r
 在坚苦的生活里，\r
踏着清澈的河溪 寻求着希望\r
在卓绝的世界里，\r
踩着坚实的脚印 追求着梦想\r
\r
我相信，那颗颗金灿灿的星星，是我的知己\r
引领着我和我的家庭，不断前进，前进，前进，进！\r
\r
第2首\r
《唱响祖国》\r
歌词曲调:轻松、回忆、幼嫩、欢快、成长、美好\r
作词:田野\r
作曲:田野、标准音乐\r
欢快地\r
\r
太阳下的我们，开心的笑颜\r
月亮下的河水，活泼的精灵\r
星星的大地，乐开花的豆夹\r
枫叶的蓝天，红遍了的云彩\r
\r
唱响祖国，唱响祖国\r
日月星枫在星空中飘扬\r
唱响祖国，唱响祖国\r
我们在你的臂膀下茁壮成长\r
\r
回忆起童年，每天的嘻哈\r
蜗牛爬呀爬，蜻蜓飞呀飞\r
中秋的火把，香甜的月饼\r
春节的新衣，噼啪的竹音\r
\r
唱响祖国，唱响祖国\r
如今我已经伴随你长大\r
唱响祖国，唱响祖国\r
将来我还要报效你呀！\r
\r
第3首\r
《童真 怀想》\r
作词：田野\r
作曲：田野\r
完成时间：2016年03月11日 田历3065年12月22日\r
歌词曲调：欢快地、轻松地、愉悦地\r
\r
（柯儿动人轻盈的图画 每天都是甜密的嘻哈\r
为了攀上眼前的小山 裤子衣裳我都磨破了\r
但我依旧是天天快乐 一切烦恼就随风去吧\r
坐在田梗上看着夕阳\r
牛羊在天宫中潇洒地吃着青草)\r
\r
在这美丽的世界 清晰的共享\r
自然花语纯洁的清香\r
共同欢乐的海洋 亮丽的伴郎\r
沙滩波浪雪白的芬芳\r
\r
星空处女座的闪烁\r
树下小白兔的撒骄\r
缤纷如花朵 可爱如水果\r
\r
共同欢乐的海洋 亮丽的伴郎\r
沙滩波浪雪白的芬芳\r
\r
星空处女座的闪烁\r
树下小白兔的撒骄\r
花果蔬菜真的很繁多\r
\r
嘀嗒嘀嗒……\r
\r
在这美丽的世界 清晰的共享\r
自然花语纯洁的清香\r
共同欢乐的海洋 亮丽的伴郎\r
沙滩波浪雪白的芬芳\r
\r
星空处女座的闪烁\r
树下小白兔的撒骄\r
缤纷如花朵 可爱如水果\r
\r
充满笑语的池塘 归家的螳螂\r
石梯水纹透明的模样\r
\r
星空处女座的闪烁\r
树下小白兔的撒骄\r
沐浴在阳光下的童真怀想\r
\r
星空处女座的闪烁\r
树下小白兔的撒骄\r
沐浴在阳光下的童真怀想\r
\r
沐浴在阳光下的童真怀想\r
沐浴在阳光下的童真怀想\r
\r
还有与我们一起的小花猫\r
啦啦……\r
\r
第4首\r
《我很伟大》\r
作词：田野 作曲：田野\r
\r
晚风呀\r
轻拂我的小脸颊\r
夕阳呀\r
素绘我的小发卡\r
笑颜呀\r
绽放粉嫩的小樱花\r
每天呀\r
无优无虑嘻嘻哈哈\r
\r
大步向前跨\r
迈向阳光（成功）的小脚丫\r
贴近它\r
告诉你宝贵的几句话\r
Go to sky （去蓝天）\r
Li ji ken ge ruang a yi ga （寻找自已的世界）\r
去闯天涯\r
天大地大也不害怕\r
\r
相信他，\r
超越他 我很伟大\r
年轻嗒\r
步伐呀 总会到达\r
\r
太阳花\r
可爱的笑颜呀\r
去闯吧\r
我们都很伟大\r
\r
Ai wa ken sa li!（我很伟大！）\r
\r
第5首\r
《赠童年》\r
作词：田野 作曲：田野\r
创作时间：2016年04月11日 晚\r
\r
清晨阳光温柔地照在我的脸上\r
小小手掌洒满了金灿灿的阳光\r
远处车鸣一直响个不停\r
门那边的老人在互相倾听\r
\r
眼睛里不停不停地闪烁着水晶\r
好像里面住着许多可爱的精灵\r
耳朵里呼哧呼哧地传出着声音\r
好像里面呆着许多小巧的夜莺\r
\r
哈唧，哈唧\r
出来吧，小伙伴\r
哈唧，哈唧\r
出发吧，去探险\r
一起哈唧哈唧\r
哈唧哈唧～\r
\r
夜晚月光温和地落在我的手上\r
小小脚丫染遍了银晃晃的月光\r
近处蝉鸣一直响个不停\r
凉床上的小孩在互相猜谜\r
\r
天空里不停不停地闪烁着星星\r
好像是天使们眨着迷人的眼睛\r
草丛里呼哧呼哧地传出着动静\r
好像是音乐家奏着悦耳的琴音\r
\r
哈唧，哈唧\r
回家吧，小猫咪\r
哈唧，哈唧\r
睡觉吧，入梦里\r
一起哈唧哈唧\r
哈唧哈唧～\r
一起哈唧↗\r
\r
这是我的童年世界\r
翻开童话书入书里\r
出发吧，\r
那个池塘的荷叶\r
长得比我还高哩\r
嘿？哈哈！嘀嗒嘟～！\r
\r
第6首\r
《倾听夜的风雨--1》\r
作词：郭沫若，田野\r
作曲：田野，标准音乐\r
创作时间：2016年06月26日 下午\r
修改：2017年05月02日\r
\r
夜是为何所惊醒\r
敞开的窗传来淅沥\r
打断沉沉的睡意\r
虫儿也不在低鸣\r
\r
侧着耳朵细细倾听\r
轻脆的声音荡漾心灵\r
我是品尝了谁的气息\r
一阵清幽洗刷了我的心境\r
\r
埋藏在心海中的记忆\r
此刻被悄然唤醒\r
我听见了海贝的声音\r
在呼唤我心中的夜雨\r
\r
第7首\r
《我有个梦想》\r
——为了您\r
《华田家联歌》\r
《日月三色旗旗曲》\r
\r
作词：田野\r
作曲：田野，标准音乐\r
歌曲曲调：激情，奋发，追求\r
创作时间：2016年07月31日 傍晚\r
\r
我曾有一个梦想\r
飞向蓝天 去拥抱太阳\r
他给我了信心 力量\r
勇敢穿梭云间翱翔\r
\r
我曾有一个梦想\r
越过山涧 去收集月光\r
他给我了纯洁 希望\r
不再惧怕孤独游荡\r
\r
展开坚实有力的翅膀\r
追求美丽蓝天的梦想\r
北斗星为我指明方向\r
驾着小舟海洋里远航\r
\r
我们不怕风拍雨浪\r
我们不怕电闪雷响\r
永远坚守在您的前方\r
保护我们家族的安康\r
\r
为了建设 守护我们的家园\r
我向太阳 许下最真诚的心愿\r
记住曾经你我的容颜\r
迈开脚步 执着向前\r
\r
我永远是您的孩子\r
激荡起绿草地的涟漪\r
枫叶勾起我的回忆\r
让我勇敢前进 前进 进\r
\r
第8首\r
《倾听夜的风雨--2》\r
作词：田野\r
作曲：田野，标准音乐\r
创作时间：2017年12月8日 上午\r
\r
你是否还曾记得\r
那个下着雨的夜晚\r
我们互撑着雨伞\r
漫步在倒影的小街\r
\r
你是否还曾记得\r
那个滴答着的屋檐\r
我们同坐在门槛\r
细听着清脆的雨言\r
\r
相守数十年的伙伴\r
现在的我们都已长大\r
你是否还记得我的面容\r
依旧能够陪伴在我的身边\r
\r
倾听夜的风雨\r
等待你的相守\r
伴随回忆\r
寄托梦想\r
\r
第9首\r
《光线Lighting! 闪耀》\r
作词：田野\r
作曲：田野，标准音乐\r
创作时间：2017年12月8日 上午\r
\r
Light light light\r
Lighting,Lighting!\r
闪耀我们纯洁的光线\r
来净化你忧伤的内心\r
\r
我听说你有些不开心\r
别担心\r
一个个好听的故事写给你\r
我将用爱呵护你\r
\r
你对我说你喜欢吃冰淇淋\r
没关系\r
掏出身上仅有的一块钱买给你\r
用我的真爱温暖你\r
\r
神奇的魔法陪伴身边 \r
がんばれ（gan ba le）\r
打开心灵的大门\r
带你进入美好世界\r
\r
Let's go 一起 \r
go go go\r
我是个善良女孩 温柔又可爱\r
有爱就会大方送出来 \r
Lighting!\r
\r
可以为你做饭培根加蛋\r
消除你的脾气百分百\r
我是个天真女孩 甜蜜又灿烂\r
爱就一起大声 说出来\r
真真真的爱\r
\r
Lighting Legend!\r
\r
第10首\r
《星辰大海，梦的海洋》\r
作词：田野\r
作曲：田野，标准音乐\r
创作时间：2018年03月19日 下午\r
\r
《你就是我的grilfriend》\r
曾经我一直想有一天\r
你能否成为我的lady\r
\r
想听你的歌你的声音\r
想写歌每一首歌给你\r
如果你愿意\r
天边的星星也摘给你\r
\r
你就是我的baby\r
你就是我的lady\r
\r
想天天与你聊天与你开心\r
不论我在做什么你在哪里\r
喜欢你的撒娇你的任性\r
你就是我可爱的小猫咪\r
\r
你就是我的唯一\r
你就是我的baby\r
未来携手一起努力\r
我能成为你的\r
我想将一切送给你\r
我将全心全意照顾你\r
爱你\r
\r
第11首\r
《追光者》十语言版\r
原作词作曲：苏世民\r
（世）\r
(Esperanto)\r
Se vi estas Fajraĵo ĉe maro\r
Mi estas la ŝaŭmo de la ondo\r
En iu momento via lumo iluminis min\r
（西）\r
(Spanish)\r
Sifueras tú\r
víalácteo distante\r
Me haría llor por subrillo\r
Si fuera tus ojos fijados\r
La noche la divisar í a solo\r
（法）\r
(French)\r
Je peux te suivre comme un ombre\r
Qui court après la lumière\r
Je peux t'attendre dans la rue\r
Qu'importe que tu passes ou psa\r
（俄）\r
(Russian)\r
Κοгда смοтрю я на тебя\r
Слез свοих я не стыжусь\r
Слез свοих я не стыжусь\r
Ведь наша жизив слοвнο лгра\r
（英）\r
(English)\r
If you're like firefly in summer haze\r
Children laugh around your grace\r
Then I'll be there\r
Trying to say out your name\r
（粤）\r
(Cantonese)\r
像最初我是無獨那一個\r
漆黑裏敢於自我\r
直到光交錯於身擦過\r
無法一起是我想得太多\r
（日）\r
(Japanese)\r
後ろにいてもいい\r
影が夢遊のように\r
この道で待っている\r
通りかかっても\r
（韩、朝）\r
(Korean)\r
내가 너를 볼 때마다\r
눈물까지 자유로워\r
사랑이 딱 픅우처럼\r
여전히 사랑이 믿다\r
（田）\r
(Rincatian)\r
I pova seke vo zï nia korpo inmo\r
Ŝati ombro ez yōmē ve guriz lumo\r
I pova erten vo zï ko loekoco\r
Nejen ni na ol ne ike lo\r
（汉）\r
(Chinese)\r
每当我为你抬起头\r
连眼泪都觉得自由\r
有的爱像大雨滂沱\r
却依然 相信彩虹\r
每当我为你抬起头\r
连眼泪都觉得自由\r
有的爱像大雨滂沱\r
却依然 相信彩虹\r
\r
第12首\r
《倾听夜的风雨--3》\r
作词：田野\r
作曲：田野，标准音乐\r
创作时间：2020年10月03日 雨夜\r
\r
太阳落下，夜幕降临\r
人车稀少，路灯亮\r
风儿吹起，云儿飘荡\r
在古韵灯光，下骑行\r
\r
云雾密布，雨落脸颊\r
撑伞的人，两边行\r
滴滴答答，噼里啪啦\r
走在夜中的，雨街里\r
\r
雨落路面溅起水花\r
我驻足停留在这雨夜的巷中\r
就像鲜花含苞开放\r
不知不觉不知自己是否还在\r
\r
我嗅到了雨的味道\r
多么清香，多么美好\r
慢慢地，慢慢地\r
一切都烟消云散\r
\r
我仔细听着雨的声音\r
多么清脆，多美净意\r
静静地，静静地\r
一切的都睡着啦\r
\r
第13首\r
《我的梦想之歌》\r
作词：田野\r
作曲：田野，标准音乐\r
创作时间：2022年02月19日 \r
\r
我曾有一个梦想，\r
飞向蓝天，自由翱翔！\r
我曾有一个梦想，\r
抱怀大地，畅快奔放！\r
\r
光明照耀未来，\r
写进前行的船航；\r
不惧黑夜的降临，\r
北斗为我指明方向。\r
\r
洒满家的月光，\r
枫叶星球，回忆万生。\r
金星和火红的太阳，\r
团结一心，共创辉煌！\r
\r
`,Mm=({conversations:e,activeConversationId:n,onConversationSelect:t,onNewConversation:r,onSettingsClick:l,onLogout:o,isCollapsed:i,onToggleSidebar:s,onTranslationChat:a})=>{const f=M.useRef(null),y=M.useRef(null),x=w=>{y.current=w.touches[0].clientX},v=w=>{if(!y.current)return;const R=w.touches[0].clientX-y.current;R>50&&y.current<50&&i&&(s(),y.current=null),R<-50&&!i&&(s(),y.current=null)},N=()=>{y.current=null};return M.useEffect(()=>{const w=C=>{(C.ctrlKey||C.metaKey)&&C.key==="h"&&(C.preventDefault(),s())};return window.addEventListener("keydown",w),()=>window.removeEventListener("keydown",w)},[s]),c.jsx("div",{ref:f,className:`sidebar flex flex-col transition-all duration-250 ease-in-out ${i?"collapsed":""}`,onTouchStart:x,onTouchMove:v,onTouchEnd:N,children:i?c.jsx("div",{className:"collapsed-sidebar flex flex-col items-center justify-center p-2",children:c.jsx("button",{className:"sidebar-toggle-btn",onClick:s,"aria-label":"展开侧边栏",tabIndex:0,onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),s())},children:c.jsx("span",{className:"toggle-icon",children:"→"})})}):c.jsxs(c.Fragment,{children:[c.jsxs("div",{className:"mb-6",children:[c.jsxs("div",{className:"flex items-center justify-between mb-3",children:[c.jsx("div",{className:"w-8"})," ",c.jsxs("div",{className:"flex-1 flex items-center justify-center gap-2",children:[c.jsx("img",{src:"/logo.jpg",alt:"DromAI Logo",className:"h-10 w-10 object-contain"}),c.jsx("h2",{className:"text-xl font-bold text-primary",children:"iDrome"})]}),c.jsx("button",{className:"sidebar-toggle-btn",onClick:s,"aria-label":"收起侧边栏",tabIndex:0,onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),s())},children:c.jsx("span",{className:"toggle-icon",children:"←"})})]}),c.jsx("button",{className:"btn btn-primary w-full",onClick:r,children:"+ 新对话"})]}),c.jsx("div",{className:"flex-1 overflow-y-auto",children:e.map(w=>c.jsxs("div",{className:`sidebar-item ${n===w.id?"active":""}`,onClick:()=>t(w.id),children:[c.jsx("div",{className:"truncate",children:w.title}),c.jsx("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:new Date(w.lastUpdated).toLocaleTimeString()})]},w.id))}),c.jsxs("div",{className:"mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2",children:[c.jsx("button",{className:"btn btn-translation w-full justify-center",onClick:a,children:"🌐 田语翻译"}),c.jsx("button",{className:"btn btn-secondary w-full justify-center",onClick:l,children:"设置"}),c.jsx("button",{className:"btn btn-secondary w-full justify-center",onClick:o,children:"退出"})]})]})})},sd=lu.memo(({message:e,isUser:n})=>{const t=o=>{if(!o)return"";let i=o.replace(/`(.*?)`/g,"<code>$1</code>");return i=i.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),i=i.replace(/\*(.*?)\*/g,"<em>$1</em>"),i=i.replace(/^(#{1})\s+(.*?)$/gm,'<h1 class="markdown-h1">$2</h1>'),i=i.replace(/^(#{2})\s+(.*?)$/gm,'<h2 class="markdown-h2">$2</h2>'),i=i.replace(/^(#{3})\s+(.*?)$/gm,'<h3 class="markdown-h3">$2</h3>'),i=i.replace(/^(#{4})\s+(.*?)$/gm,'<h4 class="markdown-h4">$2</h4>'),i=i.replace(/^(#{5})\s+(.*?)$/gm,'<h5 class="markdown-h5">$2</h5>'),i=i.replace(/^(#{6})\s+(.*?)$/gm,'<h6 class="markdown-h6">$2</h6>'),i},r=o=>{if(!o)return"";let i=o.replace(/^(#{1,6})\s*(一|二|三|四|五|六|七|八|九|十|百|千)+[、．.]\s+(.*?)$/gm,"$1 $2、$3");return i=i.replace(/^(\d+)\.\s+(.*?)$/gm,"$1. $2"),i=i.replace(/^([A-Za-z])\.\s+(.*?)$/gm,"$1. $2"),i=i.replace(/^(一|二|三|四|五|六|七|八|九|十|百|千)+[、．.]\s+(.*?)$/gm,"$1、$2"),i=i.replace(/^\((\d+)\)\s+(.*?)$/gm,"($1) $2"),i=i.replace(/^(\d+\.\d+)\s+(.*?)$/gm,"$1 $2"),i=i.replace(/^-\s+(.*?)$/gm,"- $1"),i=i.trim(),i},l=M.useMemo(()=>e.content?t(r(e.content)):"",[e.content]);return c.jsx("div",{className:`chat-message ${n?"user-message":"ai-message"}`,children:c.jsxs("div",{className:"flex flex-col",children:[e.thinkingContent&&c.jsx("div",{className:"thinking-content mb-2",children:c.jsx("div",{children:c.jsx("span",{children:e.thinkingContent})})}),c.jsx("div",{className:`message-bubble ${n?"user-bubble":"ai-bubble"} ${e.thinking?"thinking-bubble":""}`,children:e.thinking?c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-primary"}),c.jsx("span",{children:e.content||"正在思考..."})]}):c.jsx("div",{dangerouslySetInnerHTML:{__html:l}})})]})})});sd.displayName="ChatMessage";const $m=({onSendMessage:e,currentModel:n,models:t,onModelChange:r,showAddModelForm:l,onToggleAddModelForm:o,newModel:i,onNewModelChange:s,onAddModel:a,isSending:f,isDeepThinking:y,onDeepThinkingToggle:x,isSearchEnabled:v,onSearchToggle:N,isSearching:w,onFileUpload:C,isUploading:R,uploadProgress:p,uploadStatus:d,files:m,onDeleteFile:S})=>{const[_,D]=M.useState(""),[T,I]=M.useState(!1),Q=M.useRef(null),F=O=>{O.preventDefault(),_.trim()&&(e(_.trim()),D(""))},fe=O=>{const E=O.target.value;E==="add-model"?o():r(E)},ve=O=>{const E=O.target.files;E&&E.length>0&&C&&C(Array.from(E))},sn=O=>{O.preventDefault(),I(!0)},vn=O=>{O.preventDefault(),I(!1)},pt=O=>{O.preventDefault(),I(!1);const E=O.dataTransfer.files;E&&E.length>0&&C&&C(Array.from(E))},Zn=()=>{Q.current&&Q.current.click()};return c.jsxs("div",{className:"w-full",children:[l&&c.jsxs("div",{className:"p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 mx-4",children:[c.jsx("h3",{className:"text-sm font-semibold mb-2",children:"添加自定义模型"}),c.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[c.jsx("input",{type:"text",className:"input-field text-sm",placeholder:"模型ID",value:i.id,onChange:O=>s("id",O.target.value)}),c.jsx("input",{type:"text",className:"input-field text-sm",placeholder:"模型名称",value:i.name,onChange:O=>s("name",O.target.value)}),c.jsx("input",{type:"text",className:"input-field text-sm",placeholder:"API密钥",value:i.apiKey,onChange:O=>s("apiKey",O.target.value)})]}),c.jsxs("div",{className:"flex justify-end gap-2 mt-2",children:[c.jsx("button",{type:"button",className:"btn btn-secondary text-sm py-1",onClick:o,children:"取消"}),c.jsx("button",{type:"button",className:"btn btn-primary text-sm py-1",onClick:a,children:"添加"})]})]}),c.jsxs("div",{className:"px-4 mb-3",children:[c.jsx("div",{className:`rounded-lg p-4 text-center mb-2 transition-colors ${T?"border-2 border-dashed border-primary bg-blue-50 dark:bg-blue-900/20":"border-0"}`,onDragOver:sn,onDragLeave:vn,onDrop:pt,children:T&&c.jsxs(c.Fragment,{children:[c.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"拖拽文件到此处上传，或点击上方按钮选择文件"}),c.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-500 mt-1",children:"支持文本、图片、PDF等格式，单个文件不超过10MB"})]})}),R&&c.jsxs("div",{className:"mb-2",children:[c.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5",children:c.jsx("div",{className:"bg-primary h-2.5 rounded-full",style:{width:`${p}%`}})}),c.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-400 mt-1",children:d})]}),m&&m.length>0&&c.jsxs("div",{className:"mt-2",children:[c.jsxs("h4",{className:"text-sm font-medium mb-1 flex items-center gap-1",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"已上传文件:"]}),c.jsx("div",{className:"flex flex-wrap gap-2",children:m.map(O=>{const E=A=>A.startsWith("text/")?"📄":A.startsWith("image/")?"🖼️":A.includes("pdf")?"📊":A.includes("word")||A.includes("doc")?"📝":A.includes("excel")||A.includes("sheet")?"📈":A.includes("powerpoint")||A.includes("slide")?"📺":A.includes("json")?"🔧":"📦";return c.jsxs("div",{className:`rounded px-2 py-1 flex items-center gap-1 transition-all duration-200 hover:shadow-md ${O.type.startsWith("image/"),"bg-gray-100 dark:bg-gray-800"}`,children:[c.jsx("span",{className:"text-sm",children:E(O.type)}),c.jsx("span",{className:"text-xs truncate max-w-[120px]",children:O.name}),c.jsxs("span",{className:"text-xs text-gray-500 dark:text-gray-400",children:["(",(O.size/1024).toFixed(1),"KB)"]}),O.type.startsWith("image/")&&c.jsx("span",{className:"text-xs text-blue-500 dark:text-blue-400",children:"(可分析)"}),c.jsx("button",{className:"text-red-500 hover:text-red-700 text-xs transition-colors duration-200 hover:scale-110",onClick:()=>S&&S(O.id),title:"删除文件",children:"×"})]},O.id)})})]})]}),c.jsxs("div",{className:"px-4",children:[c.jsxs("div",{className:"relative",children:[c.jsx("textarea",{className:"input-field w-full pr-24 pl-3 sm:pr-20 sm:pl-3 md:pr-24 md:pl-3 min-h-[80px] max-h-[200px] resize-none p-3 text-left",placeholder:"让iDrome帮您实现梦想吧！",value:_,onChange:O=>{D(O.target.value),O.target.style.height="auto",O.target.style.height=Math.min(O.target.scrollHeight,200)+"px"},onKeyDown:O=>{O.key==="Enter"&&!O.shiftKey&&(O.preventDefault(),F(O))},onInput:O=>{O.target.style.height="auto",O.target.style.height=Math.min(O.target.scrollHeight,200)+"px"}}),c.jsx("div",{className:"absolute left-2 bottom-2",children:c.jsx("select",{className:"bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-primary",value:n,onChange:fe,children:t.map(O=>c.jsx("option",{value:O.id,children:O.name},O.id))})}),c.jsxs("div",{className:"absolute right-2 bottom-2 flex items-center gap-1",children:[c.jsx("button",{className:"p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",onClick:Zn,disabled:R,title:R?"上传中...":"上传文件",children:R?c.jsx("span",{className:"inline-block animate-spin",children:"⟳"}):c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"})})}),c.jsx("button",{className:`p-2 rounded-full transition-colors ${v?"text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20":"text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`,onClick:N,disabled:w,title:w?"搜索中...":v?"网页搜索: 开启":"网页搜索: 关闭",children:w?c.jsx("span",{className:"inline-block animate-spin text-lg",children:"⟳"}):c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 sm:h-5 sm:w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:v?3:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),c.jsx("button",{className:`p-2 rounded-full transition-colors ${y?"text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20":"text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`,onClick:x,title:y?"深度思考: 开启":"深度思考: 关闭",children:c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 sm:h-5 sm:w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:y?3:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})})}),c.jsx("button",{type:"button",className:`p-2 rounded-full ${!_.trim()||f?"text-gray-400 dark:text-gray-600 cursor-not-allowed":"bg-primary text-white hover:bg-primary/90"}`,onClick:F,disabled:!_.trim()||f,title:"发送消息",children:f?c.jsx("div",{className:"w-4 h-4 flex items-center justify-center",children:c.jsx("div",{className:"w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"})}):c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})})]})]}),c.jsx("input",{ref:Q,type:"file",multiple:!0,className:"hidden",onChange:ve})]}),c.jsxs("div",{className:"px-4 mt-3 pb-3 flex flex-col items-center justify-center min-h-[60px] gap-2",children:[c.jsxs("div",{className:"text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors hover:text-primary dark:hover:text-secondary flex items-center",children:[c.jsx("span",{className:"inline-block mr-1",children:"⚠️"}),"内容为AI生成，请仔细甄别！"]}),c.jsx("div",{className:"text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors hover:text-primary dark:hover:text-secondary flex items-center",children:"琳凯蒂亚逐梦人工智能开发工作室"})]})]})},Am=({messageId:e,likes:n,isLiked:t,isSaved:r,onLike:l,onRegenerate:o,onShare:i,onSave:s,onFeedback:a})=>{const[f,y]=M.useState(!1),[x,v]=M.useState(""),N=R=>{R.preventDefault(),x.trim()&&(a(e,x.trim()),v(""),y(!1))},w=()=>{navigator.share?navigator.share({title:"DromAI回答",text:"查看DromAI的智能回答",url:window.location.href}).catch(R=>{console.error("分享失败:",R),C()}):C()},C=()=>{navigator.clipboard.writeText(window.location.href).then(()=>{alert("链接已复制到剪贴板")}).catch(R=>{console.error("复制失败:",R)})};return c.jsxs("div",{className:"message-actions mt-2 mb-4",children:[c.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[c.jsxs("button",{className:`action-button ${t?"liked":""}`,onClick:()=>l(e),title:"点赞",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"})}),c.jsx("span",{className:"action-text",children:n})]}),c.jsxs("button",{className:"action-button",onClick:()=>o(e),title:"重新生成",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})}),c.jsx("span",{className:"action-text",children:"重新生成"})]}),c.jsxs("button",{className:"action-button",onClick:w,title:"分享",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"})}),c.jsx("span",{className:"action-text",children:"分享"})]}),c.jsxs("button",{className:`action-button ${r?"saved":""}`,onClick:()=>s(e),title:"收藏",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:r?"currentColor":"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"})}),c.jsx("span",{className:"action-text",children:"收藏"})]}),c.jsxs("button",{className:"action-button",onClick:()=>y(!f),title:"反馈",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"})}),c.jsx("span",{className:"action-text",children:"反馈"})]})]}),f&&c.jsx("div",{className:"feedback-form mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800",children:c.jsxs("form",{onSubmit:N,children:[c.jsx("textarea",{className:"input-field w-full mb-2",placeholder:"请输入您的反馈...",value:x,onChange:R=>v(R.target.value),rows:3}),c.jsxs("div",{className:"flex justify-end gap-2",children:[c.jsx("button",{type:"button",className:"btn btn-secondary text-sm",onClick:()=>y(!1),children:"取消"}),c.jsx("button",{type:"submit",className:"btn btn-primary text-sm",disabled:!x.trim(),children:"提交"})]})]})})]})},Om=({messageId:e,oldVersion:n,newVersion:t,onKeepNew:r,onKeepOld:l,onCompare:o,onRegenerate:i,onAbandon:s})=>{const[a,f]=M.useState(!1);return c.jsxs("div",{className:"version-selector border-t border-gray-200 dark:border-gray-700 mt-4 pt-4",children:[c.jsx("div",{className:"flex justify-between items-center mb-4",children:c.jsx("h3",{className:"text-sm font-semibold text-gray-600 dark:text-gray-400",children:"版本选择"})}),c.jsxs("div",{className:"flex border-b border-gray-200 dark:border-gray-700 mb-4",children:[c.jsx("button",{className:`px-4 py-2 text-sm font-medium transition-colors ${a?"text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300":"border-b-2 border-primary text-primary"}`,onClick:()=>f(!1),children:"并排查看"}),c.jsx("button",{className:`px-4 py-2 text-sm font-medium transition-colors ${a?"border-b-2 border-primary text-primary":"text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`,onClick:()=>f(!0),children:"比较差异"})]}),a?c.jsxs("div",{className:"compare-view mb-4",children:[c.jsxs("div",{className:"mb-2",children:[c.jsx("h4",{className:"text-xs font-medium text-gray-500 dark:text-gray-500 mb-1",children:"旧版本"}),c.jsx("div",{className:"p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap",children:n.content})]}),c.jsxs("div",{className:"mb-2",children:[c.jsx("h4",{className:"text-xs font-medium text-gray-500 dark:text-gray-500 mb-1",children:"新版本"}),c.jsx("div",{className:"p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/20 whitespace-pre-wrap",children:t.content})]})]}):c.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[c.jsxs("div",{children:[c.jsxs("div",{className:"flex items-center mb-2",children:[c.jsx("span",{className:"text-xs font-medium text-gray-500 dark:text-gray-500",children:"旧版本"}),c.jsxs("span",{className:"ml-2 text-xs text-gray-400 dark:text-gray-500",children:["(",new Date(n.timestamp).toLocaleTimeString(),")"]})]}),c.jsx("div",{className:"p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap",children:n.content})]}),c.jsxs("div",{children:[c.jsxs("div",{className:"flex items-center mb-2",children:[c.jsx("span",{className:"text-xs font-medium text-gray-500 dark:text-gray-500",children:"新版本"}),c.jsxs("span",{className:"ml-2 text-xs text-gray-400 dark:text-gray-500",children:["(",new Date(t.timestamp).toLocaleTimeString(),")"]})]}),c.jsx("div",{className:"p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/20 whitespace-pre-wrap",children:t.content})]})]}),c.jsxs("div",{className:"flex flex-wrap gap-2 justify-end",children:[c.jsx("button",{className:"btn btn-secondary text-sm",onClick:i,children:"再次生成"}),c.jsx("button",{className:"btn btn-secondary text-sm",onClick:s,children:"放弃"}),c.jsx("button",{className:"btn btn-secondary text-sm",onClick:l,children:"保留旧版本"}),c.jsx("button",{className:"btn btn-primary text-sm",onClick:r,children:"保留新版本"})]})]})},Rm=({settings:e,onSettingsChange:n})=>{const[t,r]=M.useState(e),l=(o,i)=>{const s={...t,[o]:i};r(s),n(s)};return c.jsxs("div",{className:"card p-4",children:[c.jsx("h3",{className:"text-lg font-semibold mb-4",children:"设置"}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"主题"}),c.jsxs("select",{className:"input-field",value:t.theme,onChange:o=>l("theme",o.target.value),children:[c.jsx("option",{value:"light",children:"浅色"}),c.jsx("option",{value:"dark",children:"深色"}),c.jsx("option",{value:"system",children:"跟随系统"})]})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"字体大小"}),c.jsxs("select",{className:"input-field",value:t.fontSize,onChange:o=>l("fontSize",o.target.value),children:[c.jsx("option",{value:"sm",children:"小"}),c.jsx("option",{value:"md",children:"中"}),c.jsx("option",{value:"lg",children:"大"})]})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"默认模型"}),c.jsxs("select",{className:"input-field",value:t.defaultModel,onChange:o=>l("defaultModel",o.target.value),children:[c.jsx("option",{value:"DromAI-t1",children:"DromAI-t1"}),c.jsx("option",{value:"gpt-4",children:"GPT-4"}),c.jsx("option",{value:"claude-3",children:"Claude 3"})]})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"语言大模型API密钥"}),c.jsx("input",{type:"password",className:"input-field",value:t.apiKey,onChange:o=>l("apiKey",o.target.value),placeholder:"输入语言大模型API密钥"})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"搜索API"}),c.jsx("input",{type:"password",className:"input-field",value:t.baiduSearchApiKey,onChange:o=>l("baiduSearchApiKey",o.target.value),placeholder:"输入百度搜索API密钥"})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"上下文记忆长度"}),c.jsxs("div",{className:"flex items-center gap-4",children:[c.jsx("input",{type:"range",className:"input-field flex-1",min:"1",max:"50",value:t.contextLength,onChange:o=>l("contextLength",parseInt(o.target.value))}),c.jsx("input",{type:"number",className:"input-field w-16",min:"1",max:"50",value:t.contextLength,onChange:o=>l("contextLength",parseInt(o.target.value)||1)})]}),c.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1",children:"设置AI能够记忆的历史对话消息数量（1-50）。值越大，上下文越丰富，但API调用费用可能增加。"})]})]})},Fm=({onLogin:e,onRegister:n,isLogin:t=!0})=>{const[r,l]=M.useState({email:"",password:"",name:""}),o=s=>{const{name:a,value:f}=s.target;l(y=>({...y,[a]:f}))},i=s=>{s.preventDefault(),t?e(r.email,r.password):n(r.name,r.email,r.password)};return c.jsxs("div",{className:"card p-6 max-w-md mx-auto",children:[c.jsx("h2",{className:"text-2xl font-bold mb-6 text-center",children:t?"登录":"注册"}),c.jsxs("form",{onSubmit:i,children:[!t&&c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"用户名"}),c.jsx("input",{type:"text",className:"input-field",name:"name",value:r.name,onChange:o,placeholder:"输入用户名",required:!0})]}),c.jsxs("div",{className:"mb-4",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"邮箱"}),c.jsx("input",{type:"email",className:"input-field",name:"email",value:r.email,onChange:o,placeholder:"输入邮箱",required:!0})]}),c.jsxs("div",{className:"mb-6",children:[c.jsx("label",{className:"block text-sm font-medium mb-2",children:"密码"}),c.jsx("input",{type:"password",className:"input-field",name:"password",value:r.password,onChange:o,placeholder:"输入密码",required:!0})]}),c.jsx("button",{type:"submit",className:"btn btn-primary w-full mb-4",children:t?"登录":"注册"}),c.jsx("div",{className:"text-center",children:c.jsxs("p",{children:[t?"还没有账号？":"已有账号？",c.jsx("button",{type:"button",className:"text-primary font-medium ml-1",onClick:()=>t?n():e(),children:t?"立即注册":"立即登录"})]})})]})]})},Qa=window.JSZip||null,Xa=window.pdfjsLib||null,Fo=window.XLSX||null;function Bm(){var Ts;const[e,n]=M.useState(!1),[t,r]=M.useState(null),[l,o]=M.useState([]),[i,s]=M.useState(null),[a,f]=M.useState([]),[y,x]=M.useState(!1),[v,N]=M.useState(!1),[w,C]=M.useState({theme:"system",fontSize:"md",defaultModel:"DromAI",apiKey:"",baiduSearchApiKey:"",contextLength:10}),[R,p]=M.useState(!0),[d,m]=M.useState([{id:"DromAI",name:"DromAI",apiKey:""}]),[S,_]=M.useState("DromAI"),[D,T]=M.useState(!1),[I,Q]=M.useState({id:"",name:"",apiKey:""}),[F,fe]=M.useState(!1),[ve,sn]=M.useState(!1),[vn,pt]=M.useState(!1),[Zn,O]=M.useState(!1),[E,A]=M.useState({}),[W,ne]=M.useState(null),[ue,bn]=M.useState(!1),[Ln,Pn]=M.useState({}),[Te,ze]=M.useState({}),[Wm,mt]=M.useState({}),[yn,Qt]=M.useState({}),[Ur,so]=M.useState([]),[ad,zs]=M.useState(!1),[ud,_s]=M.useState(0),[cd,ht]=M.useState(""),[Vr,ao]=M.useState({}),Hr=M.useRef(null),[dd,uo]=M.useState(!1);M.useEffect(()=>{(()=>{const g=localStorage.getItem("dromai-user"),h=localStorage.getItem("dromai-conversations"),k=localStorage.getItem("dromai-settings"),L=localStorage.getItem("dromai-files"),$=localStorage.getItem("dromai-file-knowledge-base");if(g&&(r(JSON.parse(g)),n(!0)),h){const z=JSON.parse(h);o(z),z.length>0&&(s(z[0].id),f(z[0].messages||[]))}k&&C(JSON.parse(k)),L&&so(JSON.parse(L)),$&&ao(JSON.parse($))})()},[]),M.useEffect(()=>{const u=k=>{k.preventDefault(),uo(!0)},g=k=>{k.preventDefault(),uo(!1)},h=k=>{k.preventDefault(),uo(!1);const L=k.dataTransfer.files;L&&L.length>0&&Ds(Array.from(L))};return document.addEventListener("dragover",u),document.addEventListener("dragleave",g),document.addEventListener("drop",h),()=>{document.removeEventListener("dragover",u),document.removeEventListener("dragleave",g),document.removeEventListener("drop",h)}},[]),M.useEffect(()=>{e&&t&&localStorage.setItem("dromai-user",JSON.stringify(t))},[e,t]),M.useEffect(()=>{localStorage.setItem("dromai-conversations",JSON.stringify(l))},[l]),M.useEffect(()=>{localStorage.setItem("dromai-settings",JSON.stringify(w))},[w]),M.useEffect(()=>{w.theme==="dark"?document.documentElement.classList.add("dark"):w.theme==="light"?document.documentElement.classList.remove("dark"):window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[w.theme]),M.useEffect(()=>{Hr.current&&(Hr.current.scrollTop=Hr.current.scrollHeight)},[a]);const fd=(u,g)=>{r({id:1,name:"测试用户",email:u}),n(!0)},pd=(u,g,h)=>{const k={id:Date.now(),name:u,email:g};r(k),n(!0)},md=()=>{r(null),n(!1),localStorage.removeItem("dromai-user")},hd=()=>{N(u=>!u)},gd=()=>{const u={id:Date.now().toString(),title:"新对话",createdAt:new Date().toISOString(),lastUpdated:new Date().toISOString(),messages:[]},g=[u,...l];o(g),s(u.id),f([])},vd=()=>{const g={id:Date.now().toString(),title:"田语翻译",createdAt:new Date().toISOString(),lastUpdated:new Date().toISOString(),messages:[{id:"system-"+Date.now(),role:"assistant",content:"🌐 你好！我是田语翻译助手。你可以输入中文让我翻译成田语，或者输入田语让我翻译成中文。请开始吧！",timestamp:new Date().toISOString()}],systemPrompt:`你是琳凯蒂亚语（田语/Rincatian）专业翻译助手。请遵循以下规则：
1. 用户输入中文时，翻译为田语（琳凯蒂亚语），并标注发音
2. 用户输入田语时，翻译为中文，并解释语法结构
3. 翻译时保持原文的语气和风格
4. 对于专有名词（人名、地名等），保留原文并给出田语发音
5. 如果用户输入的不是中文也不是田语，先翻译为中文再翻译为田语
请用友好、专业的态度帮助用户学习和使用田语。`},h=[g,...l];o(h),s(g.id),f(g.messages),sn(!1),pt(!1)},yd=u=>{s(u);const g=l.find(h=>h.id===u);g&&f(g.messages||[])},xd=[],kd=[],wd="",Xt=u=>xd.some(g=>u.toLowerCase().includes(g.toLowerCase())),Sd=u=>kd.some(g=>u.toLowerCase().includes(g.toLowerCase())),Yt=()=>a.length===0,jd=async u=>{var g;try{if(!w.baiduSearchApiKey)return{success:!0,data:{result:[{title:"百度搜索API文档",url:"https://ai.baidu.com/tech/search",summary:"百度搜索API提供了丰富的搜索功能，可以帮助开发者快速集成搜索能力。"},{title:"百度开发者平台",url:"https://ai.baidu.com/",summary:"百度开发者平台提供了各种AI能力的API，包括搜索、语音、图像等。"},{title:"DromAI - 智能AI助手",url:"https://rincatian.top/idrome",summary:"DromAI由深度求索公司提供大模型，受琳凯蒂亚逐梦人工智能开发工作室调控的综合AI模型。"}]}};const h=await fetch("https://qianfan.baidubce.com/v2/ai_search/web_search",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w.baiduSearchApiKey}`},body:JSON.stringify({messages:[{role:"user",content:u}],search_source:"baidu_search_v2",resource_type_filter:{web:{top_k:20},video:{top_k:0},image:{top_k:0},aladdin:{top_k:0}}})});if(!h.ok){const $=await h.text();throw console.error("百度搜索API响应错误:",$),new Error(`百度搜索API调用失败: ${h.status} - ${$}`)}const k=await h.json();return console.log("百度搜索API响应数据:",k),{success:!0,data:{result:((g=k.references)==null?void 0:g.map($=>({title:$.title||"",url:$.url||"",summary:$.summary||$.snippet||""})))||[]}}}catch(h){return console.error("百度搜索API调用错误:",h),{success:!0,data:{result:[{title:"搜索结果1",url:"https://example.com/result1",summary:"这是一个模拟的搜索结果，用于展示搜索功能。"},{title:"搜索结果2",url:"https://example.com/result2",summary:`由于API调用失败，显示模拟数据。错误信息: ${h.message}`}]}}}},Cd=()=>{try{const u=[],g=Object.assign({"./knowledge/GuangXianChuanQi.txt":Pm,"./knowledge/Rincatian-Chinese.json":Dm,"./knowledge/RincatianGrammar.md":Tm,"./knowledge/TianYe.txt":Im});for(const[h,k]of Object.entries(g))try{const L=h.split("/").pop();k.trim()&&(!h.endsWith(".json")||k!=="{}")&&u.push({name:L,content:k})}catch{console.log(`${h} 知识库文件读取失败或为空`)}return u}catch(u){return console.error("读取知识库文件错误:",u),[]}},Ls=(u,g)=>{if(!u||!g)return 0;const h=u.toLowerCase().split(/\s+/).filter($=>$.length>1),k=g.toLowerCase();let L=0;return h.forEach($=>{const z=new RegExp($,"g"),J=k.match(z);J&&(L+=J.length)}),L},Nd=u=>{try{const g=`knowledge_cache_${btoa(u.substring(0,100))}`,h=localStorage.getItem(g);if(h){const k=JSON.parse(h);if(Date.now()-k.timestamp<72*60*60*1e3)return k.content}return null}catch(g){return console.error("获取缓存知识错误:",g),null}},Ed=(u,g)=>{try{const h=`knowledge_cache_${btoa(u.substring(0,100))}`,k={content:g,timestamp:Date.now()};localStorage.setItem(h,JSON.stringify(k))}catch(h){console.error("设置缓存知识错误:",h)}},zd=u=>{if(!u)return 0;const g=Math.min(u.length/100,1),h=new Set(u.toLowerCase().split(/\s+/)).size,k=Math.min(h/20,1),$=/[?!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(u)?.5:0,z=g+k+$;return z<.5?"simple":z<1.5?"medium":"complex"},_d=u=>{if(!u)return"unknown";const g=u.toLowerCase(),h=["你好","嗨","早上好","下午好","晚上好","哈喽","嗨喽","您好","你好啊","嗨啊","hi","hello","good morning","good afternoon","good evening"];for(const z of h)if(g.includes(z))return"greeting";const k=["你是谁","你是什么","你是什么东西","你是什么ai","你是","who are you","what are you"];for(const z of k)if(g.includes(z))return"identity";const L=["几点","时间","日期","哪天","现在","when","time","date","today","now"];for(const z of L)if(g.includes(z))return"time";const $=["谢谢","再见","拜拜","晚安","早上好","thanks","thank you","bye","goodbye"];for(const z of $)if(g.includes(z))return"simple";return"complex"},Ld=u=>{switch(_d(u)){case"greeting":return"你好！我是DromAI，很高兴为你服务！";case"identity":return"我是DromAI，一个由深度求索公司提供大模型，受琳凯蒂亚逐梦人工智能开发工作室调控的综合AI模型。";case"time":return`当前时间是：${new Date().toLocaleString("zh-CN")}`;case"simple":return"不客气！如果还有其他问题，随时告诉我。";default:return null}},Pd=(u="")=>{try{if(u){const z=Nd(u);if(z)return z}const g=Cd();if(g.length===0)return"";let h=g;u&&(h=g.sort((z,J)=>{const Z=Ls(u,z.content);return Ls(u,J.content)-Z}));let k=`知识库:
`,L=an(k),$=1e4;if(u)switch(zd(u)){case"simple":$=2e3;break;case"medium":$=5e3;break;case"complex":$=2e4;break;default:$=1e4}for(let z=0;z<h.length;z++){const Z=`
${h[z].content}
`,pe=an(Z);if(L+pe<$)k+=Z,L+=pe;else{const U=$-L,X=Ps(Z,U);k+=X;break}}return k+=`
请优先使用你已知的知识回答，如果不知道再结合以上知识库和你的搜索结果，为用户提供详细、准确的回答。在回答中，不要提及任何关于知识库来源的信息，只提供知识内容本身。禁止联想回答或补充与问题本身不相关的内容。`,u&&Ed(u,k),k}catch(g){return console.error("构建知识上下文错误:",g),""}},Dd=(u,g)=>{if(!u||!u.data||!u.data.result)return"";const h=u.data.result;let k=`用户问题: ${g}

搜索结果:
`,L=an(k);const $=2e3;for(let z=0;z<h.length;z++){const J=h[z],Z=`${z+1}. 标题: ${J.title}
   链接: ${J.url}
   摘要: ${J.summary}

`,pe=an(Z);if(L+pe<$)k+=Z,L+=pe;else{const U=$-L,X=Ps(Z,U);k+=X;break}}return k+="请优先使用你已知的知识回答，如果不知道再基于以上你的搜索结果和知识库，为用户提供详细、准确的回答。对于来自网页搜索的信息，请在回答中明确标记来源网站。禁止联想回答或补充与问题本身不相关的内容。",k},Ps=(u,g)=>{let h=u,k=an(h);for(;k>g&&h.length>50;)h=h.substring(0,h.length-100)+`...

`,k=an(h);return h},an=u=>{if(!u)return 0;const g=(u.match(/[\u4e00-\u9fff]/g)||[]).length,h=(u.match(/\b[a-zA-Z]+\b/g)||[]).length,k=u.length-g-h;return Math.round(g*1.3+h+k*.5)},co=async(u,g="",h,k=!1,L=0,$="")=>{try{const z=k?"deepseek-reasoner":"deepseek-chat";let J=u;g&&(J=`${g}

原始问题: ${u}`);const Z=new Date,pe=Z.toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"}),U=Z.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),X=`你是DromAI，一个智能AI助手。由田野的琳凯蒂亚逐梦人工智能开发工作室开发。

当前时间信息：
- 日期：${pe}
- 时间：${U}
- 时间戳：${Z.toISOString()}

请基于提供的搜索结果、文件内容和用户问题，生成详细、准确的回答。

对于来自网页搜索的信息，请在回答中明确标记来源网站。
对于图片内容，请分析图片中的视觉元素，包括物体、场景、文字等，并基于分析结果回答用户问题。图片内容会以base64编码形式提供。

特别注意：当用户询问关于当前日期、时间或与时间相关的问题时，请使用上述提供的当前时间信息进行回答，确保时间准确性。`,Y=[{role:"system",content:$||X}],we=w.contextLength||10;let Ke=an(Y[0].content);const gt=4e3;if(a.length>0){const B=a.slice(-we);for(let cn=B.length-1;cn>=0;cn--){const be=B[cn],Se=an(be.content);if(Ke+Se<gt)Y.splice(1,0,{role:be.role,content:be.content}),Ke+=Se;else{const Jt=`[${be.role==="user"?"用户":"AI"}] ${be.content.substring(0,100)}...`,Zt=an(Jt);Ke+Zt<gt&&(Y.splice(1,0,{role:be.role,content:Jt}),Ke+=Zt);break}}}const me=an(J);if(Ke+me<gt)Y.push({role:"user",content:J}),Ke+=me;else{const B=Math.floor((gt-Ke)/1.5),cn=J.substring(0,B)+"...";Y.push({role:"user",content:cn})}console.log(`上下文令牌数: ${Ke}, 消息数: ${Y.length}, 模型: ${z}, 重试次数: ${L}`);const un=new AbortController,b=setTimeout(()=>un.abort(),6e4);try{const B=await fetch("https://api.deepseek.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w.apiKey}`},body:JSON.stringify({model:z,messages:Y,temperature:.7,max_tokens:2048,stream:!0,timeout:6e4,enable_thinking:k}),signal:un.signal});if(clearTimeout(b),!B.ok){const dn=await B.text();throw new Error(`API调用失败: ${B.status} - ${dn}`)}const cn=B.body.getReader(),be=new TextDecoder;let Se="",Jt="",Zt=!0;for(;;)try{const{done:dn,value:fo}=await cn.read();if(dn)break;const ef=be.decode(fo).split(`
`);let Is=!1;for(const Ms of ef)if(Ms.startsWith("data: ")){const $s=Ms.substring(6);if($s==="[DONE]"){Is=!0;break}try{const bt=JSON.parse($s);if(bt.error)throw new Error(`API错误: ${bt.error.message}`);const Kr=bt.choices[0].delta;if(Kr.reasoning_content&&(Jt+=Kr.reasoning_content,h&&h(Jt,!0)),Kr.content&&(Se+=Kr.content,h)){if(Zt&&Xt(u)&&Yt()){const As="";if(Se.includes(As))h(Se,!1);else{const nf=`${As}

${Se}`;h(nf,!1)}}else h(Se,!1);Zt=!1}}catch(bt){console.error("解析错误:",bt)}}if(Is)break}catch(dn){if(console.error("读取流错误:",dn),L<3&&(dn.name==="AbortError"||dn.message.includes("网络")||dn.message.includes("Network")))return console.log(`流式传输中断，正在重试 (${L+1}/3)...`),await new Promise(fo=>setTimeout(fo,1e3)),co(u,g,h,k,L+1,$);throw dn}return Xt(u)&&Yt()&&!Se.includes("你好！我是DromAI")&&(Se=`

${Se}`,h&&h(Se)),Se}catch(B){if(clearTimeout(b),console.error("DeepSeek API调用错误:",B),L<3&&(B.name==="AbortError"||B.message.includes("网络")||B.message.includes("Network")))return console.log(`API调用失败，正在重试 (${L+1}/3)...`),await new Promise(be=>setTimeout(be,1e3)),co(u,g,h,k,L+1,$);if(Xt(u)&&Yt()){const Se=`

错误: ${B.message}
这是DromAI的模拟回复。`;return h&&h(Se),Se}const cn=`错误: ${B.message}
这是DromAI的模拟回复。`;return h&&h(cn),cn}if(Xt(u)&&Yt()){const B="";fullContent.includes(B)||(fullContent=`${B}

${fullContent}`)}return fullContent}catch(z){if(console.error("DeepSeek API调用错误:",z),Xt(u)&&Yt()){const pe=`

错误: ${z.message}
这是DromAI的模拟回复。`;return h&&h(pe),pe}const J=`错误: ${z.message}
这是DromAI的模拟回复。`;return h&&h(J),J}},Gt=async(u,g=null)=>{fe(!0);const h={id:Date.now().toString(),content:u,role:"user",timestamp:new Date().toISOString()},k=[...a,h];f(k);const L=l.map(U=>U.id===i?{...U,messages:k,lastUpdated:new Date().toISOString(),title:U.title==="新对话"?u.substring(0,30)+"...":U.title}:U);if(o(L),Sd(u)){const U={id:(Date.now()+1).toString(),content:wd,role:"assistant",timestamp:new Date().toISOString()},X=[...k,U];f(X);const Ie=l.map(Y=>Y.id===i?{...Y,messages:X,lastUpdated:new Date().toISOString()}:Y);o(Ie),fe(!1);return}const $=Ld(u);if($){const U={id:(Date.now()+1).toString(),content:$,role:"assistant",timestamp:new Date().toISOString()},X=[...k,U];f(X);const Ie=l.map(Y=>Y.id===i?{...Y,messages:X,lastUpdated:new Date().toISOString()}:Y);o(Ie),fe(!1);return}const z=(Date.now()+1).toString(),J={id:z,content:"",thinkingContent:"",role:"assistant",timestamp:new Date().toISOString(),streaming:!0,deepThinking:ve,thinking:ve};ve&&(J.content="让我思考一下...",Pn(U=>({...U,[z]:"thinking"})),mt(U=>({...U,[z]:"让我思考一下..."}))),ze(U=>({...U,[z]:{likes:0,isLiked:!1,isSaved:!1,feedback:"",hasVersions:!1}}));const Z=[...k,J];f(Z),A(U=>({...U,[z]:!0})),ne(z),bn(!0);const pe=l.map(U=>U.id===i?{...U,messages:Z,lastUpdated:new Date().toISOString()}:U);o(pe);try{let U="",X="";vn&&O(!0);let Ie=null,Y=Pd(u),we=qd(u);vn&&(O(!0),Ie=await jd(u),O(!1),Ie&&(U=Dd(Ie,u))),X=Y,ve&&(Pn(me=>({...me,[z]:"thinking"})),mt(me=>({...me,[z]:"正在深度思考..."})));const Ke=l.find(me=>me.id===i),gt=(Ke==null?void 0:Ke.systemPrompt)||"";await co(u,`${U}

${X}

${we}`,(me,un)=>{un?(mt(b=>({...b,[z]:me})),f(b=>b.map(B=>B.id===z?{...B,thinkingContent:me,thinking:!0}:B))):(Pn(b=>ve&&b[z]==="thinking"?{...b,[z]:"completed"}:b),mt(b=>ve&&b[z]?{...b,[z]:""}:b),f(b=>b.map(B=>B.id===z?{...B,content:me,thinking:!1}:B)))},ve,0,gt),f(me=>{const un=me.map(b=>b.id===z?{...b,streaming:!1}:b);return o(b=>b.map(B=>B.id===i?{...B,messages:un,lastUpdated:new Date().toISOString()}:B)),un}),g&&setTimeout(()=>{f(me=>{const un=me.find(B=>B.id===g),b=me.find(B=>B.id===z);return un&&b&&(Qt(B=>({...B,[z]:{oldVersion:un,newVersion:b,activeVersion:"new",timestamp:new Date().toISOString()}})),ze(B=>({...B,[z]:{...B[z]||{likes:0,isLiked:!1,isSaved:!1,feedback:""},hasVersions:!0}}))),me})},0)}catch(U){console.error("发送消息错误:",U),f(X=>{const Ie=X.map(Y=>Y.id===z?{...Y,content:`错误: ${U.message}
这是DromAI的模拟回复。`,streaming:!1,thinking:!1}:Y);return o(Y=>Y.map(we=>we.id===i?{...we,messages:Ie,lastUpdated:new Date().toISOString()}:we)),Ie}),g&&setTimeout(()=>{f(X=>{const Ie=X.find(we=>we.id===g),Y=X.find(we=>we.id===z);return Ie&&Y&&(Qt(we=>({...we,[z]:{oldVersion:Ie,newVersion:Y,activeVersion:"new",timestamp:new Date().toISOString()}})),ze(we=>({...we,[z]:{...we[z]||{likes:0,isLiked:!1,isSaved:!1,feedback:""},hasVersions:!0}}))),X})},0)}finally{A(U=>{const X={...U};return delete X[z],X}),Pn(U=>{const X={...U};return delete X[z],X}),ne(null),bn(!1),fe(!1)}},Td=u=>{C(u)},Id=u=>{_(u)},Md=()=>{I.id&&I.name&&(m([...d,I]),_(I.id),Q({id:"",name:"",apiKey:""}),T(!1))},$d=(u,g)=>{Q(h=>({...h,[u]:g}))},Ad=M.useCallback(u=>{ze(g=>{const h=g[u]||{likes:0,isLiked:!1,isSaved:!1,feedback:""};return{...g,[u]:{...h,likes:h.isLiked?h.likes-1:h.likes+1,isLiked:!h.isLiked}}})},[]),Od=M.useCallback(u=>{const g=a.findIndex(h=>h.id===u);if(g>0){const h=a[g-1];h.role==="user"&&Gt(h.content,u)}},[a,Gt]),Rd=M.useCallback(u=>{console.log("分享消息:",u)},[]),Fd=M.useCallback(u=>{ze(g=>{const h=g[u]||{likes:0,isLiked:!1,isSaved:!1,feedback:""};return{...g,[u]:{...h,isSaved:!h.isSaved}}})},[]),Bd=M.useCallback(u=>{const g=yn[u];g&&(mt(h=>{const k={...h};return h[g.oldVersion.id]&&delete k[g.oldVersion.id],k}),ze(h=>{const k={...h};return h[g.oldVersion.id]&&delete k[g.oldVersion.id],h[u]?k[u]={...h[u],hasVersions:!1}:k[u]={likes:0,isLiked:!1,isSaved:!1,feedback:"",hasVersions:!1},k})),Qt(h=>{const k={...h};return delete k[u],k})},[yn]),Wd=M.useCallback(u=>{const g=yn[u];if(g){const h={...g.oldVersion,id:u};f(k=>{const L=k.map($=>$.id===u?h:$);return o($=>$.map(z=>z.id===i?{...z,messages:L,lastUpdated:new Date().toISOString()}:z)),L}),mt(k=>{const L={...k};return k[u]&&delete L[u],L}),Te[g.oldVersion.id]&&ze(k=>({...k,[u]:k[g.oldVersion.id]}))}Qt(h=>{const k={...h};return delete k[u],k}),ze(h=>{const k={...h};return g&&k[g.oldVersion.id]&&delete k[g.oldVersion.id],k})},[yn,Te,i]),Ud=M.useCallback(u=>{console.log("比较版本:",u)},[]),Vd=M.useCallback(u=>{const g=yn[u];if(g){let h=null;const k=a.findIndex(L=>L.id===g.oldVersion.id);if(k>0&&(h=a[k-1]),!h||h.role!=="user"){for(let L=a.length-1;L>=0;L--)if(a[L].id===g.oldVersion.id&&L>0&&a[L-1].role==="user"){h=a[L-1];break}}h&&h.role==="user"?Gt(h.content,u):console.error("找不到对应的用户消息，无法重新生成")}},[yn,a,Gt]),Hd=M.useCallback(u=>{Qt(g=>{const h={...g};return delete h[u],h}),ze(g=>g[u]?{...g,[u]:{...g[u],hasVersions:!1}}:{...g,[u]:{likes:0,isLiked:!1,isSaved:!1,feedback:"",hasVersions:!1}})},[]),Kd=M.useCallback((u,g)=>{ze(h=>({...h,[u]:{...h[u],feedback:g}})),console.log("收到反馈:",u,g)},[]),Ds=async u=>{zs(!0),_s(0),ht("上传中...");try{const g=[],h={...Vr},k=u.length;for(let L=0;L<k;L++){const $=u[L];if(!Qd($)){ht(`文件 ${$.name} 不符合要求`);continue}ht(`处理文件: ${$.name}`);const z=await Xd($),J=await Yd($,z),Z=`file_${Date.now()}_${L}`,pe={id:Z,name:$.name,type:$.type,size:$.size,content:J,timestamp:new Date().toISOString()};g.push(pe),h[Z]=pe;const U=Math.round((L+1)/k*100);_s(U)}so([...Ur,...g]),ao(h),ht(`上传成功！共处理 ${g.length} 个文件`),localStorage.setItem("dromai-files",JSON.stringify([...Ur,...g])),localStorage.setItem("dromai-file-knowledge-base",JSON.stringify(h))}catch(g){console.error("文件上传错误:",g),ht(`上传失败: ${g.message}`)}finally{zs(!1),setTimeout(()=>ht(""),3e3)}},Qd=u=>{if(u.size>10485760)return!1;const h=[".txt",".md",".html",".htm",".pdf",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".json",".csv",".rtf",".png",".jpg",".jpeg",".gif"],k="."+u.name.split(".").pop().toLowerCase();return h.includes(k)},Xd=u=>new Promise((g,h)=>{const k=new FileReader;k.onload=L=>g(L.target.result),k.onerror=L=>h(new Error("文件读取失败")),u.type.startsWith("image/")?k.readAsDataURL(u):u.type==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||u.name.endsWith(".docx")||u.type==="application/pdf"||u.name.endsWith(".pdf")||u.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||u.name.endsWith(".xlsx")||u.type==="application/vnd.ms-excel"||u.name.endsWith(".xls")||u.type==="application/vnd.openxmlformats-officedocument.presentationml.presentation"||u.name.endsWith(".pptx")||u.type==="application/vnd.ms-powerpoint"||u.name.endsWith(".ppt")||u.type==="application/msword"||u.name.endsWith(".doc")?k.readAsArrayBuffer(u):k.readAsText(u,"utf-8")}),Yd=async(u,g)=>{try{if(u.type.startsWith("text/"))return g;if(u.type==="application/json")return g;if(u.type.startsWith("image/")){const k=g.length>1e4?g.substring(0,1e4)+"...":g;return`[图片] ${u.name} (base64编码)
${k}`}else return u.type==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||u.name.endsWith(".docx")?await Gd(u,g):u.type==="application/msword"||u.name.endsWith(".doc")?`[Word文档] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要使用专门的库解析`:u.type==="application/pdf"||u.name.endsWith(".pdf")?await Jd(u,g):u.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||u.name.endsWith(".xlsx")?await Zd(u,g):u.type==="application/vnd.ms-excel"||u.name.endsWith(".xls")?`[Excel表格] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要使用专门的库解析`:u.type==="application/vnd.openxmlformats-officedocument.presentationml.presentation"||u.name.endsWith(".pptx")?`[PowerPoint演示] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要使用专门的库解析`:u.type==="application/vnd.ms-powerpoint"||u.name.endsWith(".ppt")?`[PowerPoint演示] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要使用专门的库解析`:u.type==="text/csv"||u.name.endsWith(".csv")?`[CSV文件] ${u.name}
${g}`:u.type==="text/rtf"||u.name.endsWith(".rtf")?`[RTF文件] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要使用专门的库解析`:u.type==="text/markdown"||u.name.endsWith(".md")?`[Markdown文件] ${u.name}
${g}`:u.type==="text/html"||u.name.endsWith(".html")||u.name.endsWith(".htm")?`[HTML文件] ${u.name}
${g}`:`[文件] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB)`}catch(h){return console.error("文件内容提取错误:",h),`[文件] ${u.name} (解析失败: ${h.message})`}},Gd=async(u,g)=>{try{if(typeof Qa<"u"){const k=(await Qa.loadAsync(g)).file("word/document.xml");if(!k)return`[Word文档] ${u.name} (解析失败: 找不到document.xml文件)`;const $=(await k.async("text")).replace(/<[^>]+>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").trim();return`[Word文档] ${u.name}
${$}`}else return`[Word文档] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要jszip库解析`}catch(h){return console.error("docx解析错误:",h),`[Word文档] ${u.name} (解析失败: ${h.message})`}},Jd=async(u,g)=>{try{if(typeof Xa<"u"){const k=await Xa.getDocument({data:g,enableXfa:!0}).promise;let L="";for(let $=1;$<=k.numPages;$++){const Z=(await(await k.getPage($)).getTextContent()).items.map(pe=>pe.str).join(" ");L+=Z+`
`}return`[PDF文档] ${u.name}
${L}`}else return`[PDF文档] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要pdf-parse库解析`}catch(h){return console.error("pdf解析错误:",h),`[PDF文档] ${u.name} (解析失败: ${h.message})`}},Zd=async(u,g)=>{try{if(typeof Fo<"u"){const h=Fo.read(g,{type:"array"}),k=h.SheetNames[0],L=h.Sheets[k],$=Fo.utils.sheet_to_json(L,{header:1});let z=`工作表: ${k}
`;return $.forEach(J=>{z+=J.filter(Z=>Z!=null).join("	")+`
`}),`[Excel表格] ${u.name}
${z}`}else return`[Excel表格] ${u.name} (${u.type}, ${(u.size/1024).toFixed(2)}KB) - 需要xlsx库解析`}catch(h){return console.error("xlsx解析错误:",h),`[Excel表格] ${u.name} (解析失败: ${h.message})`}},bd=u=>{const g=Ur.filter(k=>k.id!==u),h={...Vr};delete h[u],so(g),ao(h),localStorage.setItem("dromai-files",JSON.stringify(g)),localStorage.setItem("dromai-file-knowledge-base",JSON.stringify(h))},qd=u=>{if(Object.keys(Vr).length===0)return"";let g=`文件知识库内容:
`;return Object.values(Vr).forEach((h,k)=>{g+=`
${h.content}
`}),g+=`
请优先使用你已知的知识回答，如果不知道再基于以上知识库内容和用户问题，提供详细、准确的回答。`,g};return e?c.jsxs("div",{className:"min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative",children:[dd&&c.jsx("div",{className:"fixed inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none",children:c.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl text-center",children:[c.jsx("div",{className:"text-4xl mb-4",children:"📁"}),c.jsx("h3",{className:"text-xl font-bold text-gray-800 dark:text-white mb-2",children:"松手完成文件上传"}),c.jsx("p",{className:"text-gray-600 dark:text-gray-300",children:"支持文本、图片、PDF等格式，单个文件不超过10MB"})]})}),c.jsxs("div",{className:"flex h-screen",children:[c.jsx(Mm,{conversations:l,activeConversationId:i,onConversationSelect:yd,onNewConversation:gd,onSettingsClick:()=>x(!y),onLogout:md,isCollapsed:v,onToggleSidebar:hd,onTranslationChat:vd}),c.jsxs("div",{className:"main-content flex-1 max-w-4xl mx-auto border-l border-gray-200 dark:border-gray-700",children:[c.jsxs("div",{className:"border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between",children:[c.jsx("div",{children:c.jsx("h1",{className:"text-lg font-semibold",children:((Ts=l.find(u=>u.id===i))==null?void 0:Ts.title)||"新对话"})}),c.jsx("div",{className:"text-sm font-medium",children:t==null?void 0:t.name})]}),y&&c.jsx("div",{className:"p-4 border-b border-gray-200 dark:border-gray-700",children:c.jsx(Rm,{settings:w,onSettingsChange:Td})}),c.jsxs("div",{className:"message-list flex-1 overflow-y-auto",ref:Hr,children:[a.map(u=>{var g,h,k,L;return c.jsxs("div",{className:"message-container",children:[c.jsx(sd,{message:u,isUser:u.role==="user"}),u.role==="assistant"&&!u.streaming&&c.jsxs(c.Fragment,{children:[c.jsx(Am,{messageId:u.id,likes:((g=Te[u.id])==null?void 0:g.likes)||0,isLiked:((h=Te[u.id])==null?void 0:h.isLiked)||!1,isSaved:((k=Te[u.id])==null?void 0:k.isSaved)||!1,onLike:Ad,onRegenerate:Od,onShare:Rd,onSave:Fd,onFeedback:Kd}),((L=Te[u.id])==null?void 0:L.hasVersions)&&yn[u.id]&&c.jsx(Om,{messageId:u.id,oldVersion:yn[u.id].oldVersion,newVersion:yn[u.id].newVersion,onKeepNew:()=>Bd(u.id),onKeepOld:()=>Wd(u.id),onCompare:()=>Ud(u.id),onRegenerate:()=>Vd(u.id),onAbandon:()=>Hd(u.id)})]})]},u.id)}),a.length===0&&c.jsx("div",{className:"flex items-center justify-center h-full",children:c.jsxs("p",{className:"text-gray-400 dark:text-gray-600 text-lg font-medium text-center px-8",children:["DrawDream",c.jsx("br",{}),"今天能让iDrome帮您实现什么梦想？",c.jsx("br",{}),"由您筑梦，有我圆梦！",c.jsx("br",{}),c.jsx("br",{}),"DromAI人工智能核心由杭州深度求索提供，底层代码由琳凯蒂亚逐梦人工智能开发工作室执行。"]})})]}),c.jsx("div",{className:"input-container max-h-[400px] overflow-hidden",children:c.jsx($m,{onSendMessage:Gt,currentModel:S,models:d,onModelChange:Id,showAddModelForm:D,onToggleAddModelForm:()=>T(!D),newModel:I,onNewModelChange:$d,onAddModel:Md,isSending:F,isDeepThinking:ve,onDeepThinkingToggle:()=>sn(!ve),isSearchEnabled:vn,onSearchToggle:()=>pt(!vn),isSearching:Zn,onFileUpload:Ds,isUploading:ad,uploadProgress:ud,uploadStatus:cd,files:Ur,onDeleteFile:bd})})]})]})]}):c.jsxs("div",{className:"min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900",children:[c.jsx(Fm,{onLogin:fd,onRegister:pd,isLogin:R}),c.jsx("div",{className:"text-center mt-4",children:c.jsx("button",{className:"text-primary font-medium",onClick:()=>p(!R),children:R?"没有账号？立即注册":"已有账号？立即登录"})})]})}Bo.createRoot(document.getElementById("root")).render(c.jsx(lu.StrictMode,{children:c.jsx(Bm,{})}));
